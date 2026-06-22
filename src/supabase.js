import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if valid credentials are provided
const hasCredentials = supabaseUrl && supabaseUrl !== 'YOUR_SUPABASE_URL' && supabaseAnonKey && supabaseAnonKey !== 'YOUR_SUPABASE_ANON_KEY';

let supabaseInstance = null;

if (hasCredentials) {
  try {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
    console.log("Supabase client initialized successfully.");
  } catch (error) {
    console.error("Failed to initialize Supabase client. Falling back to mock store.", error);
  }
}

// BroadcastChannel for cross-tab communication
const broadcast = typeof window !== 'undefined' ? new BroadcastChannel('aether_orders_channel') : null;

// Mock database helper
const getMockOrders = () => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem('aether_orders');
  return stored ? JSON.parse(stored) : [];
};

const saveMockOrders = (orders) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('aether_orders', JSON.stringify(orders));
  }
};

// Initial setup of mock orders if empty
if (typeof window !== 'undefined' && !localStorage.getItem('aether_orders')) {
  saveMockOrders([]);
}

// Keep track of active mock subscription callbacks in the current tab/window
const activeSubscriptions = new Set();

// Create a fallback mock client
const mockSupabase = {
  isMock: true,
  from(table) {
    if (table !== 'orders') {
      return {
        select: () => Promise.resolve({ data: [], error: null }),
        insert: () => Promise.resolve({ data: [], error: null }),
        update: () => Promise.resolve({ data: [], error: null })
      };
    }

    return {
      select(columns) {
        const data = getMockOrders();
        // sort by date desc
        data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        
        const promise = Promise.resolve({ data, error: null });
        
        promise.eq = (key, value) => {
          const filtered = data.filter(r => r[key] === value);
          const eqPromise = Promise.resolve({ data: filtered, error: null });
          eqPromise.order = () => eqPromise;
          return eqPromise;
        };
        
        promise.order = (key, options) => {
          return promise;
        };

        return promise;
      },
      async insert(records) {
        const current = getMockOrders();
        const newRecords = records.map(r => ({
          ...r,
          created_at: r.created_at || new Date().toISOString(),
          status: r.status || 'Pending'
        }));
        const updated = [...newRecords, ...current];
        saveMockOrders(updated);
        
        // Broadcast insertion
        newRecords.forEach(record => {
          broadcast?.postMessage({
            type: 'INSERT',
            record
          });
          // Notify active local subscriptions in the same window
          activeSubscriptions.forEach(trigger => trigger('INSERT', record));
        });

        return { data: newRecords, error: null };
      },
      update(updates) {
        return {
          async eq(key, value) {
            const current = getMockOrders();
            let updatedRecord = null;
            const updated = current.map(r => {
              if (r[key] === value) {
                updatedRecord = { ...r, ...updates };
                return updatedRecord;
              }
              return r;
            });
            
            if (updatedRecord) {
              saveMockOrders(updated);
              broadcast?.postMessage({
                type: 'UPDATE',
                record: updatedRecord
              });
              // Notify active local subscriptions in the same window
              activeSubscriptions.forEach(trigger => trigger('UPDATE', updatedRecord));
            }
            return { data: updatedRecord ? [updatedRecord] : [], error: null };
          }
        };
      }
    };
  },
  channel(name) {
    const callbacks = [];
    
    const channelObj = {
      on(event, filter, callback) {
        callbacks.push({ event, filter, callback });
        return channelObj;
      },
      subscribe() {
        const handler = (event) => {
          const { type, record } = event.data;
          callbacks.forEach(({ callback }) => {
            callback({
              eventType: type,
              new: record,
              old: type === 'UPDATE' ? { order_id: record.order_id } : null
            });
          });
        };

        broadcast?.addEventListener('message', handler);

        // Define local trigger callback
        const localTrigger = (type, record) => {
          callbacks.forEach(({ callback }) => {
            callback({
              eventType: type,
              new: record,
              old: type === 'UPDATE' ? { order_id: record.order_id } : null
            });
          });
        };
        activeSubscriptions.add(localTrigger);

        return {
          unsubscribe() {
            broadcast?.removeEventListener('message', handler);
            activeSubscriptions.delete(localTrigger);
          }
        };
      }
    };

    return channelObj;
  }
};

export const supabase = supabaseInstance || mockSupabase;

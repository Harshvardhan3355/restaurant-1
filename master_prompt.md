# Master Prompt: Cafe Website & Real-Time KDS Dashboard

Copy and paste this prompt into an AI coding assistant to rebuild this entire end-to-end cafe ordering platform from scratch.

---

```text
Act as a senior full-stack developer and build a premium, responsive React SPA website for a local cafe named "Café Aroma" (located in Chinchwad, Maharashtra) using Vite, React Router, Tailwind CSS v4, Framer Motion, and Lucide React. The platform must feature a customer storefront, a real-time order tracker, and a secure lockable Kitchen Display System (KDS) dashboard connected to a Supabase PostgreSQL database.

Follow the guidelines below to implement the design, structure, and features:

### 1. Design System & Global Styles
- Theme Colors:
  - Espresso Dark (#2C1A11), Espresso Medium (#3D2517)
  - Warm Cream Light (#FDFBF7), Warm Cream Medium (#F5EFEB)
  - Soft Terracotta Accent (#D47A55)
  - Charcoal Text (#2B2D2F)
- Typography: Use Playfair Display for headings (serif, warm) and Plus Jakarta Sans for body text (clean, legibility).
- Styles: Implement glassmorphism helper classes (glass-nav, glass-card) and custom espresso-colored scrollbars.

### 2. Assets (Assets Directory)
Use high-quality placeholder images or generate:
- hero_cafe_bg.png: Cozy cafe interior with warm lighting.
- about_cafe.png: A professional barista crafting a pour-over brew.
- artisanal_roasts.png: Freshly roasted coffee beans on a tray.
- fresh_pastries.png: Flaky croissants on a bakery display.
- signature_desserts.png: Layered signature tiramisu cake.

### 3. Storefront Pages & Layout
- Layout component: Holds sticky responsive glassmorphic Navbar and Footer. Footer should contain hours, contact, and SVG social icons.
- Home Page: Cozy hero overlay, Typewriter headline effect ("perfect moments", "custom roasts", "fresh memories"), quick-info feature strip, and 3 featured cards.
- Menu Page:
  - Tabs: Hot Drinks, Cold Brews, Bites & Savories, Sweets & Desserts.
  - Sync active tabs with URL search parameters (e.g. ?category=coldbrews).
  - Display items using MenuCard with spring scale hover effects and ratings.
- About Page: Splits coffee sourcing data cards (Ethiopia, Costa Rica), details roasting philosophy in a "Cupping Notes" table, and centers a co-founders quote block.
- Contact Page: Displays contact details, active contact form with confirmation, and an inline SVG geometric styled road-river map of Pimpri-Chinchwad showing the cafe's exact location.

### 4. Interactive Checkout Flow (CartDrawer component)
- Global State: Manage cart items, totals, and orders list using a unified CartContext.
- Wizard Steps:
  - Step 1: Review cart items (increment, decrement, trash, grand totals).
  - Step 2: Pickup details input form (Customer Name, 10-digit Phone, Email Address, and Pickup Time dropdown).
  - Step 3: Payment details (UPI QR portal / simulated card validation).
  - Step 4: 3D Secure SMS OTP Approval (Accept code "7724" for instant verification).
  - Step 5: Printable Invoice Receipt showing Invoice ID, Pickup Code, customer metadata, and "Track Live Order" primary CTA button.

### 5. Supabase Real-Time Integration (src/supabase.js & CartContext.jsx)
- Supabase Schema Table 'orders':
  - Columns: order_id (text, PK), pickup_code (text), customer_name (text), customer_phone (text), customer_email (text), pickup_time (text), items (jsonb), subtotal (numeric), gst (numeric), packaging_fee (numeric), grand_total (numeric), payment_method (text), status (text - default 'Pending'), created_at (timestamptz).
- Context Operations:
  - On Mount: Fetch all historical orders from Supabase sorted by date.
  - Subscription: Subscribe to real-time postgres_changes on 'orders' table (INSERT, UPDATE, DELETE) and update state instantly on other tabs/devices.
  - addOrder: Inserts new records into Supabase and fires EmailJS confirmations.
  - updateOrderStatus: Updates status (Pending -> Preparing -> Ready -> Served) in Supabase.

### 6. Live Order Tracker Page (/track/:orderId)
- Setup route "/track/:orderId" mapping to OrderTracker.jsx.
- On Mount: Fetch the order from Supabase matching the orderId and subscribe to live PostgreSQL updates for this order.
- Timeline Stepper: Visual horizontal/vertical stepper showing: Order Placed -> In Preparation -> Ready for Pickup -> Completed.
- Sound Chimes: Programmatically synthesize sweet chime notification sounds using the browser's Web Audio API when the status updates (Preparing = double rising tone, Ready = high sparkling triplet chime, Served = goodbye chime).
- Display: Large pickup code highlighted when status is "Ready", full invoice details, and action buttons to "Order Something Else" (redirects to /menu) and "Back to Home". No auto-redirects; let the client review completed tickets as long as they want.

### 7. Secure Kitchen Display System (ChefDashboard.jsx at /chef)
- PIN Gate Lock Screen: Protect dashboard access with passcode "8850". Keypad must be a 3x4 numeric layout supporting mouse clicks and physical keyboard events (0-9, Backspace, Enter, Escape). Play oscillator buzzing sound on wrong PIN, success chime on correct PIN.
- Lanes Display:
  - Pending Lane: Cards can be advanced to "Preparing" via "Start Preparing".
  - Preparing Lane: Cards can be advanced to "Ready" via "Mark as Ready".
  - Ready Lane: Contains "Serve / Hand Over" button and a green "WhatsApp Notification" link.
    - WhatsApp Link: Custom wa.me link pre-filled with customer details and pickup codes (formats phone with +91 country prefix if 10-digit).
- Analytics Summary: Show served sales total, active queued count, best-selling item, and daily revenue statistics.
- Responsive Column Layout:
  - On desktop (medium and up): Side-by-side 3-column lanes layout.
  - On mobile: Mobile column tab switcher bar (New | Preparing | Ready) with badge counters. Hide/show active lanes based on chosen tab to prevent squished layouts.
- KDS Card Timers & Aging Warnings:
  - Render "Placed Xm ago" ticker on cards, force-refreshing via a 30-second interval hook.
  - If a Pending or Preparing card exceeds 10 minutes, turn border amber.
  - If it exceeds 15 minutes, turn border flashing red (pulse animation) with glowing red shadows to indicate KDS priority alerts.
```

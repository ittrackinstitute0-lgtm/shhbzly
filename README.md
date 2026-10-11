# 👑 Khan Jee Restaurant - E-Commerce & Admin Panel

A modern, responsive, and luxury E-Commerce restaurant web application with a comprehensive real-time Admin Management Dashboard, built for **Khan Jee Restaurant** (Jacobabad, Sindh).

![Khan Jee Restaurant](https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=1200&q=80)

---

## 🌟 Overview & Highlights

- **Luxury Mughlai & Royal Spices Aesthetic**: Deep obsidian/charcoal background with radiant amber gold (`#f59e0b`) accents, glassmorphic card overlays, and smooth micro-interactions.
- **Client-Side E-Commerce Storefront (`index.html`)**:
  - Live food menu categorized by Karahi, Biryani, BBQ, Desi, Fast Food, Tandoor & Breads, Desserts & Beverages.
  - Interactive Search & Sorting (by rating, popularity, price).
  - Slide-out Cart Drawer with item counters, subtotal, and promo code support (e.g. `KHAN20` for 20% discount).
  - Complete Checkout Modal supporting Delivery & Self-Pickup with Cash on Delivery, JazzCash / EasyPaisa, or Online Bank Transfer.
  - Instant printable receipt slip and Kitchen Order Ticket (KOT) preview.
  - Interactive VIP Table Reservation system for family lounges and rooftop dining.
- **Executive Admin Management Panel (`admin.html`)**:
  - Secure Admin Login Screen (PIN: `admin123` with 1-click demo unlock).
  - Real-Time Analytics Dashboard: Total Revenue (PKR Rs.), Order Volume, Active Menu Items, Pending Table Bookings, and Category Popularity Bars.
  - Orders Manager: Filter and change order statuses in real-time (`Pending`, `Preparing`, `Out for Delivery`, `Delivered`, `Cancelled`).
  - Menu Dishes CRUD: Add new dishes with photos, price, spice level, toggle In-Stock / Out-of-Stock, and edit/delete.
  - Table Reservations Manager: Review guest counts, special requests, and confirm/cancel bookings.
  - System Configuration & Backup: Update restaurant contact information, adjust delivery charges, download complete JSON database backups, or reset to fresh demo data.

---

## 📁 Project Structure

```
├── index.html          # Main Customer E-Commerce Storefront
├── admin.html          # Executive Admin Panel & Dashboard
├── css/
│   ├── style.css       # Master Styling for Storefront (Responsive, Dark Royal Theme)
│   └── admin.css       # Executive Dashboard & Data Table Styling
├── js/
│   ├── data.js         # Unified LocalStorage State & Seed Dishes Data
│   ├── app.js          # Storefront Interactions, Cart, Checkout, Table Bookings
│   └── admin.js        # Admin Dashboard Operations, Orders & Menu Management
└── README.md           # Project Documentation
```

---

## 🚀 Getting Started

1. Clone or download this repository:
   ```bash
   git clone https://github.com/ittrackinstitute0-lgtm/shhbzly.git
   ```
2. Open `index.html` in any web browser to view the customer restaurant website.
3. Open `admin.html` in any web browser to access the management portal:
   - **Default Admin PIN**: `admin123`

---

## 🛠️ Built With

- **HTML5**: Semantic and accessible markup.
- **Vanilla CSS3**: Modern variables, CSS Grid, Flexbox, Glassmorphism, animations.
- **JavaScript (ES6+)**: Reactive UI updates, custom events, and persistent HTML5 LocalStorage.
- **Unsplash Imagery**: Authentic, mouth-watering high-resolution South Asian & Mughlai food photography.

---

## 📄 License

This project is licensed under the MIT License - feel free to customize and use it for your restaurant business.

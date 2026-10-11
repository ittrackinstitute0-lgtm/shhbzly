/**
 * Khan Jee Restaurant - Storefront Application Logic
 * Modern, High-Performance, Interactive E-commerce
 */

// Application State
const State = {
    currentCategory: 'all',
    searchQuery: '',
    sortBy: 'featured',
    activeCoupon: null,
    cart: []
};

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

function initApp() {
    loadCartFromStorage();
    setupNavigation();
    setupCategoryTabs();
    setupSearchAndSort();
    setupCartDrawer();
    setupReservationForm();
    setupCheckoutModal();
    setupEventListeners();
    
    // Initial Render of Menu
    renderMenu();
    updateCartUI();
}

// Global Toast System
function showToast(message, type = 'success') {
    let container = document.getElementById('toastContainer');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toastContainer';
        container.className = 'toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icon = type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ';
    toast.innerHTML = `
        <span class="toast-icon">${icon}</span>
        <span class="toast-message">${message}</span>
    `;

    container.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 50);

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 400);
    }, 3200);
}

// Navigation & Scrolling
function setupNavigation() {
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    const mobileToggle = document.getElementById('mobileNavToggle');
    const navLinks = document.getElementById('navLinks');
    if (mobileToggle && navLinks) {
        mobileToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
        
        // Close nav on click link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
            });
        });
    }
}

// Category Tabs
function setupCategoryTabs() {
    const tabs = document.querySelectorAll('.cat-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            State.currentCategory = tab.dataset.category;
            renderMenu();
        });
    });
}

// Search and Sort
function setupSearchAndSort() {
    const searchInput = document.getElementById('menuSearchInput');
    const sortSelect = document.getElementById('menuSortSelect');

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            State.searchQuery = e.target.value.toLowerCase().trim();
            renderMenu();
        });
    }

    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            State.sortBy = e.target.value;
            renderMenu();
        });
    }
}

// Filter and Sort Menu Items
function getFilteredMenuItems() {
    let items = DB.getMenu().filter(item => item.available !== false);

    // Filter by Category
    if (State.currentCategory !== 'all') {
        items = items.filter(item => item.category === State.currentCategory);
    }

    // Filter by Search Query
    if (State.searchQuery) {
        items = items.filter(item => 
            item.name.toLowerCase().includes(State.searchQuery) ||
            item.description.toLowerCase().includes(State.searchQuery) ||
            item.categoryName.toLowerCase().includes(State.searchQuery)
        );
    }

    // Sort
    if (State.sortBy === 'price-low') {
        items.sort((a, b) => a.price - b.price);
    } else if (State.sortBy === 'price-high') {
        items.sort((a, b) => b.price - a.price);
    } else if (State.sortBy === 'rating') {
        items.sort((a, b) => b.rating - a.rating);
    } else if (State.sortBy === 'popular') {
        items.sort((a, b) => (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0));
    }

    return items;
}

// Render Menu Cards
function renderMenu() {
    const menuGrid = document.getElementById('menuGrid');
    if (!menuGrid) return;

    const items = getFilteredMenuItems();

    if (items.length === 0) {
        menuGrid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px;">
                <div style="font-size: 3rem; margin-bottom: 12px; opacity: 0.5;">🍲</div>
                <h3 style="font-size: 1.4rem; color: #fff; margin-bottom: 8px;">No Delicious Dishes Found</h3>
                <p style="color: var(--text-secondary);">Try clearing your search query or choosing another category filter.</p>
            </div>
        `;
        return;
    }

    menuGrid.innerHTML = items.map(item => `
        <div class="food-card" data-id="${item.id}">
            <div class="food-card-thumb">
                <img src="${item.image}" alt="${item.name}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80'">
                <div class="card-badges">
                    ${item.isPopular ? `<span class="tag-badge tag-popular">🔥 Best Seller</span>` : ''}
                    ${item.oldPrice ? `<span class="tag-badge tag-discount">Save ${formatPrice(item.oldPrice - item.price)}</span>` : ''}
                </div>
                <button class="quick-view-btn" onclick="openQuickView('${item.id}')" title="Quick View">
                    🔍
                </button>
            </div>
            <div class="food-card-body">
                <div class="card-meta-top">
                    <span class="card-category">${item.categoryName || item.category}</span>
                    <span class="card-rating">★ ${item.rating} <span style="color:var(--text-muted);font-size:0.75rem;">(${item.reviewsCount})</span></span>
                </div>
                <h4 class="food-title">${item.name}</h4>
                <p class="food-desc">${item.description}</p>
                <div class="card-spice-diet">
                    <span class="diet-pill ${item.isVeg ? 'veg' : 'non-veg'}">
                        ● ${item.isVeg ? 'Vegetarian' : 'Halal Meat'}
                    </span>
                    <span class="spice-pill">
                        🌶️ ${capitalizeFirst(item.spiceLevel || 'medium')} Spice
                    </span>
                </div>
                <div class="card-footer">
                    <div class="price-wrap">
                        <span class="price-current">${formatPrice(item.price)}</span>
                        ${item.oldPrice ? `<span class="price-old">${formatPrice(item.oldPrice)}</span>` : ''}
                    </div>
                    <button class="btn-add-cart" onclick="addToCart('${item.id}')">
                        <span>+ Add</span>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Quick View Modal
function openQuickView(itemId) {
    const item = DB.getMenuItem(itemId);
    if (!item) return;

    const modal = document.getElementById('quickViewModal');
    const modalContent = document.getElementById('quickViewContent');
    if (!modal || !modalContent) return;

    modalContent.innerHTML = `
        <div class="quick-view-grid">
            <div class="quick-view-img">
                <img src="${item.image}" alt="${item.name}" onerror="this.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80'">
            </div>
            <div>
                <span class="section-tag" style="margin-bottom:10px;">${item.categoryName}</span>
                <h3 style="font-size:1.6rem; color:#fff; margin-bottom:10px;">${item.name}</h3>
                <div style="display:flex; align-items:center; gap:12px; margin-bottom:14px;">
                    <span style="color:#facc15; font-weight:700;">★ ${item.rating}</span>
                    <span style="color:var(--text-muted); font-size:0.85rem;">(${item.reviewsCount} Authentic Reviews)</span>
                </div>
                <p style="color:var(--text-secondary); line-height:1.6; margin-bottom:20px; font-size:0.95rem;">
                    ${item.description}
                </p>
                <div style="background:var(--bg-surface-elevated); padding:14px; border-radius:10px; margin-bottom:20px; display:flex; gap:16px; font-size:0.88rem;">
                    <div><strong>Type:</strong> ${item.isVeg ? '🥬 Vegetarian' : '🥩 100% Halal Meat'}</div>
                    <div><strong>Spice:</strong> 🌶️ ${capitalizeFirst(item.spiceLevel || 'medium')}</div>
                </div>
                <div style="display:flex; align-items:center; justify-content:space-between; margin-top:20px;">
                    <div>
                        <div style="font-size:1.6rem; font-weight:800; color:var(--primary-light);">${formatPrice(item.price)}</div>
                        ${item.oldPrice ? `<div style="font-size:0.9rem; color:var(--text-muted); text-decoration:line-through;">${formatPrice(item.oldPrice)}</div>` : ''}
                    </div>
                    <button class="btn-primary" onclick="addToCart('${item.id}'); closeModal('quickViewModal');">
                        🛒 Add to Order
                    </button>
                </div>
            </div>
        </div>
    `;

    modal.classList.add('active');
}

// Cart Logic
function loadCartFromStorage() {
    State.cart = DB.getCart();
}

function saveCartToStorage() {
    DB.saveCart(State.cart);
}

function addToCart(itemId, qty = 1) {
    const item = DB.getMenuItem(itemId);
    if (!item) return;

    const existingIndex = State.cart.findIndex(c => c.id === itemId);
    if (existingIndex > -1) {
        State.cart[existingIndex].quantity += qty;
    } else {
        State.cart.push({
            id: item.id,
            name: item.name,
            price: item.price,
            image: item.image,
            quantity: qty
        });
    }

    saveCartToStorage();
    updateCartUI();
    showToast(`Added "${item.name}" to cart! 🍽️`, 'success');
}

function updateCartQuantity(itemId, delta) {
    const index = State.cart.findIndex(c => c.id === itemId);
    if (index === -1) return;

    State.cart[index].quantity += delta;
    if (State.cart[index].quantity <= 0) {
        State.cart.splice(index, 1);
        showToast('Item removed from cart', 'info');
    }

    saveCartToStorage();
    updateCartUI();
}

function removeFromCart(itemId) {
    State.cart = State.cart.filter(c => c.id !== itemId);
    saveCartToStorage();
    updateCartUI();
    showToast('Item removed from cart', 'info');
}

function updateCartUI() {
    // Badges
    const totalCount = State.cart.reduce((sum, item) => sum + item.quantity, 0);
    const badges = document.querySelectorAll('.cart-badge, .mobile-cart-badge');
    badges.forEach(b => {
        b.textContent = totalCount;
        b.style.display = totalCount > 0 ? 'flex' : 'none';
    });

    const mobileCartBtn = document.getElementById('mobileFloatingCart');
    if (mobileCartBtn) {
        mobileCartBtn.style.display = totalCount > 0 ? 'flex' : 'none';
    }

    renderCartDrawerItems();
    updateCartTotals();
}

function renderCartDrawerItems() {
    const container = document.getElementById('cartDrawerItems');
    if (!container) return;

    if (State.cart.length === 0) {
        container.innerHTML = `
            <div class="cart-empty">
                <div class="cart-empty-icon">🛒</div>
                <h4>Your Tray is Empty</h4>
                <p>Explore Khan Jee's royal menu and add fresh sizzling karahis, biryanis or BBQ!</p>
                <button class="btn-primary" onclick="closeCartDrawer(); window.location.href='#menu';">Browse Menu</button>
            </div>
        `;
        return;
    }

    container.innerHTML = `
        <div class="cart-items-list">
            ${State.cart.map(item => `
                <div class="cart-item">
                    <div class="cart-item-img">
                        <img src="${item.image}" alt="${item.name}">
                    </div>
                    <div class="cart-item-details">
                        <div class="cart-item-title">${item.name}</div>
                        <div class="cart-item-price">${formatPrice(item.price)}</div>
                        <div class="cart-item-controls">
                            <div class="qty-counter">
                                <button class="qty-btn" onclick="updateCartQuantity('${item.id}', -1)">-</button>
                                <span class="qty-display">${item.quantity}</span>
                                <button class="qty-btn" onclick="updateCartQuantity('${item.id}', 1)">+</button>
                            </div>
                            <span style="font-weight:700; color:#fff; font-size:0.9rem;">${formatPrice(item.price * item.quantity)}</span>
                        </div>
                    </div>
                    <button class="cart-item-remove" onclick="removeFromCart('${item.id}')" title="Remove">✕</button>
                </div>
            `).join('')}
        </div>
    `;
}

function updateCartTotals() {
    const settings = DB.getSettings();
    const subtotal = State.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    let discount = 0;
    if (State.activeCoupon) {
        if (State.activeCoupon.discountPercent) {
            discount = Math.round((subtotal * State.activeCoupon.discountPercent) / 100);
        }
    }

    let deliveryFee = subtotal > 0 ? settings.deliveryFee : 0;
    if (subtotal >= settings.freeDeliveryThreshold || (State.activeCoupon && State.activeCoupon.freeDelivery)) {
        deliveryFee = 0;
    }

    const grandTotal = Math.max(0, subtotal - discount + deliveryFee);

    // Update Elements
    const subtotalEl = document.getElementById('cartSubtotal');
    const discountEl = document.getElementById('cartDiscount');
    const discountRow = document.getElementById('cartDiscountRow');
    const deliveryEl = document.getElementById('cartDeliveryFee');
    const grandTotalEl = document.getElementById('cartGrandTotal');
    const checkoutBtn = document.getElementById('btnCartCheckout');

    if (subtotalEl) subtotalEl.textContent = formatPrice(subtotal);
    if (discountEl && discountRow) {
        if (discount > 0) {
            discountRow.style.display = 'flex';
            discountEl.textContent = `-${formatPrice(discount)}`;
        } else {
            discountRow.style.display = 'none';
        }
    }
    if (deliveryEl) {
        deliveryEl.textContent = deliveryFee === 0 ? (subtotal > 0 ? 'FREE' : 'Rs. 0') : formatPrice(deliveryFee);
    }
    if (grandTotalEl) grandTotalEl.textContent = formatPrice(grandTotal);
    if (checkoutBtn) checkoutBtn.disabled = State.cart.length === 0;

    return { subtotal, discount, deliveryFee, grandTotal };
}

// Cart Drawer Setup
function setupCartDrawer() {
    const openBtn = document.getElementById('cartBtn');
    const closeBtn = document.getElementById('closeCartDrawer');
    const overlay = document.getElementById('cartOverlay');
    const drawer = document.getElementById('cartDrawer');
    const applyCouponBtn = document.getElementById('btnApplyCoupon');
    const couponInput = document.getElementById('couponCodeInput');

    if (openBtn) openBtn.addEventListener('click', openCartDrawer);
    if (closeBtn) closeBtn.addEventListener('click', closeCartDrawer);
    if (overlay) overlay.addEventListener('click', closeCartDrawer);

    if (applyCouponBtn && couponInput) {
        applyCouponBtn.addEventListener('click', () => {
            const code = couponInput.value.toUpperCase().trim();
            if (!code) return;

            if (COUPONS[code]) {
                State.activeCoupon = COUPONS[code];
                updateCartTotals();
                showToast(`Coupon "${code}" applied successfully! 🎁`, 'success');
            } else {
                showToast('Invalid promo code. Try "KHAN20" or "WELCOME10"', 'error');
            }
        });
    }
}

function openCartDrawer() {
    document.getElementById('cartOverlay')?.classList.add('active');
    document.getElementById('cartDrawer')?.classList.add('active');
}

function closeCartDrawer() {
    document.getElementById('cartOverlay')?.classList.remove('active');
    document.getElementById('cartDrawer')?.classList.remove('active');
}

// Checkout Flow
function setupCheckoutModal() {
    const btnCheckout = document.getElementById('btnCartCheckout');
    const form = document.getElementById('checkoutForm');

    if (btnCheckout) {
        btnCheckout.addEventListener('click', () => {
            if (State.cart.length === 0) return;
            closeCartDrawer();
            openCheckoutModal();
        });
    }

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            processOrderPlacement();
        });
    }
}

function openCheckoutModal() {
    const modal = document.getElementById('checkoutModal');
    if (!modal) return;

    const totals = updateCartTotals();
    const summaryEl = document.getElementById('checkoutOrderSummary');
    if (summaryEl) {
        summaryEl.innerHTML = `
            <div style="background:var(--bg-surface-elevated); padding:16px; border-radius:10px; margin-bottom:18px;">
                <h5 style="color:#fff; margin-bottom:10px; font-size:0.95rem; border-bottom:1px solid var(--border-color); padding-bottom:6px;">Your Order Summary (${State.cart.length} unique items)</h5>
                <div style="max-height:140px; overflow-y:auto; margin-bottom:12px; display:flex; flex-direction:column; gap:6px;">
                    ${State.cart.map(i => `
                        <div style="display:flex; justify-content:space-between; font-size:0.85rem; color:var(--text-secondary);">
                            <span>${i.name} × ${i.quantity}</span>
                            <span style="color:#fff;">${formatPrice(i.price * i.quantity)}</span>
                        </div>
                    `).join('')}
                </div>
                <div style="border-top:1px solid var(--border-color); padding-top:8px; display:flex; justify-content:space-between; font-weight:800; font-size:1.1rem; color:var(--primary-light);">
                    <span>Total Payable:</span>
                    <span>${formatPrice(totals.grandTotal)}</span>
                </div>
            </div>
        `;
    }

    modal.classList.add('active');
}

function processOrderPlacement() {
    const totals = updateCartTotals();
    const name = document.getElementById('custName')?.value.trim();
    const phone = document.getElementById('custPhone')?.value.trim();
    const address = document.getElementById('custAddress')?.value.trim();
    const notes = document.getElementById('custNotes')?.value.trim();
    const deliveryType = document.querySelector('input[name="deliveryType"]:checked')?.value || 'Delivery';
    const paymentMethod = document.getElementById('custPaymentMethod')?.value || 'Cash on Delivery';

    if (!name || !phone || (deliveryType === 'Delivery' && !address)) {
        showToast('Please provide your name, phone number, and delivery address.', 'error');
        return;
    }

    const orderData = {
        customer: { name, phone, address, notes },
        items: [...State.cart],
        subtotal: totals.subtotal,
        discount: totals.discount,
        deliveryFee: totals.deliveryFee,
        total: totals.grandTotal,
        paymentMethod,
        deliveryType,
        couponUsed: State.activeCoupon ? 'KHAN20' : null
    };

    const createdOrder = DB.createOrder(orderData);
    DB.clearCart();
    State.cart = [];
    State.activeCoupon = null;
    updateCartUI();

    closeModal('checkoutModal');
    showOrderSuccessReceipt(createdOrder);
    showToast(`Order #${createdOrder.id} confirmed! Thank you! 🎉`, 'success');
}

// Receipt & Order Success
function showOrderSuccessReceipt(order) {
    const modal = document.getElementById('receiptModal');
    const content = document.getElementById('receiptContent');
    if (!modal || !content) return;

    content.innerHTML = `
        <div class="order-success-box">
            <div class="success-icon-wrap">✓</div>
            <h3 style="color:#fff; font-size:1.4rem; margin-bottom:4px;">Order Placed Successfully!</h3>
            <p style="color:var(--text-secondary); font-size:0.9rem;">We have received your royal order and our chefs are getting it ready.</p>
            
            <div class="receipt-slip" id="printableReceipt">
                <div class="receipt-header">
                    <h4 style="font-family:var(--font-heading); color:#fff; font-size:1.2rem;">KHAN JEE RESTAURANT</h4>
                    <p style="font-size:0.75rem; color:var(--text-muted);">VIP Road, Jacobabad • Phone: +92 300 1234567</p>
                    <div style="margin-top:8px; font-weight:700; color:var(--primary-light);">ORDER ID: #${order.id}</div>
                    <div style="font-size:0.75rem; color:var(--text-secondary);">${formatDate(order.createdAt)}</div>
                </div>

                <div style="margin-bottom:12px; font-size:0.85rem; border-bottom:1px dashed var(--border-color); padding-bottom:8px;">
                    <div><strong>Customer:</strong> ${order.customer.name} (${order.customer.phone})</div>
                    <div><strong>Service:</strong> ${order.deliveryType} • <strong>Payment:</strong> ${order.paymentMethod}</div>
                    ${order.customer.address ? `<div><strong>Address:</strong> ${order.customer.address}</div>` : ''}
                    ${order.customer.notes ? `<div><strong>Notes:</strong> ${order.customer.notes}</div>` : ''}
                </div>

                <div class="receipt-items-list">
                    ${order.items.map(item => `
                        <div class="receipt-item-row">
                            <span>${item.name} × ${item.quantity}</span>
                            <span>${formatPrice(item.price * item.quantity)}</span>
                        </div>
                    `).join('')}
                </div>

                <div style="border-top:1px dashed var(--border-color); padding-top:8px; font-size:0.88rem;">
                    <div class="receipt-item-row" style="color:var(--text-muted);">
                        <span>Subtotal:</span>
                        <span>${formatPrice(order.subtotal)}</span>
                    </div>
                    ${order.discount > 0 ? `
                        <div class="receipt-item-row" style="color:var(--accent-green);">
                            <span>Discount:</span>
                            <span>-${formatPrice(order.discount)}</span>
                        </div>
                    ` : ''}
                    <div class="receipt-item-row" style="color:var(--text-muted);">
                        <span>Delivery Fee:</span>
                        <span>${order.deliveryFee === 0 ? 'FREE' : formatPrice(order.deliveryFee)}</span>
                    </div>
                    <div class="receipt-item-row" style="font-weight:800; font-size:1.1rem; color:var(--primary-light); margin-top:6px; border-top:1px solid var(--border-color); padding-top:6px;">
                        <span>Total Bill:</span>
                        <span>${formatPrice(order.total)}</span>
                    </div>
                </div>
            </div>

            <div style="display:flex; gap:12px; justify-content:center; margin-top:20px;">
                <button class="btn-primary" onclick="window.print()">🖨️ Print Receipt</button>
                <button class="btn-secondary" onclick="closeModal('receiptModal')">Done</button>
            </div>
        </div>
    `;

    modal.classList.add('active');
}

// Table Reservation
function setupReservationForm() {
    const form = document.getElementById('tableBookingForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('resName')?.value.trim();
        const phone = document.getElementById('resPhone')?.value.trim();
        const guests = document.getElementById('resGuests')?.value;
        const date = document.getElementById('resDate')?.value;
        const time = document.getElementById('resTime')?.value;
        const tableType = document.getElementById('resTableType')?.value;
        const specialRequests = document.getElementById('resRequests')?.value.trim();

        if (!name || !phone || !date || !time) {
            showToast('Please complete all reservation fields.', 'error');
            return;
        }

        const resData = {
            customerName: name,
            phone,
            guests: Number(guests) || 2,
            date,
            time,
            tableType: tableType || 'Standard Family Dining',
            specialRequests
        };

        const newRes = DB.createReservation(resData);
        form.reset();

        showToast(`Table booked successfully! Reference: #${newRes.id} 🥂`, 'success');
        
        // Show reservation confirm modal
        const modal = document.getElementById('receiptModal');
        const content = document.getElementById('receiptContent');
        if (modal && content) {
            content.innerHTML = `
                <div class="order-success-box">
                    <div class="success-icon-wrap" style="color:var(--primary-light); border-color:var(--primary);">📅</div>
                    <h3 style="color:#fff; font-size:1.4rem; margin-bottom:4px;">Table Reservation Requested!</h3>
                    <p style="color:var(--text-secondary); font-size:0.9rem;">Thank you, ${name}! Your booking has been forwarded to Khan Jee VIP Lounge manager.</p>
                    <div class="receipt-slip" style="text-align:center;">
                        <h4 style="color:var(--primary-light); font-size:1.2rem; margin-bottom:6px;">Booking #${newRes.id}</h4>
                        <p style="color:#fff;">Date: <strong>${newRes.date}</strong> at <strong>${newRes.time}</strong></p>
                        <p style="color:#fff;">Guests: <strong>${newRes.guests} Persons</strong> (${newRes.tableType})</p>
                    </div>
                    <button class="btn-primary" onclick="closeModal('receiptModal')">Great, Thank You</button>
                </div>
            `;
            modal.classList.add('active');
        }
    });
}

// Modal Helpers
function closeModal(modalId) {
    document.getElementById(modalId)?.classList.remove('active');
}

// Cross-tab synchronization
function setupEventListeners() {
    window.addEventListener('kj_menu_updated', () => {
        renderMenu();
    });

    // Close modals on clicking overlay background
    document.querySelectorAll('.modal-overlay').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    });
}

function capitalizeFirst(string) {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1);
}

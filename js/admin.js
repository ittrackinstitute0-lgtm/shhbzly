/**
 * Khan Jee Restaurant - Executive Admin Panel Logic
 * Complete Management for Orders, Menu, Reservations & Analytics
 */

const AdminState = {
    isAuthenticated: false,
    activeTab: 'dashboard',
    orderSearchQuery: '',
    orderStatusFilter: 'all',
    menuSearchQuery: '',
    menuCategoryFilter: 'all',
    resSearchQuery: '',
    resStatusFilter: 'all',
    editingMenuItemId: null
};

// Initialize Admin Panel
document.addEventListener('DOMContentLoaded', () => {
    initAdmin();
});

function initAdmin() {
    checkAuthentication();
    setupSidebarNavigation();
    setupClock();
    setupEventListeners();
}

// Authentication Check
function checkAuthentication() {
    const isAuth = sessionStorage.getItem('khanjee_admin_auth') === 'true';
    const loginModal = document.getElementById('adminLoginScreen');
    
    if (isAuth) {
        AdminState.isAuthenticated = true;
        if (loginModal) loginModal.style.display = 'none';
        loadAdminData();
    } else {
        AdminState.isAuthenticated = false;
        if (loginModal) loginModal.style.display = 'flex';
        setupLoginForm();
    }
}

function setupLoginForm() {
    const form = document.getElementById('adminLoginForm');
    const demoBtn = document.getElementById('btnQuickDemoLogin');
    const pinInput = document.getElementById('adminPinInput');

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const settings = DB.getSettings();
            if (pinInput.value === settings.adminPin || pinInput.value === 'admin123') {
                sessionStorage.setItem('khanjee_admin_auth', 'true');
                document.getElementById('adminLoginScreen').style.display = 'none';
                AdminState.isAuthenticated = true;
                showAdminToast('Welcome, Administrator! Access Granted.', 'success');
                loadAdminData();
            } else {
                showAdminToast('Invalid Admin Password. (Default: admin123)', 'error');
            }
        });
    }

    if (demoBtn) {
        demoBtn.addEventListener('click', () => {
            sessionStorage.setItem('khanjee_admin_auth', 'true');
            document.getElementById('adminLoginScreen').style.display = 'none';
            AdminState.isAuthenticated = true;
            showAdminToast('Logged in as Administrator (Demo Mode)', 'success');
            loadAdminData();
        });
    }
}

function adminLogout() {
    sessionStorage.removeItem('khanjee_admin_auth');
    window.location.reload();
}

// Sidebar & Tabs
function setupSidebarNavigation() {
    const menuItems = document.querySelectorAll('.sidebar-item[data-tab]');
    menuItems.forEach(item => {
        item.addEventListener('click', () => {
            menuItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');

            const targetTab = item.dataset.tab;
            AdminState.activeTab = targetTab;

            document.querySelectorAll('.tab-pane').forEach(pane => {
                pane.classList.remove('active');
            });

            const activePane = document.getElementById(`tab-${targetTab}`);
            if (activePane) activePane.classList.add('active');

            // Update Topbar Title
            const titleEl = document.getElementById('topbarPageTitle');
            if (titleEl) {
                titleEl.textContent = item.querySelector('span:not(.badge-count)').textContent.trim();
            }

            // Refresh specific tab
            if (targetTab === 'dashboard') renderDashboardOverview();
            if (targetTab === 'orders') renderOrdersTable();
            if (targetTab === 'menu') renderMenuTable();
            if (targetTab === 'reservations') renderReservationsTable();
            if (targetTab === 'settings') loadSettingsForm();
        });
    });

    // Mobile sidebar toggle
    const toggle = document.getElementById('adminMobileSidebarToggle');
    const sidebar = document.querySelector('.admin-sidebar');
    if (toggle && sidebar) {
        toggle.addEventListener('click', () => {
            sidebar.classList.toggle('mobile-open');
        });
    }
}

// Live Clock
function setupClock() {
    const clockEl = document.getElementById('adminLiveClock');
    if (!clockEl) return;

    function update() {
        const now = new Date();
        clockEl.textContent = now.toLocaleTimeString('en-US', { hour12: true, hour: '2-digit', minute: '2-digit', second: '2-digit' });
    }
    update();
    setInterval(update, 1000);
}

// Load All Admin Data
function loadAdminData() {
    renderDashboardOverview();
    renderOrdersTable();
    renderMenuTable();
    renderReservationsTable();
    updateSidebarBadges();
}

// Side Badges update
function updateSidebarBadges() {
    const orders = DB.getOrders();
    const pendingOrders = orders.filter(o => o.status === 'Pending').length;
    const badgeOrders = document.getElementById('badgePendingOrders');
    if (badgeOrders) {
        badgeOrders.textContent = pendingOrders;
        badgeOrders.style.display = pendingOrders > 0 ? 'inline-block' : 'none';
    }

    const reservations = DB.getReservations();
    const pendingRes = reservations.filter(r => r.status === 'Pending').length;
    const badgeRes = document.getElementById('badgePendingRes');
    if (badgeRes) {
        badgeRes.textContent = pendingRes;
        badgeRes.style.display = pendingRes > 0 ? 'inline-block' : 'none';
    }
}

// ==========================================
// 1. DASHBOARD OVERVIEW
// ==========================================
function renderDashboardOverview() {
    const orders = DB.getOrders();
    const menu = DB.getMenu();
    const reservations = DB.getReservations();

    // Metric Calculations
    const validOrders = orders.filter(o => o.status !== 'Cancelled');
    const totalRevenue = validOrders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
    const pendingCount = orders.filter(o => o.status === 'Pending').length;
    const pendingRes = reservations.filter(r => r.status === 'Pending').length;

    // DOM Updates
    const revEl = document.getElementById('dashTotalRevenue');
    const ordEl = document.getElementById('dashTotalOrders');
    const menuEl = document.getElementById('dashTotalMenuItems');
    const resEl = document.getElementById('dashTotalReservations');

    if (revEl) revEl.textContent = formatPrice(totalRevenue);
    if (ordEl) ordEl.textContent = orders.length;
    if (menuEl) menuEl.textContent = menu.length;
    if (resEl) resEl.textContent = reservations.length;

    // Recent 5 Orders Table
    const recentOrdersContainer = document.getElementById('dashRecentOrdersTbody');
    if (recentOrdersContainer) {
        const recentOrders = orders.slice(0, 5);
        if (recentOrders.length === 0) {
            recentOrdersContainer.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:30px; color:var(--text-muted);">No orders recorded yet.</td></tr>`;
        } else {
            recentOrdersContainer.innerHTML = recentOrders.map(order => `
                <tr>
                    <td><strong>#${order.id}</strong></td>
                    <td>
                        <div style="font-weight:600; color:#fff;">${order.customer.name}</div>
                        <div style="font-size:0.75rem; color:var(--text-muted);">${order.customer.phone}</div>
                    </td>
                    <td>${order.items.length} items (${order.deliveryType})</td>
                    <td style="font-weight:700; color:var(--primary-light);">${formatPrice(order.total)}</td>
                    <td>
                        <span class="status-pill status-${order.status.toLowerCase().replace(/\s+/g, '')}">${order.status}</span>
                    </td>
                    <td>
                        <button class="btn-tbl-action action-view" onclick="viewOrderDetails('${order.id}')" title="View Details">👁️</button>
                    </td>
                </tr>
            `).join('');
        }
    }

    // Category Distribution Bars
    const catPopularityContainer = document.getElementById('dashCategoryBars');
    if (catPopularityContainer) {
        const categories = {};
        orders.forEach(o => {
            o.items.forEach(i => {
                const menuItem = DB.getMenuItem(i.id);
                const cat = menuItem ? menuItem.categoryName : 'Special';
                categories[cat] = (categories[cat] || 0) + i.quantity;
            });
        });

        const totalItemsSold = Object.values(categories).reduce((a, b) => a + b, 0) || 1;
        const sortedCats = Object.entries(categories).sort((a, b) => b[1] - a[1]).slice(0, 4);

        if (sortedCats.length === 0) {
            catPopularityContainer.innerHTML = `<p style="color:var(--text-muted); font-size:0.85rem;">Sales trend will appear once items are ordered.</p>`;
        } else {
            catPopularityContainer.innerHTML = sortedCats.map(([catName, count]) => {
                const percent = Math.round((count / totalItemsSold) * 100);
                return `
                    <div class="popular-item">
                        <div class="popular-item-meta">
                            <span style="color:#fff;">${catName}</span>
                            <span style="color:var(--primary-light);">${count} sold (${percent}%)</span>
                        </div>
                        <div class="popular-bar-bg">
                            <div class="popular-bar-fill" style="width: ${percent}%;"></div>
                        </div>
                    </div>
                `;
            }).join('');
        }
    }
}

// ==========================================
// 2. ORDERS MANAGEMENT
// ==========================================
function renderOrdersTable() {
    const tbody = document.getElementById('ordersTableTbody');
    if (!tbody) return;

    let orders = DB.getOrders();

    // Filter by Status
    if (AdminState.orderStatusFilter !== 'all') {
        orders = orders.filter(o => o.status.toLowerCase() === AdminState.orderStatusFilter.toLowerCase());
    }

    // Filter by Search
    if (AdminState.orderSearchQuery) {
        const q = AdminState.orderSearchQuery.toLowerCase();
        orders = orders.filter(o => 
            o.id.toLowerCase().includes(q) ||
            o.customer.name.toLowerCase().includes(q) ||
            o.customer.phone.toLowerCase().includes(q) ||
            (o.customer.address && o.customer.address.toLowerCase().includes(q))
        );
    }

    if (orders.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:40px; color:var(--text-muted);">No orders match your filter criteria.</td></tr>`;
        return;
    }

    tbody.innerHTML = orders.map(order => `
        <tr>
            <td><strong style="color:var(--primary-light);">#${order.id}</strong></td>
            <td>
                <div style="font-weight:700; color:#fff;">${order.customer.name}</div>
                <div style="font-size:0.78rem; color:var(--text-muted);">${order.customer.phone}</div>
                <div style="font-size:0.75rem; color:var(--text-dim); max-width:200px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
                    ${order.customer.address || 'Pickup at Restaurant'}
                </div>
            </td>
            <td>
                <div style="font-size:0.85rem; color:#fff;">${order.items.map(i => `${i.name} (${i.quantity})`).join(', ')}</div>
                <div style="font-size:0.75rem; color:var(--primary-light);">${order.deliveryType} • ${order.paymentMethod}</div>
            </td>
            <td>
                <div style="font-weight:800; color:#fff;">${formatPrice(order.total)}</div>
                ${order.discount > 0 ? `<div style="font-size:0.75rem; color:var(--success);">Disc: -${formatPrice(order.discount)}</div>` : ''}
            </td>
            <td>
                <select class="adm-select" style="padding:4px 8px; font-size:0.78rem;" onchange="changeOrderStatus('${order.id}', this.value)">
                    <option value="Pending" ${order.status === 'Pending' ? 'selected' : ''}>Pending</option>
                    <option value="Preparing" ${order.status === 'Preparing' ? 'selected' : ''}>Preparing</option>
                    <option value="Out for Delivery" ${order.status === 'Out for Delivery' ? 'selected' : ''}>Out for Delivery</option>
                    <option value="Delivered" ${order.status === 'Delivered' ? 'selected' : ''}>Delivered</option>
                    <option value="Cancelled" ${order.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
                </select>
            </td>
            <td style="font-size:0.78rem; color:var(--text-muted);">${formatDate(order.createdAt)}</td>
            <td>
                <div class="table-actions">
                    <button class="btn-tbl-action action-view" onclick="viewOrderDetails('${order.id}')" title="View Full Order & Print Receipt">👁️</button>
                    <button class="btn-tbl-action action-delete" onclick="deleteOrder('${order.id}')" title="Delete Order">🗑️</button>
                </div>
            </td>
        </tr>
    `).join('');
}

function changeOrderStatus(orderId, newStatus) {
    DB.updateOrderStatus(orderId, newStatus);
    showAdminToast(`Order #${orderId} status updated to "${newStatus}"`, 'info');
    renderOrdersTable();
    renderDashboardOverview();
    updateSidebarBadges();
}

function deleteOrder(orderId) {
    if (!confirm(`Are you sure you want to delete Order #${orderId}?`)) return;
    let orders = DB.getOrders();
    orders = orders.filter(o => o.id !== orderId);
    DB.saveOrders(orders);
    showAdminToast(`Order #${orderId} deleted successfully.`, 'info');
    renderOrdersTable();
    renderDashboardOverview();
    updateSidebarBadges();
}

function viewOrderDetails(orderId) {
    const orders = DB.getOrders();
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    const modal = document.getElementById('orderDetailModal');
    const content = document.getElementById('orderDetailContent');
    if (!modal || !content) return;

    content.innerHTML = `
        <div style="background:var(--adm-sidebar); padding:20px; border-radius:12px; margin-bottom:20px; border:1px solid var(--adm-border);">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; border-bottom:1px solid var(--adm-border); padding-bottom:10px;">
                <div>
                    <h3 style="color:#fff; font-size:1.3rem;">Order #${order.id}</h3>
                    <span style="font-size:0.8rem; color:var(--text-muted);">${formatDate(order.createdAt)}</span>
                </div>
                <span class="status-pill status-${order.status.toLowerCase().replace(/\s+/g, '')}">${order.status}</span>
            </div>

            <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px; font-size:0.88rem; margin-bottom:16px;">
                <div>
                    <strong style="color:var(--text-muted);">Customer Information:</strong>
                    <div style="color:#fff; font-weight:700;">${order.customer.name}</div>
                    <div style="color:var(--text-muted);">${order.customer.phone}</div>
                </div>
                <div>
                    <strong style="color:var(--text-muted);">Delivery Details:</strong>
                    <div style="color:#fff;">${order.deliveryType} • ${order.paymentMethod}</div>
                    <div style="color:var(--text-muted); font-size:0.8rem;">${order.customer.address || 'N/A (Self Pickup)'}</div>
                </div>
            </div>

            ${order.customer.notes ? `
                <div style="background:rgba(245, 158, 11, 0.08); padding:10px; border-radius:6px; font-size:0.85rem; color:var(--primary-light); margin-bottom:16px;">
                    <strong>Customer Special Request:</strong> ${order.customer.notes}
                </div>
            ` : ''}

            <div style="margin-top:16px;">
                <strong style="color:var(--text-muted); font-size:0.85rem;">Items Ordered:</strong>
                <div style="margin-top:8px; display:flex; flex-direction:column; gap:8px;">
                    ${order.items.map(item => `
                        <div style="display:flex; justify-content:space-between; font-size:0.88rem; padding:6px 0; border-bottom:1px dashed var(--adm-border);">
                            <span>${item.name} × <strong>${item.quantity}</strong></span>
                            <span style="color:#fff; font-weight:700;">${formatPrice(item.price * item.quantity)}</span>
                        </div>
                    `).join('')}
                </div>
            </div>

            <div style="margin-top:16px; padding-top:12px; border-top:1px solid var(--adm-border); display:flex; flex-direction:column; gap:6px; font-size:0.88rem;">
                <div style="display:flex; justify-content:space-between; color:var(--text-muted);">
                    <span>Subtotal:</span>
                    <span>${formatPrice(order.subtotal)}</span>
                </div>
                ${order.discount > 0 ? `
                    <div style="display:flex; justify-content:space-between; color:var(--success);">
                        <span>Coupon Discount:</span>
                        <span>-${formatPrice(order.discount)}</span>
                    </div>
                ` : ''}
                <div style="display:flex; justify-content:space-between; color:var(--text-muted);">
                    <span>Delivery Fee:</span>
                    <span>${order.deliveryFee === 0 ? 'FREE' : formatPrice(order.deliveryFee)}</span>
                </div>
                <div style="display:flex; justify-content:space-between; font-weight:800; font-size:1.15rem; color:var(--primary-light); margin-top:8px; border-top:1px solid var(--adm-border); padding-top:8px;">
                    <span>Grand Total:</span>
                    <span>${formatPrice(order.total)}</span>
                </div>
            </div>
        </div>

        <div style="display:flex; gap:12px; justify-content:flex-end;">
            <button class="btn-adm-primary" onclick="window.print()">🖨️ Print Kitchen Order Ticket (KOT)</button>
            <button class="btn-adm-danger" onclick="closeAdminModal('orderDetailModal')">Close</button>
        </div>
    `;

    modal.classList.add('active');
}

// ==========================================
// 3. MENU MANAGEMENT (CRUD)
// ==========================================
function renderMenuTable() {
    const tbody = document.getElementById('menuTableTbody');
    if (!tbody) return;

    let menu = DB.getMenu();

    if (AdminState.menuCategoryFilter !== 'all') {
        menu = menu.filter(item => item.category === AdminState.menuCategoryFilter);
    }

    if (AdminState.menuSearchQuery) {
        const q = AdminState.menuSearchQuery.toLowerCase();
        menu = menu.filter(item => 
            item.name.toLowerCase().includes(q) ||
            item.description.toLowerCase().includes(q) ||
            item.categoryName.toLowerCase().includes(q)
        );
    }

    if (menu.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:40px; color:var(--text-muted);">No dishes found in menu.</td></tr>`;
        return;
    }

    tbody.innerHTML = menu.map(item => `
        <tr>
            <td>
                <img src="${item.image}" alt="${item.name}" style="width:50px; height:50px; border-radius:8px; object-fit:cover; border:1px solid var(--adm-border);">
            </td>
            <td>
                <div style="font-weight:700; color:#fff;">${item.name}</div>
                <div style="font-size:0.75rem; color:var(--text-muted); max-width:240px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${item.description}</div>
            </td>
            <td><span class="status-pill status-preparing">${item.categoryName || item.category}</span></td>
            <td>
                <div style="font-weight:800; color:var(--primary-light);">${formatPrice(item.price)}</div>
                ${item.oldPrice ? `<div style="font-size:0.75rem; color:var(--text-dim); text-decoration:line-through;">${formatPrice(item.oldPrice)}</div>` : ''}
            </td>
            <td>
                <button class="status-pill ${item.available !== false ? 'status-delivered' : 'status-cancelled'}" onclick="toggleMenuItemStock('${item.id}')" style="cursor:pointer;">
                    ${item.available !== false ? '● In Stock' : '✕ Out of Stock'}
                </button>
            </td>
            <td>
                <div style="display:flex; gap:4px;">
                    ${item.isPopular ? `<span title="Best Seller" style="font-size:0.9rem;">🔥</span>` : ''}
                    ${item.isFeatured ? `<span title="Featured" style="font-size:0.9rem;">⭐</span>` : ''}
                </div>
            </td>
            <td>
                <div class="table-actions">
                    <button class="btn-tbl-action action-edit" onclick="openEditMenuItemModal('${item.id}')" title="Edit Dish">✏️</button>
                    <button class="btn-tbl-action action-delete" onclick="deleteMenuItem('${item.id}')" title="Delete Dish">🗑️</button>
                </div>
            </td>
        </tr>
    `).join('');
}

function toggleMenuItemStock(itemId) {
    const item = DB.getMenuItem(itemId);
    if (!item) return;

    const newStock = item.available === false ? true : false;
    DB.updateMenuItem(itemId, { available: newStock });
    showAdminToast(`Dish "${item.name}" marked as ${newStock ? 'In Stock' : 'Out of Stock'}.`, 'info');
    renderMenuTable();
}

function openAddMenuItemModal() {
    AdminState.editingMenuItemId = null;
    const modal = document.getElementById('menuItemFormModal');
    const title = document.getElementById('menuModalTitle');
    const form = document.getElementById('menuItemForm');

    if (title) title.textContent = 'Add New Royal Dish';
    if (form) form.reset();

    modal?.classList.add('active');
}

function openEditMenuItemModal(itemId) {
    const item = DB.getMenuItem(itemId);
    if (!item) return;

    AdminState.editingMenuItemId = itemId;
    const modal = document.getElementById('menuItemFormModal');
    const title = document.getElementById('menuModalTitle');

    if (title) title.textContent = `Edit Dish: ${item.name}`;

    // Populate Fields
    document.getElementById('dishName').value = item.name;
    document.getElementById('dishCategory').value = item.category;
    document.getElementById('dishPrice').value = item.price;
    document.getElementById('dishOldPrice').value = item.oldPrice || '';
    document.getElementById('dishDesc').value = item.description;
    document.getElementById('dishImage').value = item.image;
    document.getElementById('dishSpice').value = item.spiceLevel || 'medium';
    document.getElementById('dishIsVeg').checked = !!item.isVeg;
    document.getElementById('dishIsPopular').checked = !!item.isPopular;
    document.getElementById('dishIsFeatured').checked = !!item.isFeatured;

    modal?.classList.add('active');
}

function saveMenuItemForm() {
    const name = document.getElementById('dishName')?.value.trim();
    const category = document.getElementById('dishCategory')?.value;
    const categoryName = document.getElementById('dishCategory')?.selectedOptions[0]?.text;
    const price = Number(document.getElementById('dishPrice')?.value);
    const oldPrice = Number(document.getElementById('dishOldPrice')?.value) || 0;
    const description = document.getElementById('dishDesc')?.value.trim();
    let image = document.getElementById('dishImage')?.value.trim();
    const spiceLevel = document.getElementById('dishSpice')?.value;
    const isVeg = document.getElementById('dishIsVeg')?.checked;
    const isPopular = document.getElementById('dishIsPopular')?.checked;
    const isFeatured = document.getElementById('dishIsFeatured')?.checked;

    if (!name || !price || !description) {
        showAdminToast('Please fill in dish name, price and description.', 'error');
        return;
    }

    if (!image) {
        image = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80';
    }

    const payload = {
        name,
        category,
        categoryName,
        price,
        oldPrice: oldPrice > 0 ? oldPrice : null,
        description,
        image,
        spiceLevel,
        isVeg,
        isPopular,
        isFeatured
    };

    if (AdminState.editingMenuItemId) {
        DB.updateMenuItem(AdminState.editingMenuItemId, payload);
        showAdminToast(`Dish "${name}" updated successfully!`, 'success');
    } else {
        DB.addMenuItem(payload);
        showAdminToast(`New Dish "${name}" added to menu! 🍲`, 'success');
    }

    closeAdminModal('menuItemFormModal');
    renderMenuTable();
    renderDashboardOverview();
}

function deleteMenuItem(itemId) {
    const item = DB.getMenuItem(itemId);
    if (!item) return;

    if (!confirm(`Are you sure you want to permanently delete "${item.name}" from the menu?`)) return;

    DB.deleteMenuItem(itemId);
    showAdminToast(`Dish "${item.name}" deleted from menu.`, 'info');
    renderMenuTable();
    renderDashboardOverview();
}

// Preset Quick Images for Menu Form
function setPresetImage(url) {
    const imgInput = document.getElementById('dishImage');
    if (imgInput) imgInput.value = url;
}

// ==========================================
// 4. RESERVATIONS MANAGEMENT
// ==========================================
function renderReservationsTable() {
    const tbody = document.getElementById('reservationsTableTbody');
    if (!tbody) return;

    let list = DB.getReservations();

    if (AdminState.resStatusFilter !== 'all') {
        list = list.filter(r => r.status.toLowerCase() === AdminState.resStatusFilter.toLowerCase());
    }

    if (AdminState.resSearchQuery) {
        const q = AdminState.resSearchQuery.toLowerCase();
        list = list.filter(r => 
            r.id.toLowerCase().includes(q) ||
            r.customerName.toLowerCase().includes(q) ||
            r.phone.toLowerCase().includes(q)
        );
    }

    if (list.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:40px; color:var(--text-muted);">No reservations found.</td></tr>`;
        return;
    }

    tbody.innerHTML = list.map(res => `
        <tr>
            <td><strong style="color:var(--primary-light);">#${res.id}</strong></td>
            <td>
                <div style="font-weight:700; color:#fff;">${res.customerName}</div>
                <div style="font-size:0.78rem; color:var(--text-muted);">${res.phone}</div>
            </td>
            <td>
                <div style="color:#fff; font-weight:600;">${res.guests} Persons</div>
                <div style="font-size:0.75rem; color:var(--text-muted);">${res.tableType}</div>
            </td>
            <td>
                <div style="color:var(--primary-light); font-weight:700;">${res.date}</div>
                <div style="font-size:0.75rem; color:var(--text-muted);">at ${res.time}</div>
            </td>
            <td style="font-size:0.78rem; color:var(--text-muted); max-width:180px;">
                ${res.specialRequests || 'None'}
            </td>
            <td>
                <select class="adm-select" style="padding:4px 8px; font-size:0.78rem;" onchange="changeReservationStatus('${res.id}', this.value)">
                    <option value="Pending" ${res.status === 'Pending' ? 'selected' : ''}>Pending</option>
                    <option value="Confirmed" ${res.status === 'Confirmed' ? 'selected' : ''}>Confirmed</option>
                    <option value="Completed" ${res.status === 'Completed' ? 'selected' : ''}>Completed</option>
                    <option value="Cancelled" ${res.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
                </select>
            </td>
            <td>
                <button class="btn-tbl-action action-delete" onclick="deleteReservation('${res.id}')" title="Delete Booking">🗑️</button>
            </td>
        </tr>
    `).join('');
}

function changeReservationStatus(resId, newStatus) {
    DB.updateReservationStatus(resId, newStatus);
    showAdminToast(`Reservation #${resId} status changed to "${newStatus}"`, 'info');
    renderReservationsTable();
    updateSidebarBadges();
}

function deleteReservation(resId) {
    if (!confirm(`Delete reservation #${resId}?`)) return;
    let list = DB.getReservations();
    list = list.filter(r => r.id !== resId);
    DB.saveReservations(list);
    showAdminToast(`Reservation #${resId} deleted.`, 'info');
    renderReservationsTable();
    updateSidebarBadges();
}

// ==========================================
// 5. RESTAURANT SETTINGS & BACKUP
// ==========================================
function loadSettingsForm() {
    const settings = DB.getSettings();
    document.getElementById('setRestName').value = settings.restaurantName || '';
    document.getElementById('setPhone').value = settings.phone || '';
    document.getElementById('setAddress').value = settings.address || '';
    document.getElementById('setHours').value = settings.openingHours || '';
    document.getElementById('setDeliveryFee').value = settings.deliveryFee || 150;
    document.getElementById('setFreeThreshold').value = settings.freeDeliveryThreshold || 2500;
    document.getElementById('setAdminPin').value = settings.adminPin || 'admin123';
}

function saveSettingsForm() {
    const current = DB.getSettings();
    const updated = {
        ...current,
        restaurantName: document.getElementById('setRestName').value.trim(),
        phone: document.getElementById('setPhone').value.trim(),
        address: document.getElementById('setAddress').value.trim(),
        openingHours: document.getElementById('setHours').value.trim(),
        deliveryFee: Number(document.getElementById('setDeliveryFee').value) || 0,
        freeDeliveryThreshold: Number(document.getElementById('setFreeThreshold').value) || 0,
        adminPin: document.getElementById('setAdminPin').value.trim() || 'admin123'
    };

    DB.saveSettings(updated);
    showAdminToast('Restaurant Settings updated successfully!', 'success');
}

function exportDataBackup() {
    const backupData = {
        menu: DB.getMenu(),
        orders: DB.getOrders(),
        reservations: DB.getReservations(),
        settings: DB.getSettings(),
        exportedAt: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `khanjee_restaurant_backup_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showAdminToast('Backup JSON downloaded successfully!', 'success');
}

function resetAllDataToDefault() {
    if (confirm('CAUTION: This will reset all menu items, orders, and reservations back to default demo state. Continue?')) {
        DB.resetToDefaults();
    }
}

// Modal Helpers
function closeAdminModal(modalId) {
    document.getElementById(modalId)?.classList.remove('active');
}

// Toast System
function showAdminToast(message, type = 'success') {
    let container = document.getElementById('adminToastContainer');
    if (!container) {
        container = document.createElement('div');
        container.id = 'adminToastContainer';
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

// Event Listeners for Filters
function setupEventListeners() {
    // Orders filter
    const ordSearch = document.getElementById('adminOrderSearch');
    const ordStatus = document.getElementById('adminOrderStatusSelect');
    if (ordSearch) ordSearch.addEventListener('input', (e) => {
        AdminState.orderSearchQuery = e.target.value.trim();
        renderOrdersTable();
    });
    if (ordStatus) ordStatus.addEventListener('change', (e) => {
        AdminState.orderStatusFilter = e.target.value;
        renderOrdersTable();
    });

    // Menu filter
    const menuSearch = document.getElementById('adminMenuSearch');
    const menuCat = document.getElementById('adminMenuCategorySelect');
    if (menuSearch) menuSearch.addEventListener('input', (e) => {
        AdminState.menuSearchQuery = e.target.value.trim();
        renderMenuTable();
    });
    if (menuCat) menuCat.addEventListener('change', (e) => {
        AdminState.menuCategoryFilter = e.target.value;
        renderMenuTable();
    });

    // Reservations filter
    const resSearch = document.getElementById('adminResSearch');
    const resStatus = document.getElementById('adminResStatusSelect');
    if (resSearch) resSearch.addEventListener('input', (e) => {
        AdminState.resSearchQuery = e.target.value.trim();
        renderReservationsTable();
    });
    if (resStatus) resStatus.addEventListener('change', (e) => {
        AdminState.resStatusFilter = e.target.value;
        renderReservationsTable();
    });

    // Cross-tab events
    window.addEventListener('kj_orders_updated', () => {
        renderOrdersTable();
        renderDashboardOverview();
        updateSidebarBadges();
    });

    window.addEventListener('kj_reservations_updated', () => {
        renderReservationsTable();
        renderDashboardOverview();
        updateSidebarBadges();
    });
}

/**
 * Khan Jee Restaurant - Data & LocalStorage Management
 * Shared between Storefront and Admin Panel
 */

const STORAGE_KEYS = {
    MENU: 'khanjee_menu_items',
    ORDERS: 'khanjee_orders',
    RESERVATIONS: 'khanjee_reservations',
    CART: 'khanjee_cart',
    SETTINGS: 'khanjee_settings'
};

// Initial Seed Menu Items
const INITIAL_MENU = [
    {
        id: 'kj-1',
        name: 'Special Mutton Dum Biryani',
        category: 'biryani',
        categoryName: 'Royal Biryani & Rice',
        price: 950,
        oldPrice: 1100,
        description: 'Slow-cooked succulent mutton with aged Basmati rice, saffron, and secret Khan Jee royal spices, served with fresh raita and salad.',
        image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80',
        rating: 4.9,
        reviewsCount: 142,
        spiceLevel: 'medium', // mild, medium, spicy
        isVeg: false,
        isPopular: true,
        isFeatured: true,
        available: true
    },
    {
        id: 'kj-2',
        name: 'Khan Jee Special Chicken Karahi',
        category: 'karahi',
        categoryName: 'Karahi & Handi',
        price: 1350,
        oldPrice: 1500,
        description: 'Tender chicken pieces simmered in iron wok with fresh tomatoes, ginger juliennes, green chillies, and freshly cracked black pepper.',
        image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=800&q=80',
        rating: 4.8,
        reviewsCount: 98,
        spiceLevel: 'spicy',
        isVeg: false,
        isPopular: true,
        isFeatured: true,
        available: true
    },
    {
        id: 'kj-3',
        name: 'Mutton Shinwari Karahi (1 KG)',
        category: 'karahi',
        categoryName: 'Karahi & Handi',
        price: 2450,
        oldPrice: 2700,
        description: 'Traditional Khyber Shinwari style fresh mutton prepared strictly in organic animal fat, salt, tomatoes, and green chillies without artificial masala.',
        image: 'https://images.unsplash.com/photo-1545247181-516773cae754?auto=format&fit=crop&w=800&q=80',
        rating: 5.0,
        reviewsCount: 86,
        spiceLevel: 'mild',
        isVeg: false,
        isPopular: true,
        isFeatured: true,
        available: true
    },
    {
        id: 'kj-4',
        name: 'Chicken Malai Boti Platter',
        category: 'bbq',
        categoryName: 'BBQ & Grills',
        price: 820,
        oldPrice: 950,
        description: 'Boneless tender chicken cubes marinated overnight in rich dairy cream, yogurt, white pepper, and mild herbs, char-grilled to perfection.',
        image: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=800&q=80',
        rating: 4.9,
        reviewsCount: 112,
        spiceLevel: 'mild',
        isVeg: false,
        isPopular: true,
        isFeatured: true,
        available: true
    },
    {
        id: 'kj-5',
        name: 'Beef Seekh Kebab (4 Pcs)',
        category: 'bbq',
        categoryName: 'BBQ & Grills',
        price: 780,
        oldPrice: 890,
        description: 'Finely minced premium beef blended with roasted coriander, cumin, onions, and charcoal grilled on iron skewers.',
        image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80',
        rating: 4.7,
        reviewsCount: 76,
        spiceLevel: 'spicy',
        isVeg: false,
        isPopular: true,
        isFeatured: false,
        available: true
    },
    {
        id: 'kj-6',
        name: 'Peshawari Chapli Kebab',
        category: 'bbq',
        categoryName: 'BBQ & Grills',
        price: 690,
        oldPrice: 800,
        description: 'Pan-fried minced beef patties infused with crushed pomegranate seeds, fresh mint, coriander, and tomato slices.',
        image: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?auto=format&fit=crop&w=800&q=80',
        rating: 4.8,
        reviewsCount: 94,
        spiceLevel: 'spicy',
        isVeg: false,
        isPopular: false,
        isFeatured: true,
        available: true
    },
    {
        id: 'kj-7',
        name: 'Royal Shahi Nihari',
        category: 'desi',
        categoryName: 'Desi Delicacies',
        price: 1100,
        oldPrice: 1250,
        description: 'Slow-simmered beef shank stew cooked overnight in authentic Kashmiri masala, topped with ginger strips, fried onion, and lemon.',
        image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=800&q=80',
        rating: 4.9,
        reviewsCount: 120,
        spiceLevel: 'medium',
        isVeg: false,
        isPopular: true,
        isFeatured: true,
        available: true
    },
    {
        id: 'kj-8',
        name: 'Chicken Makhni Handi (Boneless)',
        category: 'karahi',
        categoryName: 'Karahi & Handi',
        price: 1280,
        oldPrice: 1400,
        description: 'Tender boneless chicken morsels cooked in an aromatic clay pot with buttery cashew-tomato gravy and dried fenugreek leaves.',
        image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80',
        rating: 4.8,
        reviewsCount: 65,
        spiceLevel: 'mild',
        isVeg: false,
        isPopular: false,
        isFeatured: false,
        available: true
    },
    {
        id: 'kj-9',
        name: 'Khan Jee Special Zinger Burger',
        category: 'fastfood',
        categoryName: 'Fast Food',
        price: 490,
        oldPrice: 580,
        description: 'Extra crispy chicken fillet coated in secret herbs, layered with cheddar cheese, iceberg lettuce, and tangy garlic mayo on toasted sesame bun.',
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
        rating: 4.6,
        reviewsCount: 88,
        spiceLevel: 'medium',
        isVeg: false,
        isPopular: true,
        isFeatured: false,
        available: true
    },
    {
        id: 'kj-10',
        name: 'Garlic Roghani Naan',
        category: 'breads',
        categoryName: 'Tandoor & Breads',
        price: 110,
        oldPrice: 130,
        description: 'Soft tandoori flatbread brushed with golden desi ghee, topped with roasted garlic flakes and sesame seeds.',
        image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80',
        rating: 4.7,
        reviewsCount: 160,
        spiceLevel: 'mild',
        isVeg: true,
        isPopular: true,
        isFeatured: false,
        available: true
    },
    {
        id: 'kj-11',
        name: 'Royal Shahi Tukray & Gulab Jamun',
        category: 'desserts',
        categoryName: 'Desserts & Drinks',
        price: 380,
        oldPrice: 450,
        description: 'Mughlai saffron bread soaked in condensed cardamom milk alongside 2 warm soft gulab jamuns sprinkled with pistachios.',
        image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80',
        rating: 4.9,
        reviewsCount: 75,
        spiceLevel: 'mild',
        isVeg: true,
        isPopular: true,
        isFeatured: true,
        available: true
    },
    {
        id: 'kj-12',
        name: 'Chilled Mango Lassi / Kashmiri Chai',
        category: 'desserts',
        categoryName: 'Desserts & Drinks',
        price: 240,
        oldPrice: 290,
        description: 'Refreshing thick yogurt shake with Sindhri mango pulp or signature hot pink Kashmiri pink tea with crushed almonds.',
        image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80',
        rating: 4.8,
        reviewsCount: 92,
        spiceLevel: 'mild',
        isVeg: true,
        isPopular: false,
        isFeatured: false,
        available: true
    }
];

// Initial Seed Orders for demo
const INITIAL_ORDERS = [
    {
        id: 'KJ-8921',
        customer: {
            name: 'Ali Raza Khan',
            phone: '0300-1234567',
            address: 'House 42, Model Colony, Jacobabad',
            notes: 'Please send extra mint raita and make karahi spicy.'
        },
        items: [
            { id: 'kj-1', name: 'Special Mutton Dum Biryani', price: 950, quantity: 2 },
            { id: 'kj-10', name: 'Garlic Roghani Naan', price: 110, quantity: 3 }
        ],
        subtotal: 2230,
        discount: 223,
        deliveryFee: 150,
        total: 2157,
        paymentMethod: 'Cash on Delivery',
        deliveryType: 'Delivery',
        status: 'Preparing', // Pending, Preparing, Out for Delivery, Delivered, Cancelled
        createdAt: new Date(Date.now() - 35 * 60 * 1000).toISOString()
    },
    {
        id: 'KJ-8920',
        customer: {
            name: 'Muhammad Tariq',
            phone: '0333-7654321',
            address: 'Shop 14, Main Shahi Bazaar, Jacobabad',
            notes: 'Deliver before 9:30 PM please.'
        },
        items: [
            { id: 'kj-2', name: 'Khan Jee Special Chicken Karahi', price: 1350, quantity: 1 },
            { id: 'kj-4', name: 'Chicken Malai Boti Platter', price: 820, quantity: 1 },
            { id: 'kj-11', name: 'Royal Shahi Tukray & Gulab Jamun', price: 380, quantity: 2 }
        ],
        subtotal: 2930,
        discount: 0,
        deliveryFee: 150,
        total: 3080,
        paymentMethod: 'JazzCash / EasyPaisa',
        deliveryType: 'Delivery',
        status: 'Out for Delivery',
        createdAt: new Date(Date.now() - 75 * 60 * 1000).toISOString()
    },
    {
        id: 'KJ-8919',
        customer: {
            name: 'Dr. Farhan Somroo',
            phone: '0312-9876543',
            address: 'Civil Hospital Road, Jacobabad',
            notes: 'Self pickup at 10 PM.'
        },
        items: [
            { id: 'kj-3', name: 'Mutton Shinwari Karahi (1 KG)', price: 2450, quantity: 1 },
            { id: 'kj-10', name: 'Garlic Roghani Naan', price: 110, quantity: 4 }
        ],
        subtotal: 2890,
        discount: 289,
        deliveryFee: 0,
        total: 2601,
        paymentMethod: 'Cash on Delivery',
        deliveryType: 'Pickup',
        status: 'Delivered',
        createdAt: new Date(Date.now() - 190 * 60 * 1000).toISOString()
    }
];

// Initial Seed Table Reservations
const INITIAL_RESERVATIONS = [
    {
        id: 'RES-101',
        customerName: 'Sardar Hamza Baloch',
        phone: '0301-4455667',
        guests: 6,
        date: '2026-10-12',
        time: '20:30',
        tableType: 'VIP Family Hall',
        specialRequests: 'Celebration dinner, please prepare corner family lounge.',
        status: 'Confirmed', // Pending, Confirmed, Completed, Cancelled
        createdAt: new Date(Date.now() - 120 * 60 * 1000).toISOString()
    },
    {
        id: 'RES-102',
        customerName: 'Engr. Zulfiqar Lashari',
        phone: '0345-3344556',
        guests: 4,
        date: '2026-10-12',
        time: '21:00',
        tableType: 'Open Terrace / Rooftop',
        specialRequests: 'Need high chairs for kids.',
        status: 'Pending',
        createdAt: new Date(Date.now() - 40 * 60 * 1000).toISOString()
    }
];

// Initial Restaurant Settings
const INITIAL_SETTINGS = {
    restaurantName: 'Khan Jee Restaurant',
    tagline: 'The Royal Taste of Tradition & Spices',
    phone: '+92 300 1234567',
    whatsapp: '+92 300 1234567',
    email: 'info@khanjeerestaurant.com',
    address: 'VIP Road, Near Shahi Bazaar & DC Complex, Jacobabad, Sindh',
    openingHours: 'Mon - Sun: 12:00 PM – 02:00 AM',
    currency: 'PKR Rs.',
    deliveryFee: 150,
    freeDeliveryThreshold: 2500,
    taxPercent: 0,
    adminPin: 'admin123'
};

// Available Coupons
const COUPONS = {
    'KHAN20': { discountPercent: 20, description: '20% Royal Discount on entire bill' },
    'WELCOME10': { discountPercent: 10, description: '10% New Customer Discount' },
    'FREESHIP': { freeDelivery: true, description: 'Free Express Delivery across Jacobabad' }
};

// Storage API Helpers
const DB = {
    // Menu
    getMenu() {
        const data = localStorage.getItem(STORAGE_KEYS.MENU);
        if (!data) {
            localStorage.setItem(STORAGE_KEYS.MENU, JSON.stringify(INITIAL_MENU));
            return [...INITIAL_MENU];
        }
        try {
            return JSON.parse(data);
        } catch (e) {
            return [...INITIAL_MENU];
        }
    },
    saveMenu(items) {
        localStorage.setItem(STORAGE_KEYS.MENU, JSON.stringify(items));
        window.dispatchEvent(new CustomEvent('kj_menu_updated', { detail: items }));
    },
    getMenuItem(id) {
        return this.getMenu().find(item => item.id === id);
    },
    addMenuItem(item) {
        const menu = this.getMenu();
        const newItem = {
            id: 'kj-' + Date.now(),
            rating: 5.0,
            reviewsCount: 1,
            available: true,
            isPopular: false,
            isFeatured: false,
            ...item
        };
        menu.unshift(newItem);
        this.saveMenu(menu);
        return newItem;
    },
    updateMenuItem(id, updatedFields) {
        let menu = this.getMenu();
        menu = menu.map(item => item.id === id ? { ...item, ...updatedFields } : item);
        this.saveMenu(menu);
    },
    deleteMenuItem(id) {
        let menu = this.getMenu();
        menu = menu.filter(item => item.id !== id);
        this.saveMenu(menu);
    },

    // Orders
    getOrders() {
        const data = localStorage.getItem(STORAGE_KEYS.ORDERS);
        if (!data) {
            localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(INITIAL_ORDERS));
            return [...INITIAL_ORDERS];
        }
        try {
            return JSON.parse(data);
        } catch (e) {
            return [...INITIAL_ORDERS];
        }
    },
    saveOrders(orders) {
        localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
        window.dispatchEvent(new CustomEvent('kj_orders_updated', { detail: orders }));
    },
    createOrder(orderData) {
        const orders = this.getOrders();
        const newOrder = {
            id: 'KJ-' + Math.floor(1000 + Math.random() * 9000),
            status: 'Pending',
            createdAt: new Date().toISOString(),
            ...orderData
        };
        orders.unshift(newOrder);
        this.saveOrders(orders);
        return newOrder;
    },
    updateOrderStatus(orderId, newStatus) {
        let orders = this.getOrders();
        orders = orders.map(ord => ord.id === orderId ? { ...ord, status: newStatus } : ord);
        this.saveOrders(orders);
    },

    // Reservations
    getReservations() {
        const data = localStorage.getItem(STORAGE_KEYS.RESERVATIONS);
        if (!data) {
            localStorage.setItem(STORAGE_KEYS.RESERVATIONS, JSON.stringify(INITIAL_RESERVATIONS));
            return [...INITIAL_RESERVATIONS];
        }
        try {
            return JSON.parse(data);
        } catch (e) {
            return [...INITIAL_RESERVATIONS];
        }
    },
    saveReservations(reservations) {
        localStorage.setItem(STORAGE_KEYS.RESERVATIONS, JSON.stringify(reservations));
        window.dispatchEvent(new CustomEvent('kj_reservations_updated', { detail: reservations }));
    },
    createReservation(resData) {
        const reservations = this.getReservations();
        const newRes = {
            id: 'RES-' + Math.floor(100 + Math.random() * 900),
            status: 'Pending',
            createdAt: new Date().toISOString(),
            ...resData
        };
        reservations.unshift(newRes);
        this.saveReservations(reservations);
        return newRes;
    },
    updateReservationStatus(resId, newStatus) {
        let list = this.getReservations();
        list = list.map(item => item.id === resId ? { ...item, status: newStatus } : item);
        this.saveReservations(list);
    },

    // Cart
    getCart() {
        const data = localStorage.getItem(STORAGE_KEYS.CART);
        if (!data) return [];
        try {
            return JSON.parse(data);
        } catch (e) {
            return [];
        }
    },
    saveCart(cart) {
        localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
        window.dispatchEvent(new CustomEvent('kj_cart_updated', { detail: cart }));
    },
    clearCart() {
        localStorage.removeItem(STORAGE_KEYS.CART);
        window.dispatchEvent(new CustomEvent('kj_cart_updated', { detail: [] }));
    },

    // Settings
    getSettings() {
        const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
        if (!data) {
            localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(INITIAL_SETTINGS));
            return { ...INITIAL_SETTINGS };
        }
        try {
            return JSON.parse(data);
        } catch (e) {
            return { ...INITIAL_SETTINGS };
        }
    },
    saveSettings(settings) {
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    },

    // Reset All to Default
    resetToDefaults() {
        localStorage.setItem(STORAGE_KEYS.MENU, JSON.stringify(INITIAL_MENU));
        localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(INITIAL_ORDERS));
        localStorage.setItem(STORAGE_KEYS.RESERVATIONS, JSON.stringify(INITIAL_RESERVATIONS));
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(INITIAL_SETTINGS));
        localStorage.removeItem(STORAGE_KEYS.CART);
        window.location.reload();
    }
};

// Currency Formatter
function formatPrice(amount) {
    return 'Rs. ' + Number(amount).toLocaleString('en-PK');
}

// Date Formatter
function formatDate(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-PK', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

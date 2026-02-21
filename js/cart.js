/* ========== CART PAGE SCRIPT ========== */

// ---- Load cart from localStorage ----
let cart = [];

function loadCart() {
    const stored = localStorage.getItem('saimedical_cart');
    cart = stored ? JSON.parse(stored) : [];
}

function saveCart() {
    localStorage.setItem('saimedical_cart', JSON.stringify(cart));
}

// ---- Render ----
function renderCart() {
    const cartItemsList = document.getElementById('cartItemsList');
    const cartEmpty     = document.getElementById('cartEmpty');
    const cartContent   = document.getElementById('cartContent');
    const cartCount     = document.getElementById('cartCount');

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;

    if (cart.length === 0) {
        cartContent.style.display = 'none';
        cartEmpty.style.display   = 'block';
        return;
    }

    cartContent.style.display = '';
    cartEmpty.style.display   = 'none';

    cartItemsList.innerHTML = cart.map((item, index) => `
        <div class="cart-item" data-index="${index}">
            <div class="cart-item__emoji">${item.emoji}</div>
            <div class="cart-item__details">
                <div class="cart-item__name">${item.name}</div>
                <div class="cart-item__desc">${item.desc}</div>
                <div class="cart-item__price">₹${(item.price * item.quantity).toLocaleString('en-IN')}</div>
            </div>
            <div class="cart-item__controls">
                <button class="qty-btn" data-action="decrease" data-index="${index}" aria-label="Decrease quantity">−</button>
                <span class="qty-value">${item.quantity}</span>
                <button class="qty-btn" data-action="increase" data-index="${index}" aria-label="Increase quantity">+</button>
            </div>
            <button class="cart-item__remove" data-action="remove" data-index="${index}" aria-label="Remove item">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path>
                    <path d="M10 11v6"></path><path d="M14 11v6"></path>
                    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"></path>
                </svg>
            </button>
        </div>
    `).join('');

    updateSummary();
    attachItemListeners();
}

// ---- Update Order Summary ----
function updateSummary() {
    const subtotal   = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    document.getElementById('totalItems').textContent   = totalItems;
    document.getElementById('subtotalAmount').textContent = subtotal.toLocaleString('en-IN');
    document.getElementById('totalAmount').textContent  = subtotal.toLocaleString('en-IN');
    document.getElementById('deliveryText').textContent = subtotal >= 299 ? 'Free' : '₹49';

    // Recalculate total with delivery
    const delivery = subtotal >= 299 ? 0 : 49;
    document.getElementById('totalAmount').textContent = (subtotal + delivery).toLocaleString('en-IN');
}

// ---- Item Action Listeners ----
function attachItemListeners() {
    document.querySelectorAll('.qty-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const index  = parseInt(btn.getAttribute('data-index'));
            const action = btn.getAttribute('data-action');
            if (action === 'increase') {
                cart[index].quantity += 1;
            } else if (action === 'decrease') {
                cart[index].quantity -= 1;
                if (cart[index].quantity <= 0) {
                    cart.splice(index, 1);
                }
            }
            saveCart();
            renderCart();
        });
    });

    document.querySelectorAll('[data-action="remove"]').forEach(btn => {
        btn.addEventListener('click', () => {
            const index = parseInt(btn.getAttribute('data-index'));
            cart.splice(index, 1);
            saveCart();
            renderCart();
        });
    });
}

// ---- Checkout ----
document.getElementById('checkoutBtn').addEventListener('click', () => {
    if (cart.length === 0) return;

    const subtotal   = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const delivery   = subtotal >= 299 ? 0 : 49;
    const total      = subtotal + delivery;
    const orderId    = `SMD${Date.now()}`;

    document.getElementById('orderDetails').innerHTML = `
        <strong>Order ID:</strong> ${orderId}<br>
        <strong>Items:</strong> ${cart.reduce((s, i) => s + i.quantity, 0)}<br>
        <strong>Total Paid:</strong> ₹${total.toLocaleString('en-IN')}
    `;

    // Clear cart
    cart = [];
    saveCart();

    // Show modal
    document.getElementById('orderModal').classList.add('active');
});

document.getElementById('closeOrderModal').addEventListener('click', () => {
    document.getElementById('orderModal').classList.remove('active');
});

// ---- Init ----
loadCart();
renderCart();

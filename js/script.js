/* ========== PRODUCT DATA ========== */
const products = {
    'sexual-wellness': [
        { id: 1, name: 'Premium Condoms', desc: 'latex-free, extra safe', price: 299, emoji: '🛡️' },
        { id: 2, name: 'Personal Lubricant', desc: 'water-based, safe', price: 199, emoji: '💧' },
    ],
    'baby-care': [
        { id: 3, name: 'Baby Diapers', desc: 'super absorbent, gentle', price: 449, emoji: '👼' },
        { id: 4, name: 'Baby Lotion', desc: 'moisturizing, mild', price: 299, emoji: '🧴' },
    ],
    'feminine-hygiene': [
        { id: 5, name: 'Sanitary Pads', desc: 'soft, comfortable, 40 pads', price: 149, emoji: '🌸' },
        { id: 6, name: 'Menstrual Cup', desc: 'reusable, eco-friendly', price: 299, emoji: '♀️' },
    ],
    'monsoon-kit': [
        { id: 7, name: 'Cough Syrup', desc: 'effective, fast relief', price: 89, emoji: '🧴' },
        { id: 8, name: 'Immunity Booster', desc: 'vitamin C, turmeric', price: 349, emoji: '💪' },
    ],
    'supplements': [
        { id: 9, name: 'Multivitamin', desc: 'complete nutrition, 60 tabs', price: 499, emoji: '💊' },
        { id: 10, name: 'Shilajit Capsules', desc: 'pure, organic, 30 caps', price: 599, emoji: '⚫' },
    ],
    'beauty-care': [
        { id: 11, name: 'Knee Support', desc: 'adjustable, relieves pain', price: 399, emoji: '🦵' },
        { id: 12, name: 'Lumbar Belt', desc: 'back support, one size', price: 549, emoji: '🦴' },
    ],
    'otc': [
        { id: 13, name: 'Crocin Tablets', desc: 'fever & pain relief, 10 tabs', price: 29, emoji: '💊' },
        { id: 14, name: 'Disprin Tablets', desc: 'aspirin, 10 tabs', price: 39, emoji: '⚪' },
    ],
    'lab-tests': [
        { id: 15, name: 'Blood Test (CBC)', desc: 'complete blood count analysis', price: 299, emoji: '🧪' },
        { id: 16, name: 'Thyroid Test', desc: 'TSH, T3, T4 levels', price: 499, emoji: '⚗️' },
    ],
};

// Category metadata for display
const categoryMetadata = {
    'sexual-wellness': { title: 'Sexual Wellness', subtitle: 'Premium products for intimate wellness' },
    'baby-care': { title: 'Baby Care', subtitle: 'Gentle & safe for your baby' },
    'feminine-hygiene': { title: 'Feminine Hygiene', subtitle: 'Comfort & reliability every day' },
    'monsoon-kit': { title: 'Monsoon Kit', subtitle: 'Stay healthy during rainy season' },
    'supplements': { title: 'Supplements', subtitle: 'Boost your immunity & wellness' },
    'beauty-care': { title: 'Orthopedic Care', subtitle: 'Support & relief for joints and spine' },
    'otc': { title: 'Over The Counter', subtitle: 'Common medicines & pain relief' },
    'lab-tests': { title: 'Lab Tests', subtitle: 'Book home sample collection' },
};

// ========== DOM ELEMENTS ==========
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const cartBtn = document.getElementById('cartCount');
const bookingForm = document.getElementById('bookingForm');
const successModal = document.getElementById('successModal');
const closeModalBtn = document.getElementById('closeModal');
const modalCloseBtn = document.getElementById('modalCloseBtn');
const searchInput = document.getElementById('searchInput');
const homeBtn = document.getElementById('homeBtn');

// New elements for Blinkit-like interface
const categoryTabs = document.querySelectorAll('.category-tab');
const productsContainer = document.getElementById('productsContainer');
const categoryTitle = document.getElementById('categoryTitle');
const categorySubtitle = document.getElementById('categorySubtitle');
const categoryCards = document.querySelectorAll('.category-card');
const categoryFilter = document.querySelector('.category-filter');
const shopByCategorySection = document.getElementById('shopByCategory');
const productsMain = document.querySelector('.products-main');

// ========== CART STATE ==========
let cart = [];
let currentCategory = 'sexual-wellness';

// ========== INITIALIZATION ==========
// Initialize when script runs (DOM is already loaded since script is at end of HTML)
loadCartFromStorage();
// debouncedSearch must be defined before initializeEventListeners is called
const debouncedSearch = debounce(handleSearch, 300);
initializeEventListeners();

// ========== EVENT LISTENERS ==========
function initializeEventListeners() {
    // Home Button
    if (homeBtn) {
        homeBtn.addEventListener('click', handleHomeClick);
    }

    // Category Cards Click Handler (Main Page)
    categoryCards.forEach(card => {
        card.addEventListener('click', () => handleCategoryCardClick(card));
    });

    // Category Tabs (Blinkit-style, for browsing products)
    categoryTabs.forEach(tab => {
        tab.addEventListener('click', () => handleCategoryChange(tab));
    });

    // Form Submission
    bookingForm.addEventListener('submit', handleFormSubmit);

    // Modal Close
    closeModalBtn.addEventListener('click', closeModal);
    modalCloseBtn.addEventListener('click', closeModal);
    successModal.addEventListener('click', (e) => {
        if (e.target === successModal) closeModal();
    });

    // Search Functionality
    if (searchInput) {
        searchInput.addEventListener('input', debouncedSearch);
        // Wire up the search button click
        const searchBtn = document.querySelector('.search-box__btn');
        if (searchBtn) {
            searchBtn.addEventListener('click', () => handleSearch({ target: searchInput }));
        }
    }
}

// ========== HOME BUTTON HANDLER ==========
function handleHomeClick() {
    // Clear search input
    if (searchInput) searchInput.value = '';

    // Show shop by category section
    shopByCategorySection.style.display = 'block';
    
    // Hide category filter
    categoryFilter.classList.remove('active');
    
    // Hide products section
    productsMain.classList.remove('active');
    
    // Clear products container
    productsContainer.innerHTML = '';
    
    // Scroll back to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ========== CATEGORY CARD HANDLER (Main Page) ==========
function handleCategoryCardClick(card) {
    const categoryId = card.getAttribute('data-category');
    
    // Clear any active search
    if (searchInput) searchInput.value = '';

    // Update current category
    currentCategory = categoryId;
    
    // Update active tab
    categoryTabs.forEach(tab => {
        tab.classList.remove('active');
        if (tab.getAttribute('data-category') === categoryId) {
            tab.classList.add('active');
        }
    });
    
    // Hide shop by category section
    shopByCategorySection.style.display = 'none';
    
    // Show category filter and products
    categoryFilter.classList.add('active');
    productsMain.classList.add('active');
    
    // Render products for selected category
    renderProductsByCategory(categoryId);
    
    // Scroll to products
    productsMain.scrollIntoView({ behavior: 'smooth' });
}

// ========== MOBILE NAVIGATION ==========
function toggleNav() {
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
}

function closeNav() {
    navToggle.classList.remove('active');
    navMenu.classList.remove('active');
}

// ========== CATEGORY TAB HANDLER (Blinkit Style) ==========
function handleCategoryChange(tabElement) {
    const categoryId = tabElement.getAttribute('data-category');

    // Clear any active search
    if (searchInput) searchInput.value = '';

    // Update active tab
    categoryTabs.forEach(tab => tab.classList.remove('active'));
    tabElement.classList.add('active');
    
    // Scroll active tab into view (horizontal scroll)
    tabElement.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    
    // Ensure category filter is visible
    categoryFilter.classList.add('active');

    // Update current category
    currentCategory = categoryId;
    
    // Render products for selected category
    renderProductsByCategory(categoryId);
};

// ========== PRODUCT RENDERING (Dynamic) ==========
function renderProductsByCategory(categoryId) {
    const categoryProducts = products[categoryId] || [];
    const metadata = categoryMetadata[categoryId] || { title: 'Products', subtitle: '' };
    
    // Update category title and subtitle
    categoryTitle.textContent = metadata.title;
    categorySubtitle.textContent = metadata.subtitle;
    
    // Render products
    if (categoryProducts.length === 0) {
        productsContainer.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--color-text-light);">No products available in this category yet.</p>';
        return;
    }
    
    productsContainer.innerHTML = categoryProducts.map(product => createProductCard(product, categoryId)).join('');

    // Add event listeners to cart buttons
    productsContainer.querySelectorAll('.product-card__btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const productId = parseInt(e.currentTarget.getAttribute('data-product-id'));
            addToCart(productId, categoryId);
        });
    });
}

function createProductCard(product, categoryId) {
    return `
        <div class="product-card fade-in-scale">
            <div class="product-card__image">${product.emoji}</div>
            <div class="product-card__content">
                <h3 class="product-card__name">${product.name}</h3>
                <p class="product-card__desc">${product.desc}</p>
                <div class="product-card__price">₹${product.price}</div>
                <button class="btn btn--primary product-card__btn" data-product-id="${product.id}" data-category-id="${categoryId}">
                    Add to Cart
                </button>
            </div>
        </div>
    `;
}

// ========== CART FUNCTIONALITY ==========
function addToCart(productId, categoryId) {
    const product = products[categoryId].find(p => p.id === productId);
    if (product) {
        // Check if product already in cart
        const existingItem = cart.find(item => item.id === productId);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ ...product, quantity: 1 });
        }
        updateCartUI();
        saveCartToStorage();
        showCartNotification();
    }
}

function updateCartUI() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartBtn.textContent = totalItems;
}

function saveCartToStorage() {
    localStorage.setItem('saimedical_cart', JSON.stringify(cart));
}

function loadCartFromStorage() {
    const stored = localStorage.getItem('saimedical_cart');
    if (stored) {
        cart = JSON.parse(stored);
        updateCartUI();
    }
}

function showCartNotification() {
    // Visual feedback (subtle animation on cart button)
    const cartButton = document.querySelector('.cart-btn');
    if (cartButton) {
        cartButton.style.transform = 'scale(1.2)';
        setTimeout(() => {
            cartButton.style.transform = 'scale(1)';
        }, 300);
    }
}

// ========== SEARCH FUNCTIONALITY ==========
function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase().trim();

    if (!searchTerm) {
        // Restore previous category view or go back to home
        if (productsMain.classList.contains('active')) {
            renderProductsByCategory(currentCategory);
        }
        return;
    }

    // Search across ALL categories
    const allMatches = [];
    Object.entries(products).forEach(([categoryId, categoryProducts]) => {
        categoryProducts.forEach(product => {
            if (
                product.name.toLowerCase().includes(searchTerm) ||
                product.desc.toLowerCase().includes(searchTerm)
            ) {
                allMatches.push({ product, categoryId });
            }
        });
    });

    // Ensure the products section is visible (user may be on home page)
    shopByCategorySection.style.display = 'none';
    categoryFilter.classList.remove('active'); // hide category tabs during search
    productsMain.classList.add('active');

    // Update heading
    categoryTitle.textContent = `Search Results for "${e.target.value.trim()}"`;
    categorySubtitle.textContent = `${allMatches.length} product${allMatches.length !== 1 ? 's' : ''} found across all categories`;

    if (allMatches.length === 0) {
        productsContainer.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--color-text-light);">No products found matching your search.</p>';
        return;
    }

    productsContainer.innerHTML = allMatches.map(({ product, categoryId }) => createProductCard(product, categoryId)).join('');

    // Add event listeners to cart buttons
    productsContainer.querySelectorAll('.product-card__btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const productId = parseInt(e.currentTarget.getAttribute('data-product-id'));
            const categoryId = e.currentTarget.getAttribute('data-category-id');
            addToCart(productId, categoryId);
        });
    });
}

// ========== FORM VALIDATION & SUBMISSION ==========
function handleFormSubmit(e) {
    e.preventDefault();

    // Clear previous errors
    clearFormErrors();

    // Get form values
    const name = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const test = document.getElementById('test').value;
    const date = document.getElementById('date').value;

    // Validate form
    let isValid = true;

    if (!name || name.length < 3) {
        showError('nameError', 'Please enter a valid name (at least 3 characters)');
        isValid = false;
    }

    if (!validatePhone(phone)) {
        showError('phoneError', 'Please enter a valid 10-digit phone number');
        isValid = false;
    }

    if (!test) {
        showError('testError', 'Please select a test');
        isValid = false;
    }

    if (!date) {
        showError('dateError', 'Please select a date');
        isValid = false;
    } else {
        const selectedDate = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (selectedDate < today) {
            showError('dateError', 'Please select a future date');
            isValid = false;
        }
    }

    if (isValid) {
        submitBooking(name, phone, test, date);
    }
}

function validatePhone(phone) {
    // Remove all non-digit characters
    const cleaned = phone.replace(/\D/g, '');
    // Check if it's exactly 10 digits
    return cleaned.length === 10;
}

function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
}

function clearFormErrors() {
    document.querySelectorAll('.form-error').forEach(error => {
        error.textContent = '';
        error.style.display = 'none';
    });
}

function submitBooking(name, phone, test, date) {
    // Prepare booking details
    const bookingData = {
        name,
        phone,
        test: getTestName(test),
        date: new Date(date).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }),
        bookingId: `SMD${Date.now()}`
    };

    // Display success modal
    showSuccessModal(bookingData);

    // Reset form
    bookingForm.reset();
    clearFormErrors();

    // In a real app, you would send this data to a backend
    console.log('Booking submitted:', bookingData);
}

function getTestName(testId) {
    const testNames = {
        'blood-test': 'Complete Blood Test (CBC)',
        'thyroid-test': 'Thyroid Test (TSH/T3/T4)',
        'covid-test': 'COVID-19 Rapid Test',
        'lipid-test': 'Lipid Profile',
        'liver-test': 'Liver Function Test',
        'kidney-test': 'Kidney Function Test',
    };
    return testNames[testId] || 'Lab Test';
}

// ========== MODAL FUNCTIONS ==========
function showSuccessModal(bookingData) {
    const details = `
        <strong>Booking ID:</strong> ${bookingData.bookingId}<br>
        <strong>Name:</strong> ${bookingData.name}<br>
        <strong>Phone:</strong> ${bookingData.phone}<br>
        <strong>Test:</strong> ${bookingData.test}<br>
        <strong>Date:</strong> ${bookingData.date}
    `;
    
    document.getElementById('bookingDetails').innerHTML = details;
    successModal.classList.add('active');
}

function closeModal() {
    successModal.classList.remove('active');
}

// ========== UTILITY FUNCTIONS ==========
// Smooth scroll enhancement (already in CSS, but JS support for older browsers)
if (!('scrollBehavior' in document.documentElement.style)) {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').slice(1);
            const target = document.getElementById(targetId);
            if (target) {
                target.scrollIntoView({ behavior: 'auto' });
            }
        });
    });
}

// Add keyboard support for modal
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && successModal.classList.contains('active')) {
        closeModal();
    }
});

// ========== PERFORMANCE OPTIMIZATION ==========
// Debounce search input for better performance
function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

// NOTE: debouncedSearch const is declared near the top, before initializeEventListeners(), to avoid TDZ errors.

// ========== ACCESSIBILITY IMPROVEMENTS ==========
// Add focus styles and keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        if (e.target === searchInput) {
            handleSearch({ target: searchInput });
        }
    }
});

// Announce to screen readers when cart is updated
function announceToScreenReader(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', 'polite');
    announcement.className = 'visually-hidden';
    announcement.textContent = message;
    document.body.appendChild(announcement);
    
    setTimeout(() => announcement.remove(), 1000);
}

// Update announcements
const originalAddToCart = addToCart;
window.addToCart = function(productId, categoryId) {
    originalAddToCart(productId, categoryId);
    const product = products[categoryId].find(p => p.id === productId);
    if (product) {
        announceToScreenReader(`${product.name} added to cart`);
    }
};

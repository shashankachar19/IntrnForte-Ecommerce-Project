// ==============================
// 1. PRODUCT DATA (Local Array)
// ==============================
const products = [
    { id: 1, name: "TUF Gaming Headset", category: "Electronics", price: 5999, image: "assets/headset.jpg" },
    { id: 2, name: "Mech Keyboard RGB", category: "Electronics", price: 7499, image: "assets/keyboard.jpg" },
    { id: 3, name: "Wireless Gaming Mouse", category: "Electronics", price: 2999, image: "assets/mouse.jpg" },
    { id: 4, name: "Stealth Black Hoodie", category: "Clothing", price: 2499, image: "assets/hoodie.jpg" },
    { id: 5, name: "Gamer Graphic Tee", category: "Clothing", price: 1299, image: "assets/tshirt.jpg" },
    { id: 6, name: "Tech Backpack", category: "Accessories", price: 3299, image: "assets/backpack.jpg" },
    { id: 7, name: "Digital Smart Watch", category: "Accessories", price: 1599, image: "assets/watch.jpg" },
    { id: 8, name: "Aviator Sunglasses", category: "Accessories", price: 899, image: "assets/glasses.jpg" }
];

// ==============================
// 2. DOM ELEMENTS
// ==============================
const grid = document.getElementById('productGrid');
const btns = document.querySelectorAll('.filter-btn');
const range = document.getElementById('priceRange');
const priceLabel = document.getElementById('priceValue');
const cartTotal = document.getElementById('cartTotal');
const cartWidget = document.querySelector('.cart-widget');

// Track cart count per item
const cartCounts = {};
let total = 0;

// ==============================
// 3. UI ANIMATIONS & TOASTS
// ==============================

// Custom Toast Notification
function showToast(message) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span style="color: var(--accent); font-size: 1.2rem;">✓</span> <span>${message}</span>`;
    
    container.appendChild(toast);
    
    // Auto remove after 3s
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// Number Counter Animation
function animateValue(obj, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        obj.innerHTML = "\u20B9" + Math.floor(progress * (end - start) + start);
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// ==============================
// 4. RENDER FUNCTION
// ==============================
function displayProducts(list) {
    grid.innerHTML = "";

    if (list.length === 0) {
        grid.innerHTML = "<p style='color:var(--muted); padding:20px; width:100%;'>No products found matching your criteria.</p>";
        return;
    }

    list.forEach((product, index) => {
        const card = document.createElement('div');
        card.className = "product-card";
        
        // Staggered Animation Delay (0.1s, 0.2s, etc.)
        card.style.animationDelay = `${index * 0.1}s`; 

        card.innerHTML = `
            <div class="image-container">
                <img 
                    src="${product.image}" 
                    alt="${product.name}" 
                    loading="lazy"
                    onerror="this.src='https://via.placeholder.com/200?text=No+Image'"
                >
            </div>
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p style="color:gray; font-size:0.85rem; margin-top:5px;">${product.category}</p>
                <div class="product-price">\u20B9${product.price}</div>
                
                <span class="cart-count" data-cart-count="${product.id}">
                    ${cartCounts[product.id] ? 'In Cart: ' + cartCounts[product.id] : ''}
                </span>

                <button class="add-btn" onclick="addToCart(${product.id}, '${product.name}')">Add to Cart</button>
            </div>
        `;

        grid.appendChild(card);
    });
}

// ==============================
// 5. CART & FILTER LOGIC
// ==============================
function addToCart(productId, productName) {
    const product = products.find(item => item.id === productId);
    if (!product) return;

    const oldTotal = total;
    total += product.price;

    // Animate the price change
    animateValue(cartTotal, oldTotal, total, 500);

    // Update cart count
    cartCounts[productId] = (cartCounts[productId] || 0) + 1;
    const countEl = document.querySelector(`[data-cart-count="${productId}"]`);
    if (countEl) countEl.textContent = `In Cart: ${cartCounts[productId]}`;

    // Show Custom Toast
    showToast(`Added <b>${productName}</b> to cart!`);

    // Little Shake Animation for the Cart Widget
    if(cartWidget) {
        cartWidget.style.transform = "scale(1.02)";
        setTimeout(() => cartWidget.style.transform = "scale(1)", 150);
    }
}

function filter() {
    const activeBtn = document.querySelector('.filter-btn.active');
    const activeCategory = activeBtn ? activeBtn.dataset.category : 'All';
    const maxPrice = range ? parseInt(range.value, 10) : 100000;

    const filtered = products.filter(item => {
        const catMatch = activeCategory === 'All' || item.category === activeCategory;
        const priceMatch = item.price <= maxPrice;
        return catMatch && priceMatch;
    });

    displayProducts(filtered);
}

// ==============================
// 6. EVENT LISTENERS
// ==============================
btns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        btns.forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        filter();
    });
});

if (range) {
    range.addEventListener('input', (e) => {
        if (priceLabel) priceLabel.innerText = `\u20B9${e.target.value}`;
        filter();
    });
}

// Initial Load
if (priceLabel && range) priceLabel.innerText = `\u20B9${range.value}`;
filter();
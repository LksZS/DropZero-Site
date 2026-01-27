// ================================
// STATE MANAGEMENT
// ================================

let state = {
    cart: loadFromStorage(STORAGE_KEYS.cart, []),
    wishlist: loadFromStorage(STORAGE_KEYS.wishlist, []),
    compare: loadFromStorage(STORAGE_KEYS.compare, []),
    appliedCoupon: loadFromStorage(STORAGE_KEYS.appliedCoupon, null),
    currentFilters: {
        category: 'todos',
        search: '',
        sort: '',
        priceRange: ''
    },
    viewMode: 'grid',
    settings: loadFromStorage(STORAGE_KEYS.settings, {
        animations: true,
        customCursor: true,
        sound: false
    })
};

// ================================
// INITIALIZATION
// ================================

document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

function initApp() {
    // Aplicar configurações
    applySettings();
    
    // Setup cursor personalizado
    setupCustomCursor();
    
    // Setup header scroll effect
    setupHeaderScroll();
    
    // Setup busca
    setupSearch();
    
    // Renderizar produtos
    renderProducts();
    
    // Atualizar contadores
    updateCartCount();
    updateWishlistCount();
    updateCompareCount();
    
    // Renderizar carrinho se houver itens
    if (state.cart.length > 0) {
        renderCart();
    }
    
    // Renderizar wishlist se houver itens
    if (state.wishlist.length > 0) {
        renderWishlist();
    }
    
    // Renderizar comparação se houver itens
    if (state.compare.length > 0) {
        renderCompare();
    }
    
    // Remover loading
    setTimeout(() => {
        const loading = document.getElementById('loading-overlay');
        if (loading) {
            loading.classList.remove('active');
        }
    }, 500);
    
    console.log('🚀 Drop Zero initialized!');
}

// ================================
// CUSTOM CURSOR
// ================================

function setupCustomCursor() {
    if (!state.settings.customCursor) {
        document.body.classList.remove('custom-cursor');
        return;
    }
    
    document.body.classList.add('custom-cursor');
    
    const cursor = document.getElementById('cursor');
    const follower = document.getElementById('cursor-follower');
    
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    let followerX = 0, followerY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    // Smooth cursor animation
    function animate() {
        // Cursor principal
        cursorX += (mouseX - cursorX) * 0.2;
        cursorY += (mouseY - cursorY) * 0.2;
        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';
        
        // Follower
        followerX += (mouseX - followerX) * 0.1;
        followerY += (mouseY - followerY) * 0.1;
        follower.style.left = followerX + 'px';
        follower.style.top = followerY + 'px';
        
        requestAnimationFrame(animate);
    }
    animate();
    
    // Hover effects
    const hoverElements = document.querySelectorAll('button, a, .product-card, .icon-btn, .tab-btn');
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            document.body.classList.add('cursor-hover');
        });
        el.addEventListener('mouseleave', () => {
            document.body.classList.remove('cursor-hover');
        });
    });
}

// ================================
// HEADER SCROLL EFFECT
// ================================

function setupHeaderScroll() {
    const header = document.getElementById('main-header');
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });
}

// ================================
// SEARCH
// ================================

function setupSearch() {
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');
    
    const debouncedSearch = debounce((query) => {
        if (query.length < 2) {
            searchResults.classList.remove('active');
            return;
        }
        
        const results = filterProducts({ search: query }).slice(0, 5);
        
        if (results.length === 0) {
            searchResults.innerHTML = '<div style="padding: 20px; text-align: center; color: var(--text-muted);">Nenhum resultado encontrado</div>';
            searchResults.classList.add('active');
            return;
        }
        
        searchResults.innerHTML = results.map(product => `
            <div class="search-result-item" onclick="quickView(${product.id}); document.getElementById('search-results').classList.remove('active');">
                <img src="${product.images[0]}" alt="${product.name}">
                <div class="search-result-info">
                    <h4>${product.name}</h4>
                    <p>${formatPrice(product.price)}</p>
                </div>
            </div>
        `).join('');
        
        searchResults.classList.add('active');
    }, 300);
    
    searchInput.addEventListener('input', (e) => {
        debouncedSearch(e.target.value);
    });
    
    // Fechar ao clicar fora
    document.addEventListener('click', (e) => {
        if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
            searchResults.classList.remove('active');
        }
    });
}

// ================================
// RENDER PRODUCTS
// ================================

function renderProducts() {
    const grid = document.getElementById('products-grid');
    const noResults = document.getElementById('no-results');
    
    const filteredProducts = filterProducts(state.currentFilters);
    
    if (filteredProducts.length === 0) {
        grid.style.display = 'none';
        noResults.style.display = 'block';
        return;
    }
    
    grid.style.display = 'grid';
    noResults.style.display = 'none';
    
    grid.innerHTML = filteredProducts.map(product => `
        <div class="product-card">
            <div class="product-image-wrapper">
                <img src="${product.images[0]}" alt="${product.name}" class="product-image" onclick="quickView(${product.id})">
                <div class="product-tags">
                    <div>
                        ${product.tags.map(tag => {
                            if (tag === 'new') return '<span class="tag new">NOVO</span>';
                            if (tag === 'sale') return '<span class="tag sale">SALE</span>';
                            if (tag === 'limited') return '<span class="tag">LIMITADO</span>';
                            if (tag === 'trending') return '<span class="tag">TRENDING</span>';
                            return '';
                        }).join('')}
                    </div>
                    <div class="wishlist-icon ${isInWishlist(product.id) ? 'active' : ''}" onclick="toggleWishlistItem(${product.id})">
                        ${isInWishlist(product.id) ? '❤️' : '🤍'}
                    </div>
                </div>
            </div>
            
            <div class="product-info">
                <div class="product-category">${product.category.toUpperCase()}</div>
                <h3 class="product-name">${product.name}</h3>
                
                <div class="product-rating">
                    <span class="stars">${generateStars(product.rating)}</span>
                    <span class="rating-count">(${product.reviews})</span>
                </div>
                
                <div class="product-price-row">
                    ${product.oldPrice ? 
                        `<span class="product-price-old">${formatPrice(product.oldPrice)}</span>` : 
                        ''
                    }
                    <span class="product-price">${formatPrice(product.price)}</span>
                </div>
                
                <div class="product-actions">
                    <button class="btn btn-primary" onclick="quickView(${product.id})" ${!product.inStock ? 'disabled' : ''}>
                        ${product.inStock ? 'ADICIONAR' : 'ESGOTADO'}
                    </button>
                    <button class="btn btn-secondary btn-icon" onclick="toggleCompareItem(${product.id})" title="Comparar">
                        ⚖️
                    </button>
                    <button class="btn btn-secondary btn-icon" onclick="quickView(${product.id})" title="Ver Detalhes">
                        👁️
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// ================================
// FILTERS
// ================================

function filterCategory(category) {
    state.currentFilters.category = category;
    
    // Atualizar UI dos botões
    document.querySelectorAll('.tab-btn[data-filter]').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    renderProducts();
    playSound('click');
}

function applyFilters() {
    const sortFilter = document.getElementById('sort-filter').value;
    const priceFilter = document.getElementById('price-filter').value;
    
    state.currentFilters.sort = sortFilter;
    state.currentFilters.priceRange = priceFilter;
    
    renderProducts();
    playSound('click');
}

function changeView(view) {
    state.viewMode = view;
    const grid = document.getElementById('products-grid');
    
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    if (view === 'list') {
        grid.classList.add('list-view');
    } else {
        grid.classList.remove('list-view');
    }
    
    playSound('click');
}

// ================================
// QUICK VIEW MODAL
// ================================

function quickView(productId) {
    const product = getProductById(productId);
    if (!product) return;
    
    const modal = document.getElementById('quick-view-modal');
    const layout = modal.querySelector('.quick-view-layout');
    
    layout.innerHTML = `
        <div class="quick-view-gallery">
            <img src="${product.images[0]}" alt="${product.name}" class="quick-view-main-image" id="main-quick-image">
            <div class="quick-view-thumbnails">
                ${product.images.map((img, idx) => `
                    <img src="${img}" 
                         alt="${product.name}" 
                         class="thumbnail ${idx === 0 ? 'active' : ''}" 
                         onclick="changeQuickViewImage('${img}', ${idx})">
                `).join('')}
            </div>
        </div>
        
        <div class="quick-view-info">
            <h2>${product.name}</h2>
            
            <div class="product-rating">
                <span class="stars">${generateStars(product.rating)}</span>
                <span class="rating-count">(${product.reviews} avaliações)</span>
            </div>
            
            <div class="quick-view-price">
                ${product.oldPrice ? 
                    `<span style="text-decoration: line-through; color: var(--text-muted); font-size: 1.2rem; margin-right: 10px;">${formatPrice(product.oldPrice)}</span>` : 
                    ''
                }
                ${formatPrice(product.price)}
            </div>
            
            <p class="quick-view-description">${product.description}</p>
            
            <div class="size-selector">
                <h4>Selecione o tamanho:</h4>
                <div class="sizes">
                    ${product.sizes.map(size => `
                        <button class="size-option" data-size="${size}" onclick="selectSize('${size}')">
                            ${size}
                        </button>
                    `).join('')}
                </div>
            </div>
            
            <div class="quick-view-actions">
                <button class="btn btn-primary" style="flex: 2;" onclick="addToCartFromQuickView(${product.id})" ${!product.inStock ? 'disabled' : ''}>
                    ${product.inStock ? '🛒 ADICIONAR AO CARRINHO' : 'ESGOTADO'}
                </button>
                <button class="btn btn-secondary btn-icon" onclick="toggleWishlistItem(${product.id})">
                    ${isInWishlist(product.id) ? '❤️' : '🤍'}
                </button>
            </div>
        </div>
    `;
    
    modal.classList.add('active');
    playSound('open');
}

function closeQuickView() {
    const modal = document.getElementById('quick-view-modal');
    modal.classList.remove('active');
    playSound('close');
}

function changeQuickViewImage(src, index) {
    const mainImage = document.getElementById('main-quick-image');
    mainImage.src = src;
    
    document.querySelectorAll('.thumbnail').forEach((thumb, idx) => {
        thumb.classList.toggle('active', idx === index);
    });
}

let selectedSize = null;

function selectSize(size) {
    selectedSize = size;
    document.querySelectorAll('.size-option').forEach(opt => {
        opt.classList.remove('active');
    });
    event.target.classList.add('active');
}

function addToCartFromQuickView(productId) {
    const product = getProductById(productId);
    
    if (!product.inStock) {
        showToast('error', 'Ops!', config.messages.outOfStock);
        return;
    }
    
    if (product.sizes.length > 1 && !selectedSize) {
        showToast('info', 'Atenção', config.messages.selectSize);
        return;
    }
    
    addToCart(productId, selectedSize || product.sizes[0]);
    selectedSize = null;
}

// ================================
// CART
// ================================

function addToCart(productId, size = null, quantity = 1) {
    const product = getProductById(productId);
    if (!product) return;
    
    const cartItem = {
        id: generateId(),
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0],
        size: size || product.sizes[0],
        quantity: quantity
    };
    
    // Verificar se já existe no carrinho
    const existingIndex = state.cart.findIndex(
        item => item.productId === productId && item.size === cartItem.size
    );
    
    if (existingIndex >= 0) {
        state.cart[existingIndex].quantity += quantity;
    } else {
        state.cart.push(cartItem);
    }
    
    saveToStorage(STORAGE_KEYS.cart, state.cart);
    updateCartCount();
    renderCart();
    
    showToast('success', 'Sucesso!', config.messages.addedToCart);
    playSound('add');
}

function removeFromCart(itemId) {
    state.cart = state.cart.filter(item => item.id !== itemId);
    saveToStorage(STORAGE_KEYS.cart, state.cart);
    updateCartCount();
    renderCart();
    
    showToast('info', 'Removido', config.messages.removedFromCart);
    playSound('remove');
}

function updateCartQuantity(itemId, change) {
    const item = state.cart.find(i => i.id === itemId);
    if (!item) return;
    
    item.quantity += change;
    
    if (item.quantity <= 0) {
        removeFromCart(itemId);
        return;
    }
    
    saveToStorage(STORAGE_KEYS.cart, state.cart);
    renderCart();
    playSound('click');
}

function renderCart() {
    const cartItems = document.getElementById('cart-items');
    const emptyCart = document.getElementById('empty-cart');
    
    if (state.cart.length === 0) {
        cartItems.style.display = 'none';
        emptyCart.style.display = 'block';
        updateCartSummary();
        return;
    }
    
    cartItems.style.display = 'block';
    emptyCart.style.display = 'none';
    
    cartItems.innerHTML = state.cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}" class="cart-item-image">
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-details">Tamanho: ${item.size}</div>
                <div class="cart-item-price">${formatPrice(item.price)}</div>
                <div class="quantity-control">
                    <button class="quantity-btn" onclick="updateCartQuantity('${item.id}', -1)">−</button>
                    <span class="quantity-value">${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateCartQuantity('${item.id}', 1)">+</button>
                </div>
            </div>
            <button class="remove-btn" onclick="removeFromCart('${item.id}')">🗑️</button>
        </div>
    `).join('');
    
    updateCartSummary();
}

function updateCartSummary() {
    const subtotal = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discountRow = document.getElementById('discount-row');
    const discountEl = document.getElementById('discount');
    
    let discount = 0;
    let shipping = subtotal >= config.freeShippingMinValue ? 0 : config.shippingCost;
    
    // Aplicar cupom
    if (state.appliedCoupon) {
        const coupon = coupons[state.appliedCoupon];
        if (coupon) {
            if (subtotal >= coupon.minValue) {
                discount = subtotal * coupon.discount;
                if (coupon.freeShipping) {
                    shipping = 0;
                }
                discountRow.style.display = 'flex';
                discountEl.textContent = '- ' + formatPrice(discount);
            } else {
                state.appliedCoupon = null;
                saveToStorage(STORAGE_KEYS.appliedCoupon, null);
            }
        }
    } else {
        discountRow.style.display = 'none';
    }
    
    const total = subtotal - discount + shipping;
    
    document.getElementById('subtotal').textContent = formatPrice(subtotal);
    document.getElementById('shipping').textContent = shipping === 0 ? 'GRÁTIS' : formatPrice(shipping);
    document.getElementById('total').textContent = formatPrice(total);
}

function updateCartCount() {
    const count = state.cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cart-count').textContent = count;
}

function toggleCart() {
    const sidebar = document.getElementById('cart-sidebar');
    sidebar.classList.toggle('active');
    playSound('toggle');
}

// ================================
// WISHLIST
// ================================

function toggleWishlistItem(productId) {
    const index = state.wishlist.indexOf(productId);
    
    if (index >= 0) {
        state.wishlist.splice(index, 1);
        showToast('info', 'Removido', config.messages.removedFromWishlist);
    } else {
        state.wishlist.push(productId);
        showToast('success', 'Adicionado', config.messages.addedToWishlist);
    }
    
    saveToStorage(STORAGE_KEYS.wishlist, state.wishlist);
    updateWishlistCount();
    renderWishlist();
    renderProducts(); // Re-render para atualizar ícones
    playSound('add');
}

function isInWishlist(productId) {
    return state.wishlist.includes(productId);
}

function renderWishlist() {
    const wishlistItems = document.getElementById('wishlist-items');
    const emptyWishlist = document.getElementById('empty-wishlist');
    
    if (state.wishlist.length === 0) {
        wishlistItems.style.display = 'none';
        emptyWishlist.style.display = 'block';
        return;
    }
    
    wishlistItems.style.display = 'block';
    emptyWishlist.style.display = 'none';
    
    wishlistItems.innerHTML = state.wishlist.map(productId => {
        const product = getProductById(productId);
        if (!product) return '';
        
        return `
            <div class="wishlist-item">
                <img src="${product.images[0]}" alt="${product.name}" class="wishlist-item-image" onclick="quickView(${product.id})">
                <div class="wishlist-item-info">
                    <div class="wishlist-item-name">${product.name}</div>
                    <div class="cart-item-price">${formatPrice(product.price)}</div>
                    <button class="btn btn-primary" style="margin-top: 10px; padding: 8px 15px; font-size: 0.8rem;" onclick="quickView(${product.id})">
                        ADICIONAR AO CARRINHO
                    </button>
                </div>
                <button class="remove-btn" onclick="toggleWishlistItem(${product.id})">🗑️</button>
            </div>
        `;
    }).join('');
}

function updateWishlistCount() {
    document.getElementById('wishlist-count').textContent = state.wishlist.length;
}

function toggleWishlist() {
    const sidebar = document.getElementById('wishlist-sidebar');
    sidebar.classList.toggle('active');
    
    // Fechar carrinho se estiver aberto
    document.getElementById('cart-sidebar').classList.remove('active');
    
    playSound('toggle');
}

// ================================
// COMPARE
// ================================

function toggleCompareItem(productId) {
    const index = state.compare.indexOf(productId);
    
    if (index >= 0) {
        state.compare.splice(index, 1);
        showToast('info', 'Removido', config.messages.removedFromCompare);
    } else {
        if (state.compare.length >= config.maxCompareItems) {
            showToast('error', 'Limite atingido', config.messages.maxCompareReached);
            return;
        }
        state.compare.push(productId);
        showToast('success', 'Adicionado', config.messages.addedToCompare);
    }
    
    saveToStorage(STORAGE_KEYS.compare, state.compare);
    updateCompareCount();
    renderCompare();
    
    if (state.compare.length > 0) {
        document.getElementById('compare-panel').classList.add('active');
    } else {
        document.getElementById('compare-panel').classList.remove('active');
    }
    
    playSound('add');
}

function renderCompare() {
    const compareItems = document.getElementById('compare-items');
    
    compareItems.innerHTML = state.compare.map(productId => {
        const product = getProductById(productId);
        if (!product) return '';
        
        return `
            <div class="compare-item">
                <button class="compare-item-remove" onclick="toggleCompareItem(${product.id})">✕</button>
                <img src="${product.images[0]}" alt="${product.name}" onclick="quickView(${product.id})">
                <h4>${product.name}</h4>
                <p class="price">${formatPrice(product.price)}</p>
                <div class="product-rating" style="margin-top: 10px;">
                    <span class="stars">${generateStars(product.rating)}</span>
                </div>
            </div>
        `;
    }).join('');
}

function updateCompareCount() {
    document.getElementById('compare-count').textContent = state.compare.length;
}

function toggleCompare() {
    const panel = document.getElementById('compare-panel');
    panel.classList.toggle('active');
    playSound('toggle');
}

function clearCompare() {
    state.compare = [];
    saveToStorage(STORAGE_KEYS.compare, state.compare);
    updateCompareCount();
    renderCompare();
    document.getElementById('compare-panel').classList.remove('active');
    showToast('info', 'Limpo', 'Comparação limpa');
    playSound('remove');
}

// ================================
// COUPON
// ================================

function applyCoupon() {
    const input = document.getElementById('coupon-input');
    const code = input.value.toUpperCase().trim();
    
    if (!code) return;
    
    const coupon = coupons[code];
    
    if (!coupon) {
        showToast('error', 'Erro', config.messages.couponInvalid);
        input.value = '';
        return;
    }
    
    const subtotal = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    if (subtotal < coupon.minValue) {
        showToast('error', 'Erro', `${config.messages.couponMinValue} (${formatPrice(coupon.minValue)})`);
        return;
    }
    
    state.appliedCoupon = code;
    saveToStorage(STORAGE_KEYS.appliedCoupon, state.appliedCoupon);
    updateCartSummary();
    
    showToast('success', 'Cupom Aplicado!', coupon.description);
    input.value = '';
    playSound('success');
}

// ================================
// CHECKOUT
// ================================

function checkout() {
    if (state.cart.length === 0) {
        showToast('error', 'Erro', config.messages.cartEmpty);
        return;
    }
    
    showToast('info', 'Redirecionando...', 'Levando você para o checkout seguro');
    playSound('success');
    
    // Simular redirecionamento
    setTimeout(() => {
        alert('🚀 Checkout! Em produção, aqui você seria redirecionado para o pagamento.');
    }, 1500);
}

// ================================
// THEME
// ================================

function toggleTheme() {
    const html = document.documentElement;
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? '' : 'light';
    
    html.setAttribute('data-theme', newTheme);
    saveToStorage(STORAGE_KEYS.theme, newTheme);
    
    showToast('success', 'Tema alterado', newTheme === 'light' ? 'Modo claro ativado ☀️' : 'Modo escuro ativado 🌙');
    playSound('click');
}

// Aplicar tema salvo
const savedTheme = loadFromStorage(STORAGE_KEYS.theme);
if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
}

// ================================
// SETTINGS
// ================================

function toggleSettings() {
    const modal = document.getElementById('settings-modal');
    modal.classList.toggle('active');
    playSound('toggle');
}

function applySettings() {
    if (!state.settings.animations) {
        document.body.style.setProperty('--transition-fast', '0s');
        document.body.style.setProperty('--transition-normal', '0s');
        document.body.style.setProperty('--transition-slow', '0s');
    }
    
    if (!state.settings.customCursor) {
        document.body.classList.remove('custom-cursor');
    }
}

function toggleAnimations() {
    state.settings.animations = event.target.checked;
    saveToStorage(STORAGE_KEYS.settings, state.settings);
    applySettings();
    
    if (!state.settings.animations) {
        location.reload();
    }
}

function toggleCustomCursor() {
    state.settings.customCursor = event.target.checked;
    saveToStorage(STORAGE_KEYS.settings, state.settings);
    
    if (state.settings.customCursor) {
        setupCustomCursor();
    } else {
        document.body.classList.remove('custom-cursor');
    }
}

function toggleSound() {
    state.settings.sound = event.target.checked;
    saveToStorage(STORAGE_KEYS.settings, state.settings);
    
    if (state.settings.sound) {
        playSound('success');
    }
}

function resetSettings() {
    if (confirm('Resetar todas as configurações?')) {
        state.settings = {
            animations: true,
            customCursor: true,
            sound: false
        };
        saveToStorage(STORAGE_KEYS.settings, state.settings);
        location.reload();
    }
}

// Aplicar configurações salvas
document.getElementById('animations-toggle').checked = state.settings.animations;
document.getElementById('cursor-toggle').checked = state.settings.customCursor;
document.getElementById('sound-toggle').checked = state.settings.sound;

// ================================
// TOAST NOTIFICATIONS
// ================================

function showToast(type = 'info', title, message) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icons = {
        success: '✅',
        error: '❌',
        info: 'ℹ️'
    };
    
    toast.innerHTML = `
        <div class="toast-icon">${icons[type] || icons.info}</div>
        <div class="toast-content">
            <div class="toast-title">${title}</div>
            <div class="toast-message">${message}</div>
        </div>
        <button class="toast-close" onclick="this.parentElement.remove()">✕</button>
    `;
    
    container.appendChild(toast);
    
    // Auto remove após 4 segundos
    setTimeout(() => {
        toast.style.animation = 'toastSlide 0.4s cubic-bezier(0.16, 1, 0.3, 1) reverse';
        setTimeout(() => toast.remove(), 400);
    }, 4000);
}

// ================================
// SOUND EFFECTS
// ================================

function playSound(type) {
    if (!state.settings.sound) return;
    
    // Frequências para diferentes sons
    const sounds = {
        click: { freq: 800, duration: 50 },
        add: { freq: 600, duration: 100 },
        remove: { freq: 400, duration: 100 },
        success: { freq: 1000, duration: 150 },
        error: { freq: 200, duration: 200 },
        toggle: { freq: 700, duration: 80 },
        open: { freq: 900, duration: 100 },
        close: { freq: 500, duration: 100 }
    };
    
    const sound = sounds[type] || sounds.click;
    
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = sound.freq;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + sound.duration / 1000);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + sound.duration / 1000);
    } catch (e) {
        console.log('Audio not supported');
    }
}

// ================================
// GLOBAL EVENT LISTENERS
// ================================

// Fechar modals ao pressionar ESC
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeQuickView();
        toggleSettings();
        document.getElementById('cart-sidebar').classList.remove('active');
        document.getElementById('wishlist-sidebar').classList.remove('active');
        document.getElementById('compare-panel').classList.remove('active');
    }
});

// Prevenir zoom duplo no mobile
let lastTouchEnd = 0;
document.addEventListener('touchend', (e) => {
    const now = Date.now();
    if (now - lastTouchEnd <= 300) {
        e.preventDefault();
    }
    lastTouchEnd = now;
}, false);

console.log('✨ Drop Zero - Streetwear Revolution');
console.log('🎨 Desenvolvido com amor e tecnologia');
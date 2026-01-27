// ================================
// PRODUTOS DATABASE
// ================================

const products = [
    {
        id: 1,
        name: "Tee 'VOID' Black Edition",
        category: "camisetas",
        price: 120,
        oldPrice: null,
        images: [
            "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600",
            "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600",
            "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=600"
        ],
        description: "Camiseta oversized em 100% algodão premium com estampa exclusiva. Design minimalista que representa o vazio urbano. Perfeita para o streetwear contemporâneo.",
        rating: 4.8,
        reviews: 127,
        tags: ["new", "trending"],
        sizes: ["P", "M", "G", "GG"],
        colors: ["black", "white"],
        inStock: true,
        popular: true
    },
    {
        id: 2,
        name: "Cargo Pants 2.0 Tactical",
        category: "calças",
        price: 250,
        oldPrice: 320,
        images: [
            "https://images.unsplash.com/photo-1517423738875-5ce310acd3da?w=600",
            "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600",
            "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600"
        ],
        description: "Cargo pants com múltiplos bolsos utilitários. Tecido resistente e confortável. Design inspirado no estilo tático urbano com acabamento premium.",
        rating: 4.9,
        reviews: 203,
        tags: ["sale"],
        sizes: ["P", "M", "G", "GG"],
        colors: ["black", "olive", "khaki"],
        inStock: true,
        popular: true
    },
    {
        id: 3,
        name: "Cyber Kick Neon V3",
        category: "tênis",
        price: 599,
        oldPrice: null,
        images: [
            "https://images.unsplash.com/photo-1552346154-21d32810aba3?w=600",
            "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600",
            "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=600"
        ],
        description: "Sneaker futurista com detalhes neon e tecnologia de amortecimento avançada. Design ousado que une conforto e estilo. Edição limitada com apenas 500 pares.",
        rating: 5.0,
        reviews: 89,
        tags: ["new", "limited"],
        sizes: ["38", "39", "40", "41", "42", "43", "44"],
        colors: ["neon", "white"],
        inStock: true,
        popular: true
    },
    {
        id: 4,
        name: "Hoodie 'GLITCH' Premium",
        category: "hoodies",
        price: 210,
        oldPrice: null,
        images: [
            "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600",
            "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600",
            "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600"
        ],
        description: "Moletom oversized com capuz e estampa glitch digital. Algodão premium com forro interno macio. Ideal para looks urbanos e confortáveis.",
        rating: 4.7,
        reviews: 156,
        tags: ["trending"],
        sizes: ["P", "M", "G", "GG"],
        colors: ["black", "gray", "navy"],
        inStock: true,
        popular: false
    },
    {
        id: 5,
        name: "Tee 'URBAN CHAOS' White",
        category: "camisetas",
        price: 110,
        oldPrice: 140,
        images: [
            "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600",
            "https://images.unsplash.com/photo-1618354691229-88d47f285158?w=600",
            "https://images.unsplash.com/photo-1622445275576-721325763afe?w=600"
        ],
        description: "Camiseta com arte gráfica representando o caos urbano. Corte moderno e tecido respirável. Edição especial da coleção verão.",
        rating: 4.5,
        reviews: 92,
        tags: ["sale"],
        sizes: ["P", "M", "G", "GG", "XG"],
        colors: ["white", "cream"],
        inStock: true,
        popular: false
    },
    {
        id: 6,
        name: "Bomber Jacket 'APEX'",
        category: "hoodies",
        price: 380,
        oldPrice: null,
        images: [
            "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600",
            "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600",
            "https://images.unsplash.com/photo-1548126032-079166d59e67?w=600"
        ],
        description: "Jaqueta bomber de nylon com forro térmico. Design aerodinâmico com bolsos estratégicos. Resistente à água e vento.",
        rating: 4.9,
        reviews: 67,
        tags: ["new"],
        sizes: ["M", "G", "GG"],
        colors: ["black", "navy"],
        inStock: false,
        popular: true
    },
    {
        id: 7,
        name: "Chain Necklace 'METAL'",
        category: "acessórios",
        price: 85,
        oldPrice: null,
        images: [
            "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600",
            "https://images.unsplash.com/photo-1611652022419-a9419f74343a?w=600",
            "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600"
        ],
        description: "Corrente chunky em aço inoxidável. Design industrial com acabamento premium. Comprimento ajustável para diferentes estilos.",
        rating: 4.6,
        reviews: 134,
        tags: ["trending"],
        sizes: ["Único"],
        colors: ["silver", "gold"],
        inStock: true,
        popular: true
    },
    {
        id: 8,
        name: "Jogger Pants 'COMFORT'",
        category: "calças",
        price: 180,
        oldPrice: 220,
        images: [
            "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=600",
            "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600",
            "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=600"
        ],
        description: "Jogger pants em moletom premium. Cintura elástica com cordão ajustável. Bolsos laterais e traseiros profundos.",
        rating: 4.8,
        reviews: 178,
        tags: ["sale"],
        sizes: ["P", "M", "G", "GG"],
        colors: ["black", "gray", "navy"],
        inStock: true,
        popular: false
    },
    {
        id: 9,
        name: "Sneaker 'GHOST' Edition",
        category: "tênis",
        price: 450,
        oldPrice: null,
        images: [
            "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600",
            "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=600",
            "https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?w=600"
        ],
        description: "Tênis all-white com design minimalista fantasmagórico. Solado de borracha premium com tecnologia anti-slip. Perfeito para looks monocromáticos.",
        rating: 4.7,
        reviews: 95,
        tags: ["new"],
        sizes: ["38", "39", "40", "41", "42", "43"],
        colors: ["white"],
        inStock: true,
        popular: true
    },
    {
        id: 10,
        name: "Beanie 'ARCTIC' Wool",
        category: "acessórios",
        price: 65,
        oldPrice: null,
        images: [
            "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=600",
            "https://images.unsplash.com/photo-1519709042477-8de6eaf1fdc5?w=600",
            "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=600"
        ],
        description: "Touca de lã premium com forro interno. Design minimalista e atemporal. Mantém o calor sem perder o estilo.",
        rating: 4.4,
        reviews: 211,
        tags: [],
        sizes: ["Único"],
        colors: ["black", "gray", "beige"],
        inStock: true,
        popular: false
    },
    {
        id: 11,
        name: "Tee 'DIGITAL' Oversized",
        category: "camisetas",
        price: 135,
        oldPrice: null,
        images: [
            "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=600",
            "https://images.unsplash.com/photo-1622470953794-aa9c70b0fb9d?w=600",
            "https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=600"
        ],
        description: "Camiseta oversized com arte digital cyberpunk. Impressão em alta definição que não desbota. Caimento perfeito para streetwear.",
        rating: 4.9,
        reviews: 143,
        tags: ["new", "trending"],
        sizes: ["M", "G", "GG", "XG"],
        colors: ["black"],
        inStock: true,
        popular: true
    },
    {
        id: 12,
        name: "Backpack 'TECH' Pro",
        category: "acessórios",
        price: 220,
        oldPrice: 280,
        images: [
            "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600",
            "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=600",
            "https://images.unsplash.com/photo-1585916420730-d7f95e942d43?w=600"
        ],
        description: "Mochila técnica com compartimento para notebook até 17'. Múltiplos bolsos organizadores e tecido impermeável. Design ergonômico.",
        rating: 5.0,
        reviews: 189,
        tags: ["sale", "trending"],
        sizes: ["Único"],
        colors: ["black", "navy"],
        inStock: true,
        popular: true
    }
];

// ================================
// CUPONS DE DESCONTO
// ================================

const coupons = {
    "DROPZERO10": { discount: 0.10, minValue: 100, description: "10% OFF" },
    "FIRST20": { discount: 0.20, minValue: 200, description: "20% OFF primeira compra" },
    "CYBER30": { discount: 0.30, minValue: 300, description: "30% OFF" },
    "FREESHIP": { discount: 0, freeShipping: true, minValue: 0, description: "Frete Grátis" },
    "VIP50": { discount: 0.50, minValue: 500, description: "50% OFF VIP" }
};

// ================================
// CONFIGURAÇÕES
// ================================

const config = {
    currency: "R$",
    shippingCost: 25,
    freeShippingMinValue: 300,
    taxRate: 0, // Sem impostos adicionais no Brasil
    maxCompareItems: 3,
    
    // Mensagens
    messages: {
        addedToCart: "Produto adicionado ao carrinho!",
        removedFromCart: "Produto removido do carrinho",
        addedToWishlist: "Adicionado aos favoritos ❤️",
        removedFromWishlist: "Removido dos favoritos",
        addedToCompare: "Produto adicionado à comparação",
        removedFromCompare: "Produto removido da comparação",
        maxCompareReached: "Você pode comparar no máximo 3 produtos",
        couponApplied: "Cupom aplicado com sucesso! 🎉",
        couponInvalid: "Cupom inválido ou expirado",
        couponMinValue: "Valor mínimo não atingido para este cupom",
        outOfStock: "Produto fora de estoque",
        selectSize: "Por favor, selecione um tamanho",
        cartEmpty: "Seu carrinho está vazio",
        wishlistEmpty: "Você ainda não tem favoritos",
        compareEmpty: "Nenhum produto para comparar"
    }
};

// ================================
// STORAGE KEYS
// ================================

const STORAGE_KEYS = {
    cart: 'dropzero_cart',
    wishlist: 'dropzero_wishlist',
    compare: 'dropzero_compare',
    theme: 'dropzero_theme',
    settings: 'dropzero_settings',
    appliedCoupon: 'dropzero_coupon'
};

// ================================
// HELPERS
// ================================

// Formatar preço
function formatPrice(price) {
    return `${config.currency} ${price.toFixed(2).replace('.', ',')}`;
}

// Obter produto por ID
function getProductById(id) {
    return products.find(p => p.id === id);
}

// Filtrar produtos
function filterProducts(filters = {}) {
    let filtered = [...products];
    
    // Filtrar por categoria
    if (filters.category && filters.category !== 'todos') {
        filtered = filtered.filter(p => p.category === filters.category);
    }
    
    // Filtrar por preço
    if (filters.priceRange) {
        const [min, max] = filters.priceRange.split('-').map(v => 
            v === '+' ? Infinity : parseInt(v)
        );
        filtered = filtered.filter(p => p.price >= min && p.price <= max);
    }
    
    // Filtrar por busca
    if (filters.search) {
        const search = filters.search.toLowerCase();
        filtered = filtered.filter(p => 
            p.name.toLowerCase().includes(search) ||
            p.description.toLowerCase().includes(search) ||
            p.category.toLowerCase().includes(search)
        );
    }
    
    // Ordenar
    if (filters.sort) {
        switch (filters.sort) {
            case 'price-asc':
                filtered.sort((a, b) => a.price - b.price);
                break;
            case 'price-desc':
                filtered.sort((a, b) => b.price - a.price);
                break;
            case 'popular':
                filtered.sort((a, b) => b.reviews - a.reviews);
                break;
            case 'rating':
                filtered.sort((a, b) => b.rating - a.rating);
                break;
            case 'new':
                filtered.sort((a, b) => {
                    const aNew = a.tags.includes('new') ? 1 : 0;
                    const bNew = b.tags.includes('new') ? 1 : 0;
                    return bNew - aNew;
                });
                break;
        }
    }
    
    return filtered;
}

// Gerar estrelas de avaliação
function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    let stars = '';
    
    for (let i = 0; i < fullStars; i++) {
        stars += '★';
    }
    if (hasHalfStar) {
        stars += '☆';
    }
    while (stars.length < 5) {
        stars += '☆';
    }
    
    return stars;
}

// Salvar no localStorage
function saveToStorage(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
        return true;
    } catch (e) {
        console.error('Erro ao salvar no localStorage:', e);
        return false;
    }
}

// Carregar do localStorage
function loadFromStorage(key, defaultValue = null) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : defaultValue;
    } catch (e) {
        console.error('Erro ao carregar do localStorage:', e);
        return defaultValue;
    }
}

// Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Gerar ID único
function generateId() {
    return Date.now() + Math.random().toString(36).substr(2, 9);
}
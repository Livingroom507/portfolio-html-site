const STORE_PRODUCTS = [
    {
        id: "canal-classic-tee",
        name: "Canal Classic Tee",
        category: "Streetwear",
        price: 50,
        image: "images/products/download.jpg",
        gallery: [
            "images/products/download.jpg",
            "images/exclusive/CULTURAL IMAGES-10.png",
            "images/exclusive/CULTURAL IMAGES-11.png",
            "images/exclusive/CULTURAL IMAGES-12-3.png"
        ],
        description: "A bold print tee built for everyday wear, with a clean fit and a statement graphic inspired by Panama City energy.",
        tags: ["Cotton", "Unisex", "Limited Drop"]
    },
    {
        id: "livingroom-signature-shirt",
        name: "Livingroom Signature Shirt",
        category: "Lifestyle",
        price: 58,
        image: "images/featured catergories/IMAGES1new.png",
        gallery: [
            "images/featured catergories/IMAGES1new.png",
            "images/featured catergories/categories3.jpg",
            "images/exclusive/CULTURAL IMAGES-13.png",
            "images/exclusive/CULTURAL IMAGES-8.png"
        ],
        description: "A signature top from Livingroom507MOC with an easy silhouette designed to work across casual and event looks.",
        tags: ["Soft touch", "Premium print", "Panama made"]
    },
    {
        id: "sunset-gold-graphic",
        name: "Sunset Gold Graphic",
        category: "Exclusive",
        price: 64,
        image: "images/exclusive/CULTURAL IMAGES-13.png",
        gallery: [
            "images/exclusive/CULTURAL IMAGES-13.png",
            "images/exclusive/CULTURAL IMAGES-12-1.png",
            "images/exclusive/CULTURAL IMAGES-12-2.png",
            "images/exclusive/CULTURAL IMAGES-12-3.png"
        ],
        description: "High-impact color and clean detailing make this piece fit for a standout launch collection.",
        tags: ["Drop 01", "Bold color", "Collector piece"]
    },
    {
        id: "night-market-print",
        name: "Night Market Print",
        category: "Featured",
        price: 46,
        image: "images/exclusive/CULTURAL IMAGES-10.png",
        gallery: [
            "images/exclusive/CULTURAL IMAGES-10.png",
            "images/exclusive/CULTURAL IMAGES-11.png",
            "images/exclusive/CULTURAL IMAGES-9.png",
            "images/exclusive/CULTURAL IMAGES-8.png"
        ],
        description: "A graphic-forward shirt with a darker palette and all-day comfort for casual wear.",
        tags: ["Best seller", "Machine wash", "Relaxed fit"]
    },
    {
        id: "causeway-weekend-fit",
        name: "Causeway Weekend Fit",
        category: "Weekend",
        price: 52,
        image: "images/featured catergories/categories1.jpg",
        gallery: [
            "images/featured catergories/categories1.jpg",
            "images/featured catergories/categories3.jpg",
            "images/exclusive/CULTURAL IMAGES-6.png",
            "images/exclusive/CULTURAL IMAGES-2-1.png"
        ],
        description: "Laid-back styling with a crisp print direction, designed for weekends, meetups, and easy layering.",
        tags: ["Easy fit", "Versatile", "Fresh stock"]
    },
    {
        id: "city-lights-overshirt",
        name: "City Lights Overshirt",
        category: "New Arrival",
        price: 69,
        image: "images/exclusive/CULTURAL IMAGES-11.png",
        gallery: [
            "images/exclusive/CULTURAL IMAGES-11.png",
            "images/exclusive/CULTURAL IMAGES-10.png",
            "images/exclusive/CULTURAL IMAGES-13.png",
            "images/portfolio12.jpg"
        ],
        description: "A slightly elevated layer that combines streetwear attitude with a more polished finish.",
        tags: ["Layering", "New arrival", "Statement piece"]
    }
];

const FEATURED_IDS = [
    "canal-classic-tee",
    "livingroom-signature-shirt",
    "sunset-gold-graphic",
    "night-market-print"
];

const CART_STORAGE_KEY = "livingroom507-cart";

function getProductById(productId) {
    return STORE_PRODUCTS.find((product) => product.id === productId);
}

function formatCurrency(value) {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD"
    }).format(value);
}

function getCart() {
    try {
        const rawCart = window.localStorage.getItem(CART_STORAGE_KEY);
        return rawCart ? JSON.parse(rawCart) : [];
    } catch (error) {
        console.error("Unable to read cart data.", error);
        return [];
    }
}

function saveCart(cartItems) {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    updateCartCount();
}

function getCartCount() {
    return getCart().reduce((total, item) => total + item.quantity, 0);
}

function updateCartCount() {
    const count = getCartCount();
    document.querySelectorAll("[data-cart-count]").forEach((node) => {
        node.textContent = count;
    });
}

function buildRatingMarkup() {
    return '<div class="rating" aria-label="Rated five out of five"><span aria-hidden="true">★★★★★</span></div>';
}

function addToCart(productId, quantity = 1, size = "Standard") {
    const product = getProductById(productId);

    if (!product) {
        return;
    }

    const cart = getCart();
    const normalizedQuantity = Number.isFinite(quantity) ? Math.max(1, quantity) : 1;
    const normalizedSize = size || "Standard";
    const existingItem = cart.find((item) => item.id === productId && item.size === normalizedSize);

    if (existingItem) {
        existingItem.quantity += normalizedQuantity;
    } else {
        cart.push({
            id: productId,
            quantity: normalizedQuantity,
            size: normalizedSize
        });
    }

    saveCart(cart);
}

function removeCartItem(productId, size) {
    const nextCart = getCart().filter((item) => !(item.id === productId && item.size === size));
    saveCart(nextCart);
    renderCartPage();
}

function updateCartItemQuantity(productId, size, quantity) {
    const nextQuantity = Math.max(0, Number(quantity) || 0);

    if (nextQuantity === 0) {
        removeCartItem(productId, size);
        return;
    }

    const cart = getCart();
    const targetItem = cart.find((item) => item.id === productId && item.size === size);

    if (!targetItem) {
        return;
    }

    targetItem.quantity = nextQuantity;
    saveCart(cart);
    renderCartPage();
}

function renderProductCards(container, productIds) {
    if (!container) {
        return;
    }

    const cardsMarkup = productIds
        .map((productId) => getProductById(productId))
        .filter(Boolean)
        .map((product) => {
            return `
                <article class="product-card">
                    <img src="${product.image}" alt="${product.name}">
                    <div class="card-copy">
                        <p class="eyebrow">${product.category}</p>
                        <h3>${product.name}</h3>
                        <p>${product.description}</p>
                        ${buildRatingMarkup()}
                        <div class="price-row">
                            <span class="price">${formatCurrency(product.price)}</span>
                            <div class="button-row">
                                <a class="btn-secondary" href="product-discription.html?product=${product.id}">View Details</a>
                                <button class="btn" type="button" data-add-to-cart="${product.id}">Add To Cart</button>
                            </div>
                        </div>
                    </div>
                </article>
            `;
        })
        .join("");

    container.innerHTML = cardsMarkup;
}

function renderStoreSections() {
    const featuredContainer = document.querySelector("[data-featured-products]");
    const fullGridContainer = document.querySelector("[data-product-grid]");
    const relatedContainer = document.querySelector("[data-related-products]");

    if (featuredContainer) {
        renderProductCards(featuredContainer, FEATURED_IDS);
    }

    if (fullGridContainer) {
        renderProductCards(
            fullGridContainer,
            STORE_PRODUCTS.map((product) => product.id)
        );
    }

    if (relatedContainer) {
        const currentProductId = new URLSearchParams(window.location.search).get("product");
        const relatedIds = STORE_PRODUCTS
            .filter((product) => product.id !== currentProductId)
            .slice(0, 4)
            .map((product) => product.id);
        renderProductCards(relatedContainer, relatedIds);
    }
}

function renderProductDetail() {
    const detailContainer = document.querySelector("[data-product-detail]");

    if (!detailContainer) {
        return;
    }

    const query = new URLSearchParams(window.location.search);
    const productId = query.get("product") || FEATURED_IDS[0];
    const product = getProductById(productId) || getProductById(FEATURED_IDS[0]);

    detailContainer.innerHTML = `
        <div class="gallery-card">
            <div class="gallery-frame">
                <img src="${product.gallery[0]}" alt="${product.name}" id="detail-main-image">
            </div>
            <div class="thumbnail-grid" data-thumbnail-grid>
                ${product.gallery
                    .map(
                        (image, index) => `
                            <button
                                class="thumb-button${index === 0 ? " is-active" : ""}"
                                type="button"
                                data-thumbnail="${image}"
                                aria-label="Show ${product.name} image ${index + 1}"
                            >
                                <img src="${image}" alt="${product.name} thumbnail ${index + 1}">
                            </button>
                        `
                    )
                    .join("")}
            </div>
        </div>
        <div class="product-copy">
            <p class="eyebrow">${product.category}</p>
            <h1>${product.name}</h1>
            <p>${product.description}</p>
            <div class="meta-list">
                ${product.tags.map((tag) => `<span class="meta-pill">${tag}</span>`).join("")}
            </div>
            ${buildRatingMarkup()}
            <div class="price-row">
                <span class="price">${formatCurrency(product.price)}</span>
                <span class="tag">Ships from Panama</span>
            </div>
            <div class="purchase-panel">
                <label class="hidden" for="detail-size">Size</label>
                <select id="detail-size" data-size-select>
                    <option value="Small">Small</option>
                    <option value="Medium" selected>Medium</option>
                    <option value="Large">Large</option>
                    <option value="XL">XL</option>
                </select>
                <label class="hidden" for="detail-qty">Quantity</label>
                <input class="qty-input" id="detail-qty" type="number" min="1" value="1" data-qty-input>
                <button class="btn" type="button" data-add-detail-to-cart="${product.id}">Add To Cart</button>
            </div>
            <p>
                This product page is built to support presentation, selection, and a direct move into the cart.
            </p>
        </div>
    `;

    const mainImage = detailContainer.querySelector("#detail-main-image");
    const thumbnailButtons = detailContainer.querySelectorAll("[data-thumbnail]");

    thumbnailButtons.forEach((button) => {
        button.addEventListener("click", () => {
            mainImage.src = button.dataset.thumbnail;
            thumbnailButtons.forEach((node) => node.classList.remove("is-active"));
            button.classList.add("is-active");
        });
    });
}

function renderCartPage() {
    const cartPage = document.querySelector("[data-cart-page]");

    if (!cartPage) {
        return;
    }

    const itemsContainer = document.querySelector("[data-cart-items]");
    const summaryContainer = document.querySelector("[data-cart-summary]");
    const cart = getCart();
    const expandedItems = cart
        .map((item) => {
            const product = getProductById(item.id);
            return product ? { ...item, product } : null;
        })
        .filter(Boolean);

    if (!expandedItems.length) {
        itemsContainer.innerHTML = `
            <div class="empty-state">
                <h2>Your cart is empty.</h2>
                <p>Select products from the collection to begin building your order.</p>
                <div class="button-row">
                    <a class="btn" href="product-page.html">Browse Products</a>
                </div>
            </div>
        `;

        summaryContainer.innerHTML = `
            <div class="summary-row">
                <span>Items</span>
                <span>0</span>
            </div>
            <div class="summary-row">
                <span>Total</span>
                <strong>${formatCurrency(0)}</strong>
            </div>
        `;
        return;
    }

    const subtotal = expandedItems.reduce((total, item) => total + item.product.price * item.quantity, 0);

    itemsContainer.innerHTML = expandedItems
        .map((item) => {
            return `
                <article class="cart-item">
                    <img src="${item.product.image}" alt="${item.product.name}">
                    <div>
                        <h3>${item.product.name}</h3>
                        <p>${item.product.category}</p>
                        <p>Size: ${item.size}</p>
                        <p>${formatCurrency(item.product.price)} each</p>
                    </div>
                    <div class="cart-item-actions">
                        <label class="hidden" for="qty-${item.id}-${item.size}">Quantity</label>
                        <input
                            class="qty-input"
                            id="qty-${item.id}-${item.size}"
                            type="number"
                            min="1"
                            value="${item.quantity}"
                            data-cart-item-qty="${item.id}"
                            data-cart-item-size="${item.size}"
                        >
                        <button
                            class="remove-btn"
                            type="button"
                            data-remove-item="${item.id}"
                            data-remove-size="${item.size}"
                        >
                            Remove
                        </button>
                    </div>
                </article>
            `;
        })
        .join("");

    summaryContainer.innerHTML = `
        <div class="summary-row">
            <span>Items</span>
            <span>${expandedItems.reduce((total, item) => total + item.quantity, 0)}</span>
        </div>
        <div class="summary-row">
            <span>Shipping</span>
            <span>${subtotal > 0 ? "Included" : formatCurrency(0)}</span>
        </div>
        <div class="summary-row">
            <span>Total</span>
            <strong>${formatCurrency(subtotal)}</strong>
        </div>
    `;
}

function buildRatingMarkup() {
    return '<div class="rating" aria-label="Rated five out of five"><span aria-hidden="true">&#9733;&#9733;&#9733;&#9733;&#9733;</span></div>';
}

function handleStoreClicks(event) {
    const addCardButton = event.target.closest("[data-add-to-cart]");

    if (addCardButton) {
        addToCart(addCardButton.dataset.addToCart, 1, "Medium");
        addCardButton.textContent = "Added";
        window.setTimeout(() => {
            addCardButton.textContent = "Add To Cart";
        }, 1200);
        return;
    }

    const addDetailButton = event.target.closest("[data-add-detail-to-cart]");

    if (addDetailButton) {
        const quantityInput = document.querySelector("[data-qty-input]");
        const sizeSelect = document.querySelector("[data-size-select]");
        const quantity = Number.parseInt(quantityInput?.value || "1", 10);
        const size = sizeSelect?.value || "Medium";

        addToCart(addDetailButton.dataset.addDetailToCart, quantity, size);
        addDetailButton.textContent = "Added";
        window.setTimeout(() => {
            addDetailButton.textContent = "Add To Cart";
        }, 1200);
        return;
    }

    const removeButton = event.target.closest("[data-remove-item]");

    if (removeButton) {
        removeCartItem(removeButton.dataset.removeItem, removeButton.dataset.removeSize);
    }
}

function handleStoreChanges(event) {
    const quantityInput = event.target.closest("[data-cart-item-qty]");

    if (!quantityInput) {
        return;
    }

    updateCartItemQuantity(
        quantityInput.dataset.cartItemQty,
        quantityInput.dataset.cartItemSize,
        quantityInput.value
    );
}

function initStore() {
    updateCartCount();
    renderStoreSections();
    renderProductDetail();
    renderCartPage();
    document.addEventListener("click", handleStoreClicks);
    document.addEventListener("change", handleStoreChanges);
}

document.addEventListener("DOMContentLoaded", initStore);

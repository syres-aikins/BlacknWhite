document.addEventListener('DOMContentLoaded', () => {
    console.log('Script loaded on:', window.location.pathname);
    
    // Test localStorage
    const testStorage = () => {
        try {
            localStorage.setItem('test', 'test');
            localStorage.removeItem('test');
            return true;
        } catch (e) {
            return false;
        }
    };
    
    console.log('localStorage available:', testStorage());
    console.log('Current cart items:', localStorage.getItem('cartItems'));
    
    const prevBtn = document.querySelector('.control-btn.prev');
    const nextBtn = document.querySelector('.control-btn.next');
    const products = document.querySelectorAll('.product');
    const dots = document.querySelectorAll('.dot');
    const popup = document.getElementById('productPopup');
    const popupImage = document.querySelector('.popup-right img');
    const popupTitle = document.querySelector('.popup-left h1');
    const popupDescription = document.querySelector('.popup-left .description');
    let currentIndex = 1; // Start with center image

    const productDetails = {
        'tshirt1.png': {
            title: 'ELITE HOODIE',
            description: 'Stay cozy and stylish with our signature hoodie, featuring premium fabric and modern design.'
        },
        'tshirt2.png': {
            title: 'ELITE T-SHIRT',
            description: 'The black t-shirt combines the simplicity of classic streetwear with the bold versatility of modern minimalism.'
        },
        'tshirt3.png': {
            title: 'ELITE SWEATSHIRT',
            description: 'Experience ultimate comfort with our premium sweatshirt, perfect for both style and warmth.'
        }
    };

    function rotateImages(direction) {
        // Get current positions
        const leftImage = document.querySelector('.product.left');
        const centerImage = document.querySelector('.product.center');
        const rightImage = document.querySelector('.product.right');

        // Remove current positions
        leftImage.classList.remove('left');
        centerImage.classList.remove('center');
        rightImage.classList.remove('right');

        if (direction === 'next') {
            // Rotate right
            leftImage.classList.add('right');
            centerImage.classList.add('left');
            rightImage.classList.add('center');
        } else {
            // Rotate left
            leftImage.classList.add('center');
            centerImage.classList.add('right');
            rightImage.classList.add('left');
        }

        // Update dots
        currentIndex = (currentIndex + (direction === 'next' ? 1 : -1)) % dots.length;
        if (currentIndex < 0) currentIndex = dots.length - 1;
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }

    // Add click events for control buttons
    prevBtn.addEventListener('click', () => rotateImages('prev'));
    nextBtn.addEventListener('click', () => rotateImages('next'));

    // Add click event to all product images
    products.forEach(product => {
        product.addEventListener('click', () => {
            // If clicked image is not in center, only rotate it to center
            if (product.classList.contains('left')) {
                rotateImages('prev');
            } else if (product.classList.contains('right')) {
                rotateImages('next');
            } else if (product.classList.contains('center')) {
                // Only open popup if center image is clicked
                openPopup(product);
            }
        });
    });

    // Popup functionality
    function openPopup(product) {
        const clickedImageSrc = product.getAttribute('src');
        const imageName = clickedImageSrc.split('/').pop();
        
        popupImage.setAttribute('src', clickedImageSrc);
        popupTitle.textContent = productDetails[imageName].title;
        popupDescription.textContent = productDetails[imageName].description;
        
        // Reset active states
        document.querySelectorAll('.color-dot').forEach(dot => dot.classList.remove('active'));
        document.querySelectorAll('.size-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelector('.color-dot.black').classList.add('active');
        
        popup.classList.add('active');
    }

    // Color selection
    const colorDots = document.querySelectorAll('.color-dot');
    colorDots.forEach(dot => {
        dot.addEventListener('click', () => {
            colorDots.forEach(d => d.classList.remove('active'));
            dot.classList.add('active');
            // Here you can add logic to change product image based on color
        });
    });

    // Size selection
    const sizeBtns = document.querySelectorAll('.size-btn');
    sizeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            sizeBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });

    // Move cart functions to the top level
    function updateCartCount() {
        const cartCount = document.querySelector('.cart-count');
        const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        if (cartCount) {
            cartCount.textContent = cartItems.length;
        }
    }

    function updateCartDisplay() {
        console.log('Updating cart display');
        const cartItemsContainer = document.querySelector('.cart-items');
        if (!cartItemsContainer) {
            console.log('Cart container not found');
            return;
        }

        const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        console.log('Current cart items:', cartItems);

        if (cartItems.length === 0) {
            cartItemsContainer.innerHTML = `
                <h1>Shopping Cart</h1>
                <p>Your cart is empty</p>
            `;
            const subtotalElement = document.querySelector('.subtotal');
            const totalElement = document.querySelector('.total-amount');
            if (subtotalElement) subtotalElement.textContent = '$0.00';
            if (totalElement) totalElement.textContent = '$0.00';
            return;
        }

        let itemsHTML = '<h1>Shopping Cart</h1>';
        let subtotal = 0;

        cartItems.forEach((item, index) => {
            console.log('Processing item:', item);
            const price = parseFloat(item.price.replace('$', ''));
            subtotal += price * item.quantity;

            itemsHTML += `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.name}">
                    <div class="item-details">
                        <h3>${item.name}</h3>
                    </div>
                    <div class="item-quantity">
                        <button class="quantity-btn minus" data-index="${index}">-</button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="quantity-btn plus" data-index="${index}">+</button>
                    </div>
                    <p class="item-price">$${(price * item.quantity).toFixed(2)}</p>
                    <button class="remove-item" data-index="${index}">×</button>
                </div>
            `;
        });

        cartItemsContainer.innerHTML = itemsHTML;

        const subtotalElement = document.querySelector('.subtotal');
        const totalElement = document.querySelector('.total-amount');
        if (subtotalElement) subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
        if (totalElement) totalElement.textContent = `$${subtotal.toFixed(2)}`;
    }

    // Initialize cart count on all pages
    updateCartCount();

    // Check if we're on the cart page and update display
    if (window.location.pathname.includes('cart.html')) {
        console.log('On cart page, updating display');
        updateCartDisplay();

        // Handle cart interactions
        const cartItemsContainer = document.querySelector('.cart-items');
        if (cartItemsContainer) {
            cartItemsContainer.addEventListener('click', (e) => {
                if (e.target.classList.contains('quantity-btn') || e.target.classList.contains('remove-item')) {
                    const index = parseInt(e.target.dataset.index);
                    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

                    if (e.target.classList.contains('plus')) {
                        cartItems[index].quantity++;
                    } else if (e.target.classList.contains('minus')) {
                        if (cartItems[index].quantity > 1) {
                            cartItems[index].quantity--;
                        }
                    } else if (e.target.classList.contains('remove-item')) {
                        cartItems.splice(index, 1);
                    }

                    localStorage.setItem('cartItems', JSON.stringify(cartItems));
                    updateCartCount();
                    updateCartDisplay();
                }
            });
        }
    }

    // Handle Quick Add buttons on products page
    const quickAddBtns = document.querySelectorAll('.quick-add-btn');
    if (quickAddBtns.length > 0) {
        quickAddBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const productCard = btn.closest('.product-card');
                const productInfo = {
                    image: productCard.querySelector('.product-image img').src,
                    name: productCard.querySelector('.product-info h3').textContent,
                    price: productCard.querySelector('.product-info .price').textContent,
                    quantity: 1
                };

                console.log('Adding to cart:', productInfo);

                let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
                cartItems.push(productInfo);
                localStorage.setItem('cartItems', JSON.stringify(cartItems));

                // Show success message
                const successMessage = document.createElement('div');
                successMessage.className = 'add-to-cart-message';
                successMessage.textContent = 'Added to cart!';
                document.body.appendChild(successMessage);
                setTimeout(() => successMessage.remove(), 2000);

                updateCartCount();
            });
        });
    }

    // Popup slider dots
    const sliderDots = document.querySelectorAll('.slider-dots .dot');
    sliderDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            sliderDots.forEach(d => d.classList.remove('active'));
            dot.classList.add('active');
            // Here you can add logic to change product view angle
        });
    });

    // Close popup when clicking anywhere outside content
    popup.addEventListener('click', (e) => {
        if (e.target === popup) {
            popup.classList.remove('active');
        }
    });

    // Add click event to popup image to close popup
    popupImage.addEventListener('click', () => {
        popup.classList.remove('active');
    });

    // Add at the beginning of your DOMContentLoaded event
    const searchBtn = document.querySelector('.search-btn');
    const searchOverlay = document.querySelector('.search-overlay');
    const closeSearch = document.querySelector('.close-search');
    const searchInput = document.querySelector('.search-input');

    searchBtn.addEventListener('click', () => {
        searchOverlay.classList.add('active');
        searchInput.focus();
    });

    closeSearch.addEventListener('click', () => {
        searchOverlay.classList.remove('active');
    });

    // Close search on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && searchOverlay.classList.contains('active')) {
            searchOverlay.classList.remove('active');
        }
    });

    // Close search when clicking outside
    searchOverlay.addEventListener('click', (e) => {
        if (e.target === searchOverlay) {
            searchOverlay.classList.remove('active');
        }
    });
}); 
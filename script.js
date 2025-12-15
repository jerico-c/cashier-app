// --- DATA & CONFIGURATION ---
        const PRODUCTS = [
            { id: 1, name: 'Espresso', price: 22000, category: 'Hot Drinks' },
            { id: 2, name: 'Latte', price: 28000, category: 'Hot Drinks' },
            { id: 3, name: 'Cappuccino', price: 28000, category: 'Hot Drinks' },
            { id: 4, name: 'Americano', price: 25000, category: 'Hot Drinks' },
            { id: 5, name: 'Croissant', price: 18000, category: 'Pastries' },
            { id: 6, name: 'Muffin', price: 20000, category: 'Pastries' },
            { id: 7, name: 'Mineral Water', price: 10000, category: 'Cold Drinks' },
            { id: 8, name: 'Iced Tea', price: 15000, category: 'Cold Drinks' },
        ];

        const TAX_RATE = 0.11; // 11% PPN

        // --- APP STATE ---
        let state = {
            cart: [],
            activeCategory: 'All',
            searchQuery: '',
            discount: 0,
            lastOrder: {}
        };

        // --- DOM ELEMENTS ---
        const elements = {
            productList: document.getElementById('product-list'),
            cartItems: document.getElementById('cart-items'),
            cartSubtotal: document.getElementById('cart-subtotal'),
            cartTax: document.getElementById('cart-tax'),
            cartDiscount: document.getElementById('cart-discount'),
            cartTotal: document.getElementById('cart-total'),
            payButton: document.getElementById('pay-button'),
            emptyMessage: document.getElementById('empty-cart-message'),
            successModal: document.getElementById('success-modal'),
            closeModalBtn: document.getElementById('close-modal-button'),
            printReceiptBtn: document.getElementById('print-receipt-btn'),
            categoryFilters: document.getElementById('category-filters'),
            searchBar: document.getElementById('search-bar'),
            discountInput: document.getElementById('discount-input'),
            applyDiscountBtn: document.getElementById('apply-discount-btn'),
        };

        // --- HELPER FUNCTIONS ---
        const formatCurrency = (number) => {
            return new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            }).format(number);
        };

        const saveState = () => {
            localStorage.setItem('cashierCart', JSON.stringify(state.cart));
            localStorage.setItem('cashierDiscount', state.discount);
        };

        const loadState = () => {
            const savedCart = localStorage.getItem('cashierCart');
            const savedDiscount = localStorage.getItem('cashierDiscount');
            if (savedCart) state.cart = JSON.parse(savedCart);
            if (savedDiscount) {
                state.discount = parseFloat(savedDiscount);
                if (state.discount > 0) elements.discountInput.value = state.discount;
            }
        };

        // --- RENDERING FUNCTIONS ---
        const renderCategories = () => {
            const categories = ['All', ...new Set(PRODUCTS.map(p => p.category))];
            elements.categoryFilters.innerHTML = '';
            
            categories.forEach(category => {
                const button = document.createElement('button');
                button.textContent = category;
                button.className = `category-btn px-4 py-2 rounded-lg font-medium transition-colors duration-200 bg-white shadow-sm hover:bg-gray-200`;
                if (category === state.activeCategory) button.classList.add('active');
                
                button.addEventListener('click', () => {
                    state.activeCategory = category;
                    renderProducts();
                    renderCategories();
                });
                elements.categoryFilters.appendChild(button);
            });
        };

        const renderProducts = () => {
            let filtered = state.activeCategory === 'All' 
                ? PRODUCTS 
                : PRODUCTS.filter(p => p.category === state.activeCategory);

            if (state.searchQuery) {
                filtered = filtered.filter(p => p.name.toLowerCase().includes(state.searchQuery));
            }
            
            elements.productList.innerHTML = '';
            
            if (filtered.length === 0) {
                elements.productList.innerHTML = `<p class="col-span-full text-center text-gray-500 py-8">No products found.</p>`;
                return;
            }

            filtered.forEach(product => {
                const el = document.createElement('div');
                el.className = 'product-card bg-white p-4 rounded-lg shadow-md cursor-pointer flex flex-col justify-between';
                el.innerHTML = `<h3 class="font-semibold text-lg">${product.name}</h3> <p class="text-gray-600">${formatCurrency(product.price)}</p>`;
                el.addEventListener('click', () => addToCart(product));
                elements.productList.appendChild(el);
            });
        };

        const renderCart = () => {
            elements.cartItems.innerHTML = '';
            if (state.cart.length === 0) {
                elements.cartItems.appendChild(elements.emptyMessage);
                elements.emptyMessage.classList.remove('hidden');
            } else {
                elements.emptyMessage.classList.add('hidden');
                state.cart.forEach(item => {
                    const el = document.createElement('div');
                    el.className = 'flex justify-between items-center py-3';
                    el.innerHTML = `
                        <div class="flex-grow">
                            <p class="font-semibold">${item.name}</p>
                            <p class="text-sm text-gray-500">${formatCurrency(item.price)}</p>
                        </div>
                        <div class="flex items-center gap-3">
                            <button data-id="${item.id}" class="quantity-btn decrement-btn bg-gray-200 rounded-full w-6 h-6 flex items-center justify-center text-lg font-bold hover:bg-gray-300">-</button>
                            <span class="w-4 text-center font-medium">${item.quantity}</span>
                            <button data-id="${item.id}" class="quantity-btn increment-btn bg-gray-200 rounded-full w-6 h-6 flex items-center justify-center text-lg font-bold hover:bg-gray-300">+</button>
                        </div>
                        <div class="font-semibold w-24 text-right">${formatCurrency(item.price * item.quantity)}</div>
                    `;
                    elements.cartItems.appendChild(el);
                });
            }
            updateTotal();
        };

        // --- LOGIC & EVENTS ---
        const addToCart = (product) => {
            const existing = state.cart.find(item => item.id === product.id);
            if (existing) existing.quantity++;
            else state.cart.push({ ...product, quantity: 1 });
            renderCart();
        };

        const handleQuantityChange = (productId, action) => {
            const index = state.cart.findIndex(item => item.id === productId);
            if (index === -1) return;

            if (action === 'increment') state.cart[index].quantity++;
            else if (action === 'decrement') {
                state.cart[index].quantity--;
                if (state.cart[index].quantity <= 0) state.cart.splice(index, 1);
            }
            renderCart();
        };

        const updateTotal = () => {
            const subtotal = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            const tax = subtotal * TAX_RATE;
            const total = subtotal + tax - state.discount;

            elements.cartSubtotal.textContent = formatCurrency(subtotal);
            elements.cartTax.textContent = formatCurrency(tax);
            elements.cartDiscount.textContent = `- ${formatCurrency(state.discount)}`;
            elements.cartTotal.textContent = formatCurrency(total > 0 ? total : 0);
            
            elements.payButton.disabled = state.cart.length === 0;
            saveState();
        };

        const processPayment = () => {
            if (state.cart.length > 0) {
                const subtotal = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                const tax = subtotal * TAX_RATE;
                const total = subtotal + tax - state.discount;

                state.lastOrder = {
                    items: [...state.cart],
                    subtotal,
                    tax,
                    discount: state.discount,
                    total,
                    date: new Date()
                };

                elements.successModal.classList.remove('hidden');
                state.cart = [];
                state.discount = 0;
                elements.discountInput.value = '';
                renderCart();
            }
        };

        const printReceipt = () => {
            if (!state.lastOrder.items) return;

            const itemsHtml = state.lastOrder.items.map(item => `
                <tr>
                    <td>${item.name} (x${item.quantity})</td>
                    <td style="text-align: right;">${formatCurrency(item.price * item.quantity)}</td>
                </tr>
            `).join('');

            const receiptHtml = `
                <html>
                    <head>
                        <title>Receipt</title>
                        <style>
                            body { font-family: 'Courier New', monospace; margin: 0; padding: 20px; color: #000; }
                            .receipt { width: 300px; margin: auto; }
                            h2, p { text-align: center; margin: 5px 0; }
                            table { width: 100%; border-collapse: collapse; }
                            th, td { padding: 5px; }
                            .divider { border-top: 1px dashed #000; margin: 10px 0; }
                        </style>
                    </head>
                    <body>
                        <div class="receipt">
                            <h2>CashierPro Lite</h2>
                            <p>Jl. Pahlawan No. 123</p>
                            <div class="divider"></div>
                            <p>${state.lastOrder.date.toLocaleString('id-ID')}</p>
                            <div class="divider"></div>
                            <table>${itemsHtml}</table>
                            <div class="divider"></div>
                            <table>
                                <tr><td>Subtotal:</td><td align="right">${formatCurrency(state.lastOrder.subtotal)}</td></tr>
                                <tr><td>Tax (11%):</td><td align="right">${formatCurrency(state.lastOrder.tax)}</td></tr>
                                <tr><td>Discount:</td><td align="right">-${formatCurrency(state.lastOrder.discount)}</td></tr>
                                <tr><td><strong>Total:</strong></td><td align="right"><strong>${formatCurrency(state.lastOrder.total)}</strong></td></tr>
                            </table>
                            <div class="divider"></div>
                            <p>Thank you!</p>
                        </div>
                    </body>
                </html>
            `;

            const win = window.open('', '_blank');
            win.document.write(receiptHtml);
            win.document.close();
            win.focus();
            win.print();
            win.close();
        };

        // --- INITIALIZATION ---
        document.addEventListener('DOMContentLoaded', () => {
            loadState();
            renderCategories();
            renderProducts();
            renderCart();

            // Listeners
            elements.searchBar.addEventListener('input', (e) => {
                state.searchQuery = e.target.value.toLowerCase();
                renderProducts();
            });

            elements.applyDiscountBtn.addEventListener('click', () => {
                const val = parseFloat(elements.discountInput.value);
                state.discount = (!isNaN(val) && val >= 0) ? val : 0;
                if(state.discount === 0) elements.discountInput.value = '';
                updateTotal();
            });

            elements.cartItems.addEventListener('click', (e) => {
                const id = parseInt(e.target.dataset.id);
                if (e.target.classList.contains('increment-btn')) handleQuantityChange(id, 'increment');
                if (e.target.classList.contains('decrement-btn')) handleQuantityChange(id, 'decrement');
            });

            elements.payButton.addEventListener('click', processPayment);
            elements.printReceiptBtn.addEventListener('click', printReceipt);
            elements.closeModalBtn.addEventListener('click', () => elements.successModal.classList.add('hidden'));
        });
       

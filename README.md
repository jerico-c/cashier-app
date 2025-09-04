# CashierPro Lite: A Simple Cashier Application

CashierPro Lite is a clean, simple, and modern point-of-sale (POS) application designed for small businesses, pop-up shops, or cafes. It runs entirely in the browser with no need for a backend or complex setup.

Built with vanilla HTML, JavaScript, and styled with Tailwind CSS, this application is lightweight, easy to understand, and highly customizable.

![CashierPro Lite Screenshot](https://i.imgur.com/G5c86tK.png)

## ✨ Features

* **Dynamic Product Grid:** Products are loaded from a simple JavaScript array, making them easy to manage.
* **Interactive Cart:** Click on any product to add it to the order. The cart automatically groups identical items and updates their quantity.
* **Real-time Calculation:** The total amount is calculated instantly as items are added to the cart.
* **Responsive Design:** A clean and modern UI that works seamlessly on desktops, tablets, and mobile phones.
* **Currency Formatting:** Prices are automatically formatted in **Indonesian Rupiah (IDR)**.
* **Simple Checkout:** A straightforward payment simulation that clears the cart for the next transaction.
* **Zero Dependencies:** Runs from a single HTML file with no installation required.

## 🚀 How to Use

Getting started is as simple as it gets:

1.  Download the `cashier_app.html` file.
2.  Open the file in any modern web browser like Google Chrome, Firefox, or Safari.
3.  That's it! You can start adding items to the cart.

## 🔧 How to Customize

You can easily tailor this application to your needs by editing the `cashier_app.html` file.

### 1. Changing the Products

To change the list of available products, find the `products` array inside the `<script>` tag at the bottom of the file and modify it.

**Example:**

```javascript
const products = [
    // To add a new product:
    { id: 9, name: 'Donut', price: 12000 },

    // To edit an existing product:
    { id: 1, name: 'Kopi Hitam', price: 15000 },

    // To remove a product, simply delete its line.
    // { id: 2, name: 'Latte', price: 28000 }, // This is now removed
];
```

### 2. Changing the Currency

The currency format is handled by the `formatCurrency` function. You can change the locale (`'id-ID'`) and currency code (`'IDR'`) to match your region.

**Example (changing to US Dollars):**

```javascript
const formatCurrency = (number) => {
    return new Intl.NumberFormat('en-US', { // Change 'id-ID' to 'en-US'
        style: 'currency',
        currency: 'USD', // Change 'IDR' to 'USD'
        minimumFractionDigits: 2, // USD usually has 2 decimal places
        maximumFractionDigits: 2
    }).format(number);
};
```

## 📈 Future Improvements (Roadmap)

This application was built as a solid foundation. Here are some features that could be added next:

* **Quantity Controls:** Add `+` and `-` buttons next to each cart item to adjust the quantity or remove it.
* **Product Categories:** Group products into categories (e.g., "Hot Drinks", "Pastries") for better organization.
* **Search and Filter:** Implement a search bar to quickly find products.
* **Tax & Discounts:** Add functionality to apply taxes or promotional discounts to the total.
* **Local Storage:** Save the current order so it isn't lost if the page is accidentally refreshed.
* **Receipt Printing:** Generate a clean, printable receipt of the transaction.
* **File Separation:** Split the code into separate `.html`, `.css`, and `.js` files for better project management.

## 💻 Technologies Used

* **HTML5**
* **Vanilla JavaScript (ES6)**
* **Tailwind CSS** (via CDN for simplicity)

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).

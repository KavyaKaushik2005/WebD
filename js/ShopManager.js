class ShopManager {
  constructor() {
    this.container = document.getElementById("productContainer");
    this.cart = [];
    this.sidebar = document.getElementById("cartSidebar");
    this.openBtn = document.getElementById("openCart");
    this.closeBtn = document.getElementById("closeCart");
    this.cartItemsDiv = document.getElementById("cartItems");
    this.cartTotal = document.getElementById("cartTotal");

    this.loadCart();

    // Event listeners for cart open/close
    this.openBtn.onclick = () => this.showCart();
    this.closeBtn.onclick = () => this.hideCart();

    this.loadProducts();
  }

  /* ---------------- LOAD PRODUCTS (from JSON) ---------------- */
  async loadProducts() {
    try {
    const res = await fetch("data/products.json");
    if (!res.ok) throw new Error("Products not found");
    const products = await res.json();
    
    products.forEach(p => {
      const card = new ProductCard(p, this);
      this.container.appendChild(card.render());
    });
    
    this.updateViewCartLink();
  } catch (err) {
    this.container.innerHTML = `
      <p style="color:red; text-align:center; padding:20px;">
        Error: ${err.message}<br>
        Check: <code>data/products.json</code> exists
      </p>
    `;
    console.error(err);
  }
  
    const res = await fetch("data/products.json");
    const products = await res.json();
    this.renderProducts(products);
    this.setupSearch(products);  // Enable search after loading
    this.updateViewCartLink();
  }

  /* ---------------- SEARCH BAR FUNCTIONALITY ---------------- */
  setupSearch(products) {
    const searchInput = document.getElementById("searchInput");
    if (!searchInput) return;

    searchInput.addEventListener("input", () => {
      const query = searchInput.value.toLowerCase();
      const filtered = products.filter(p =>
        p.title.toLowerCase().includes(query) ||
        p.desc.toLowerCase().includes(query) ||
        p.impact.toLowerCase().includes(query)
      );
      this.renderProducts(filtered);
    });
  }

  /* ---------------- RENDER PRODUCTS TO PAGE ---------------- */
  renderProducts(productList) {
    this.container.innerHTML = "";
    productList.forEach(p => {
      const card = new ProductCard(p, this);
      this.container.appendChild(card.render());
    });
  }

  /* ---------------- ADD TO CART ---------------- */
  addToCart(product) {
    const existing = this.cart.find(i => i.product.id === product.id);
    if (existing) existing.qty++;
    else this.cart.push({ product, qty: 1 });

    this.saveCart();
    this.updateViewCartLink();
    this.showToast(`"${product.title}" added to cart!`);
    this.showCart(); // Auto open sidebar
  }

  /* ---------------- UPDATE QUANTITY ---------------- */
  updateQuantity(id, change) {
    const item = this.cart.find(i => i.product.id === id);
    if (item) {
      item.qty += change;
      if (item.qty <= 0) this.cart = this.cart.filter(i => i.product.id !== id);
      this.saveCart();
      this.renderCart();
      this.updateViewCartLink();
    }
  }

  /* ---------------- CLEAR ONE ITEM ---------------- */
  clearOne(id) {
    this.cart = this.cart.filter(i => i.product.id !== id);
    this.saveCart();
    this.renderCart();
    this.updateViewCartLink();
  }

  /* ---------------- CLEAR ALL CART ITEMS ---------------- */
  clearAll() {
    if (confirm("Remove all items from cart?")) {
      this.cart = [];
      this.saveCart();
      this.renderCart();
      this.updateViewCartLink();
    }
  }

  /* ---------------- SAVE / LOAD CART (LocalStorage) ---------------- */
  saveCart() {
    localStorage.setItem('cart', JSON.stringify(this.cart));
  }

  loadCart() {
    const data = localStorage.getItem('cart');
    if (data) this.cart = JSON.parse(data);
  }

  /* ---------------- UPDATE VIEW CART BUTTON ---------------- */
  updateViewCartLink() {
    const count = this.cart.reduce((sum, i) => sum + i.qty, 0);
    const countSpan = document.getElementById("cartCount");
    if (countSpan) countSpan.textContent = count;
    if (this.openBtn) this.openBtn.style.display = count > 0 ? 'block' : 'none';
  }

  /* ---------------- SHOW / HIDE CART SIDEBAR ---------------- */
  showCart() {
    this.renderCart();
    if (this.sidebar) this.sidebar.classList.add("active");
  }

  hideCart() {
    if (this.sidebar) this.sidebar.classList.remove("active");
  }

  /* ---------------- RENDER CART ITEMS ---------------- */
  renderCart() {
    this.cartItemsDiv.innerHTML = "";
    if (this.cart.length === 0) {
      this.cartItemsDiv.innerHTML = "<p style='text-align:center; color:#666; padding:20px;'>Your cart is empty</p>";
      this.cartTotal.textContent = "";
      return;
    }

    let total = 0;
    this.cart.forEach(item => {
      const price = item.product.price * item.qty;
      total += price;

      const cartItem = document.createElement("div");
      cartItem.className = "cart-item";
      cartItem.innerHTML = `
        <img src="${item.product.img}" alt="${item.product.title}">
        <div class="cart-details">
          <strong>${item.product.title}</strong>
          <small>${item.product.impact}</small>
        </div>
        <div class="qty-control">
          <button onclick="shopManager.updateQuantity(${item.product.id}, -1)">-</button>
          <span>${item.qty}</span>
          <button onclick="shopManager.updateQuantity(${item.product.id}, 1)">+</button>
        </div>
        <strong class="cart-price">₹${price}</strong>
        <button class="clear-one" onclick="shopManager.clearOne(${item.product.id})">Clear</button>
      `;
      this.cartItemsDiv.appendChild(cartItem);
    });

    this.cartTotal.textContent = `Total: ₹${total}`;

    // Add bottom action buttons if cart has items
    const actionDiv = document.createElement("div");
    actionDiv.className = "cart-actions";

    const proceedBtn = document.createElement("button");
    proceedBtn.className = "proceed-btn";
    proceedBtn.textContent = "Proceed to Pay";
    proceedBtn.onclick = () => alert("Proceeding to payment...");
    actionDiv.appendChild(proceedBtn);

    const clearAllBtn = document.createElement("button");
    clearAllBtn.className = "clear-all-btn";
    clearAllBtn.textContent = "Clear All Cart";
    clearAllBtn.onclick = () => this.clearAll();
    actionDiv.appendChild(clearAllBtn);

    this.cartItemsDiv.appendChild(actionDiv);
  }

  /* ---------------- TOAST MESSAGE ---------------- */
  showToast(message) {
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = message;
    document.body.appendChild(toast);

    requestAnimationFrame(() => toast.classList.add("show"));

    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => toast.remove(), 400);
    }, 2000);
  }
}

/* ---------------- INITIALIZE SHOP MANAGER ---------------- */
const shopManager = new ShopManager();

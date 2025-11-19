class ProductCard {
  constructor(product, manager) {
    this.product = product;
    this.manager = manager;
  }

  render() {
    const card = document.createElement("div");
    card.className = "product-card";
    card.dataset.category = "all";

    card.innerHTML = `
      <img src="${this.product.img}" alt="${this.product.title}">
      <h3>${this.product.title}</h3>
      <p>${this.product.desc}</p>
      <p class="impact">${this.product.impact}</p>
      <p class="price">₹${this.product.price}</p>
      <button class="btn add-cart">Add to Cart</button>
    `;

    card.querySelector(".add-cart").onclick = () => {
      this.manager.addToCart(this.product);
    };

    return card;
  }
}

//   render() {
//   const card = document.createElement("div");
//   card.className = "product-card";
//   card.dataset.category = "all"; // for future

//   card.innerHTML = `
//     <img src="${this.product.img}" alt="${this.product.title}">
//     <h3>${this.product.title}</h3>
//     <p>${this.product.desc}</p>
//     <p class="impact">${this.product.impact}</p>
    
//     <div class="price-and-btn">
//       <span class="price">₹${this.product.price}</span>
//       <button class="btn add-cart">Add to Cart</button>
//     </div>
//   `;

//   card.querySelector(".add-cart").onclick = () => {
//     this.manager.addToCart(this.product);
//   };

//   return card;
// }





// class ProductCard {
//   constructor(product, manager) {
//     this.product = product;
//     this.manager = manager;
//   }

//   render() {
//     const card = document.createElement("div");
//     card.className = "product-card";

//     card.innerHTML = `
//       <img src="${this.product.img}" alt="${this.product.title}">
//       <h3>${this.product.title}</h3>
//       <p>${this.product.desc}</p>
//       <p class="impact">${this.product.impact}</p>
//       <p class="price">₹${this.product.price}</p>
//       <button class="btn add-cart">Add to Cart</button>
//     `;

//     card.querySelector(".add-cart").onclick = () => {
//       this.manager.addToCart(this.product);
//     };

//     return card;
//   }
// }


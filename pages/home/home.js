class Cart {
  cart = [];

  getCart() {
    return this.cart;
  }

  getTotalItems() {
    return this.cart.length;
  }

  getTotalPrice() {
    return this.cart
      .map((item) => item.qty * item.price)
      .reduce((prev, curr) => prev + curr, 0);
  }

  setCart(cart) {
    this.cart = cart;
  }

  updateQty(id, newQty) {
    const product = this.cart.find((product) => product.id === id);
    product.qty = newQty;
    this.cart = this.cart.map((prod) => (prod.id === id ? product : prod));
    localStorage.setItem("cart", JSON.stringify(this.cart));
  }

  addToCart(productDetails) {
    const { id, qty } = productDetails;
    const cart = [...this.cart];
    let isProductHasSameId;

    cart.forEach((item) => {
      if (item.id === id) {
        item.qty += qty;
        isProductHasSameId = true;
      }
    });

    if (isProductHasSameId) return;

    cart.push(productDetails);

    this.cart = cart;
    localStorage.setItem("cart", JSON.stringify(this.cart));
  }

  deleteItem(id) {
    this.cart = this.cart.filter((product) => product.id !== id);
    localStorage.setItem("cart", JSON.stringify(this.cart));
  }
}

const cart = new Cart();

function updateCartLocalStorage() {
  if (!localStorage) return;
  const cartFromLocalStorage = JSON.parse(localStorage.getItem("cart"));

  if (cartFromLocalStorage && Array.isArray(cartFromLocalStorage))
    cart.setCart(cartFromLocalStorage);
}

updateCartLocalStorage();

function renderProductCards(productDetails) {
  const cart = `      
    <article class="c-card o-card">
      <div class="c-card__img-container">
        <img src=${productDetails.image} alt="${productDetails.name}" class="c-card__img" />
      </div>
      <div class="c-card__product-details o-product-details">
        <h2 class="c-card__product-name js-product-name">${productDetails.name}</h2>
        <strong class="c-card__price js-card-price">₹${productDetails.price}</strong>
        <label for="quantity" class="c-card__qty-label">Qty.</label>
        <input
          type="number"
          class="c-card__qty"
          name="product-quantity"
          id="quantity"
          value="1"
          min="1"
        />
        <button 
          class="c-card__add-to-card js-add-to-cart"
          data-id="${productDetails.id}"
        >
          Add to cart
        </button>
      </div>
    </article>`;

  $(".js-main").append(cart);
}

function renderCartModal(cartProducts, cb = () => {}) {
  $(".js-cart-modal-item").html("");

  cartProducts.forEach((productInCart) => {
    const cartModalProduct = `
    <article class="c-cart-modal__product">
      <button 
        class="c-cart-modal__delete-product js-cart-product-delete"
        data-id="${productInCart.id}"
      >×</button>
      <div class="c-cart-modal__img-container">
        <img
          src=${productInCart.image}
          alt=""
          class="c-cart-modal__img"
          width="80"
          height="65"
        />
      </div>
      <div
        class="
          c-cart-modal__product-info-container
          o-cart-modal-product-info
        "
      >
        <h2 class="c-cart-modal__product-name">${productInCart.name}</h2>
        <p class="c-cart-modal__product-price">₹${productInCart.price}</p>
        <label
          for="cart-product-qty"
          class="c-cart-modal__product-qty-label"
          >Qty.</label
        >
        <input
          type="number"
          class="c-cart-modal__product-qty js-cart-modal-qty-input"
          name="cart-product-quantity"
          id="cart-product-qty"
          value="${productInCart.qty}"
          min="1"
          data-id="${productInCart.id}"
        />
      </div>
    </article>`;

    $(".js-cart-modal-item").append(cartModalProduct);
    cb();
  });

  const cartModalPriceSection = `
    <div class="c-cart-modal__buy-btn-container o-buy-btn-container js-cart-bottom">
      <span class="c-cart-modal__total">
        Total Price: <strong class="js-cart-modal-total-price">₹${cart.getTotalPrice()}</strong>
      </span>
      <button class="c-cart-modal__buy-btn js-cart-buy-btn">Buy</button>
    </div>
  `;

  const modalCloseBtn = `
    <button 
      class="c-cart-modal__close js-cart-modal-close" 
      aria-label="close the cart product details modal"
    >
      ×
    </button>
  `;

  $(".js-cart-modal").prepend(modalCloseBtn);
  $(".js-cart-modal-buy-section").html(cartModalPriceSection);
}

function updateCartBadge() {
  if (cart.getTotalItems() > 0) {
    $(".js-cart-badge").text(cart.getTotalItems());
  } else {
    $(".js-cart-badge").text("");
  }
}

updateCartBadge();

// AJAX - render cards, etc.
$.get("home.json", function (data, response) {
  if (response !== "success") return;

  data.forEach((product) => {
    renderProductCards({
      name: product.product_name,
      id: product.id,
      image: product.image_url,
      price: product.price_in_rupees,
    });
  });

  $(".js-add-to-cart").on("click", function () {
    const quantity = parseFloat($(this).prev().val());
    const id = parseFloat($(this).attr("data-id"));
    const clickedCardProductDetails = data.filter(
      (product) => product.id === id
    );

    if (clickedCardProductDetails.length <= 0) return;

    cart.addToCart({
      id: clickedCardProductDetails[0].id,
      name: clickedCardProductDetails[0].product_name,
      qty: quantity,
      price: clickedCardProductDetails[0].price_in_rupees,
      image: clickedCardProductDetails[0].image_url,
    });

    updateCartBadge();
  });
});

// cart modal toggle
$(".js-cart-modal").hide();
$(".js-cart-overlay").hide();

function showMsgWhenCartIsEmpty() {
  if (cart.getCart().length <= 0) {
    $(".js-cart-modal-item").html("<p class='c-cart__empty'> Cart is empty </p>");
    $(".js-cart-bottom").html("");
  }
}

function onModalQtyInputChange() {
  if (parseFloat($(this).val()) <= 0 || !$(this).val()) $(this).val(1);

  const id = parseFloat($(this).attr("data-id"));
  const newQty = parseFloat($(this).val());

  if (newQty <= 0) return;

  cart.updateQty(id, newQty);

  $(".js-cart-modal-total-price").text("₹" + cart.getTotalPrice());
}

function buy() {
  $(".js-cart-buy-btn").on("click", function () {
    if (cart.getTotalPrice() <= 0) return;

    $(".js-cart-modal").fadeOut();
    $(".js-cart-overlay").fadeOut();

    $(".js-form").fadeIn();
    $(".js-form-overlay").fadeIn();
    $(".js-form-price").text(`₹${cart.getTotalPrice()}`);
  });
}

function deleteProductFromCart() {
  $(".js-cart-product-delete").on("click", function () {
    const id = parseFloat($(this).attr("data-id"));
    cart.deleteItem(id);

    renderCartModal(cart.getCart(), () => {
      deleteProductFromCart();
      buy();
    });

    updateCartBadge();
    showMsgWhenCartIsEmpty();
    buy();
  });
}

$(".js-cart").on("click", function () {
  $(".js-cart-modal").fadeToggle();
  $(".js-cart-overlay").fadeToggle();

  renderCartModal(cart.getCart());
  showMsgWhenCartIsEmpty();

  $(".js-cart-modal-qty-input").on("change", onModalQtyInputChange);
  $(".js-cart-modal-qty-input").on("blur", onModalQtyInputChange);

  // close modal
  $(".js-cart-modal-close").on("click", function () {
    $(".js-cart-overlay").fadeOut();
    $(".js-cart-modal").fadeOut();
  });

  deleteProductFromCart();
  buy();
});

$(".js-cart-overlay").on("click", function () {
  $(this).fadeOut();
  $(".js-cart-modal").fadeOut();
});

// hide form initially
$(".js-form").hide();
$(".js-form-overlay").hide();

$(".js-form-overlay").on("click", function () {
  $(".js-form").fadeOut();
  $(".js-form-overlay").fadeOut();
});

$(".js-form-close-btn").on("click", function () {
  $(".js-form").fadeOut();
  $(".js-form-overlay").fadeOut();
});

$(".js-form input").on("keypress", function (e) {
  if (e.key === "Enter") e.preventDefault(); // bugfix. Form auto-closing when pressed enter
});

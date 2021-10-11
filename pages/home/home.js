class Cart {
  cart = [];

  getCart() {
    return this.cart;
  }

  getTotalItems() {
    return this.cart.length;
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
  }
}

const cart = new Cart();

function renderProductCards(productDetails) {
  const cart = `      
    <article class="c-card o-card">
      <div class="c-card__img-container">
        <img src=${productDetails.image} alt="${productDetails.name}" class="c-card__img" />
      </div>
      <div class="c-card__product-details o-product-details">
        <h2 class="c-card__product-name js-product-name">${productDetails.name}</h2>
        <label for="quantity" class="c-card__qty-label">Qty.</label>
        <input
          type="number"
          class="c-card__qty"
          name="product-quantity"
          id="quantity"
          value="1"
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

// AJAX - render cards
$.get("home.json", function (data, response) {
  if (response !== "success") return;
  data.forEach((product) =>
    renderProductCards({
      name: product.product_name,
      id: product.id,
      image: product.image_url,
    })
  );
});

$(".js-add-to-cart").on("click", function () {
  const quantity = parseFloat($(this).prev().val());
  const name = $(this).prevAll(".js-product-name").text();
  const id = parseFloat($(this).attr("data-id"));

  if (quantity <= 0) return;

  cart.addToCart({
    id: id,
    name: name,
    qty: quantity,
  });

  const totalProductsInTheCart = cart.getTotalItems();

  if (totalProductsInTheCart > 0) {
    $(".js-cart-badge").text(cart.getTotalItems());
  } else {
    $(".js-cart-badge").text("");
  }
});

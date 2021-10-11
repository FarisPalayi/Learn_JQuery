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

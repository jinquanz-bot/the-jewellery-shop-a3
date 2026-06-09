/* =========================
   Cart page
   Shows cart items and order summary
   ========================= */

function showCartPage() {
  var cartItemsBox = document.getElementById("cart-items");

  if (cartItemsBox === null) {
    return;
  }

  renderCart();

  var clearButton = document.getElementById("clear-cart-btn");
  var clearLink = document.getElementById("clear-cart-link");

  if (clearButton !== null) {
    clearButton.onclick = function () {
      clearCart();
    };
  }

  if (clearLink !== null) {
    clearLink.onclick = function () {
      clearCart();
    };
  }

  var checkoutButton = document.getElementById("checkout-btn");

  if (checkoutButton !== null) {
    checkoutButton.onclick = function () {
      var cart = getCart();

      if (cart.length === 0) {
        alert("Your cart is empty.");
      } else {
        window.location.href = "checkout.html";
      }
    };
  }
}

function clearCart() {
  localStorage.removeItem("jewelryCart");
  renderCart();
  updateBagCount();
}

function renderCart() {
  var cart = getCart();

  var cartItemsBox = document.getElementById("cart-items");
  var subtotalBox = document.getElementById("cart-subtotal");
  var gstBox = document.getElementById("cart-gst");
  var totalBox = document.getElementById("cart-total");
  var selectedCountBox = document.getElementById("cart-selected-count");

  cartItemsBox.innerHTML = "";

  if (selectedCountBox !== null) {
    selectedCountBox.innerText = cart.length + " Item Selected";
  }

  if (cart.length === 0) {
    cartItemsBox.innerHTML = "<p class='empty-cart-message'>Your cart is currently empty.</p>";
    subtotalBox.innerText = "$0.00";
    gstBox.innerText = "$0.00";
    totalBox.innerText = "$0.00";
    return;
  }

  var subtotal = 0;

  for (var i = 0; i < cart.length; i++) {
    var item = cart[i];
    var itemTotal = item.price * item.quantity;
    subtotal = subtotal + itemTotal;

    var image = item.image;

    if (image === undefined || image === null || image === "") {
      image = "images/product-main.jpg";
    }

    cartItemsBox.innerHTML =
      cartItemsBox.innerHTML +
      "<div class='cart-card'>" +
        "<div class='cart-card-image-box'>" +
          "<img class='cart-card-image' src='" + image + "' alt='" + item.name + "' />" +
        "</div>" +

        "<div class='cart-card-content'>" +
          "<h3>" + item.name + "</h3>" +
          "<p class='cart-card-price'>$" + item.price.toFixed(2) + "</p>" +
          "<p class='cart-card-meta'>Color: Silver</p>" +

          "<div class='cart-card-qty-row'>" +
            "<span>Qty:</span>" +
            "<div class='cart-qty-control'>" +
              "<button onclick='decreaseQuantity(" + i + ")'>−</button>" +
              "<span>" + item.quantity + "</span>" +
              "<button onclick='increaseQuantity(" + i + ")'>+</button>" +
            "</div>" +
          "</div>" +

          "<div class='cart-card-note'>" +
            "<span>⛃</span>" +
            "<span>15 Days return available</span>" +
          "</div>" +

          "<div class='cart-card-note'>" +
            "<span>▧</span>" +
            "<span>Delivered by <strong>Apr 19, 2026</strong></span>" +
          "</div>" +

          "<button class='remove-item-btn' onclick='removeItem(" + i + ")'>Remove</button>" +
        "</div>" +

        "<button class='cart-card-remove' onclick='removeItem(" + i + ")'>×</button>" +
      "</div>";
  }

  var gst = subtotal * 0.1;
  var total = subtotal + gst;

  subtotalBox.innerText = "$" + subtotal.toFixed(2);
  gstBox.innerText = "$" + gst.toFixed(2);
  totalBox.innerText = "$" + total.toFixed(2);
}

function increaseQuantity(index) {
  var cart = getCart();

  cart[index].quantity = cart[index].quantity + 1;

  saveCart(cart);
  renderCart();
  updateBagCount();
}

function decreaseQuantity(index) {
  var cart = getCart();

  if (cart[index].quantity > 1) {
    cart[index].quantity = cart[index].quantity - 1;
  } else {
    cart.splice(index, 1);
  }

  saveCart(cart);
  renderCart();
  updateBagCount();
}

function removeItem(index) {
  var cart = getCart();

  cart.splice(index, 1);

  saveCart(cart);
  renderCart();
  updateBagCount();
}
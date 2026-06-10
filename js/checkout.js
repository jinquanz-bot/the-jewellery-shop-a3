/* =========================
   Checkout page
   Review order and confirmation modal
   ========================= */

function showCheckoutPage() {
  var reviewItemsBox = document.getElementById("review-items");

  if (reviewItemsBox === null) {
    return;
  }

  renderCheckoutItems();

  var placeOrderButton = document.getElementById("place-order-btn");

  if (placeOrderButton !== null) {
    placeOrderButton.onclick = function () {
      var cart = getCart();

      if (cart.length === 0) {
        alert("Your cart is empty.");
        return;
      }

      showConfirmation();
    };
  }

  var closeButton = document.getElementById("close-confirmation");

  if (closeButton !== null) {
    closeButton.onclick = function () {
      hideConfirmation();
      window.location.href = "index.html";
    };
  }
}

function renderCheckoutItems() {
  var cart = getCart();

  var reviewItemsBox = document.getElementById("review-items");
  var subtotalBox = document.getElementById("review-subtotal");
  var gstBox = document.getElementById("review-gst");
  var totalBox = document.getElementById("review-total");

  reviewItemsBox.innerHTML = "";

  if (cart.length === 0) {
    reviewItemsBox.innerHTML = "<p class='empty-review-message'>No products have been added.</p>";
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

    reviewItemsBox.innerHTML =
      reviewItemsBox.innerHTML +
      "<div class='prototype-review-item'>" +
        "<div class='prototype-review-image-box'>" +
          "<img class='prototype-review-image' src='" + image + "' alt='" + item.name + "' />" +
        "</div>" +

        "<div class='prototype-review-content'>" +
          "<h3>" + item.name + "</h3>" +
          "<p class='prototype-review-price'>$" + item.price.toFixed(2) + "</p>" +

          "<div class='prototype-review-qty'>" +
            "<span>QTY:</span>" +
            "<button type='button' onclick='decreaseCheckoutQuantity(" + i + ")'>−</button>" +
            "<span>" + item.quantity + "</span>" +
            "<button type='button' onclick='increaseCheckoutQuantity(" + i + ")'>+</button>" +
          "</div>" +
        "</div>" +

        "<button type='button' class='prototype-review-remove' onclick='removeCheckoutItem(" + i + ")'>×</button>" +
      "</div>";
  }

  var gst = subtotal * 0.1;
  var total = subtotal + gst;

  subtotalBox.innerText = "$" + subtotal.toFixed(2);
  gstBox.innerText = "$" + gst.toFixed(2);
  totalBox.innerText = "$" + total.toFixed(2);
}

function increaseCheckoutQuantity(index) {
  var cart = getCart();

  cart[index].quantity = cart[index].quantity + 1;

  saveCart(cart);
  renderCheckoutItems();
  updateBagCount();
}

function decreaseCheckoutQuantity(index) {
  var cart = getCart();

  if (cart[index].quantity > 1) {
    cart[index].quantity = cart[index].quantity - 1;
  } else {
    cart.splice(index, 1);
  }

  saveCart(cart);
  renderCheckoutItems();
  updateBagCount();
}

function removeCheckoutItem(index) {
  var cart = getCart();

  cart.splice(index, 1);

  saveCart(cart);
  renderCheckoutItems();
  updateBagCount();
}

function showConfirmation() {
  var modal = document.getElementById("confirmation-modal");

  if (modal !== null) {
    modal.classList.add("show");
  }

  localStorage.removeItem("jewelryCart");
  updateBagCount();
}

function hideConfirmation() {
  var modal = document.getElementById("confirmation-modal");

  if (modal !== null) {
    modal.classList.remove("show");
  }
}
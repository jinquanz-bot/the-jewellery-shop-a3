/* =========================
   Checkout page
   Shows order review and confirmation modal
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
      var form = document.getElementById("checkout-form");
      var cart = getCart();

      if (cart.length === 0) {
        alert("Your cart is empty.");
        return;
      }

      if (form.checkValidity() === false) {
        form.reportValidity();
        return;
      }

      showConfirmation();
    };
  }

  var closeButton = document.getElementById("close-confirmation");

  if (closeButton !== null) {
    closeButton.onclick = function () {
      hideConfirmation();
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
      "<div class='review-item'>" +
        "<div class='review-image-box'>" +
          "<img class='review-item-image' src='" + image + "' alt='" + item.name + "' />" +
        "</div>" +

        "<div>" +
          "<h3>" + item.name + "</h3>" +
          "<p>Quantity: " + item.quantity + "</p>" +
        "</div>" +

        "<strong class='review-item-price'>$" + itemTotal.toFixed(2) + "</strong>" +
      "</div>";
  }

  var gst = subtotal * 0.1;
  var total = subtotal + gst;

  subtotalBox.innerText = "$" + subtotal.toFixed(2);
  gstBox.innerText = "$" + gst.toFixed(2);
  totalBox.innerText = "$" + total.toFixed(2);
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
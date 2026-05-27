


window.onload = function () {
  updateBagCount();
  setupAddToCartButtons();
  showCartPage();
  showCheckoutPage();
};


/* =========================
   1. Cart storage
   ========================= */

function getCart() {
  var cartText = localStorage.getItem("jewelryCart");

  if (cartText === null) {
    return [];
  }

  return JSON.parse(cartText);
}

function saveCart(cart) {
  localStorage.setItem("jewelryCart", JSON.stringify(cart));
}


/* =========================
   2. Add to cart
   ========================= */

function setupAddToCartButtons() {
  var buttons = document.querySelectorAll(".add-cart-btn, .add-cart-btn-large");

  for (var i = 0; i < buttons.length; i++) {
    buttons[i].onclick = function () {
      var name = this.getAttribute("data-name");
      var price = this.getAttribute("data-price");
      var image = this.getAttribute("data-image");

      if (name === null) {
        name = "Brown Solid Leather Charm Bracelet";
      }

      if (price === null) {
        price = 15;
      }

      if (image === null) {
        image = "images/product-main.jpg";
      }

      addToCart(name, Number(price), image);
      alert(name + " has been added to your cart.");
    };
  }
}

function addToCart(name, price, image) {
  var cart = getCart();
  var found = false;

  for (var i = 0; i < cart.length; i++) {
    if (cart[i].name === name) {
      cart[i].quantity = cart[i].quantity + 1;
      found = true;
    }
  }

  if (found === false) {
    cart.push({
      name: name,
      price: price,
      image: image,
      quantity: 1
    });
  }

  saveCart(cart);
  updateBagCount();
}


/* =========================
   3. Bag count
   ========================= */

function updateBagCount() {
  var cart = getCart();
  var totalQuantity = 0;

  for (var i = 0; i < cart.length; i++) {
    totalQuantity = totalQuantity + cart[i].quantity;
  }

  var bagLinks = document.querySelectorAll('a[href="cart.html"]');

  for (var j = 0; j < bagLinks.length; j++) {
    if (bagLinks[j].innerText.indexOf("Bag") !== -1) {
      bagLinks[j].innerText = "Bag (" + totalQuantity + ")";
    }
  }
}


/* =========================
   4. Cart page
   ========================= */

function showCartPage() {
  var cartItemsBox = document.getElementById("cart-items");

  if (cartItemsBox === null) {
    return;
  }

  renderCart();

  var clearButton = document.getElementById("clear-cart-btn");

  if (clearButton !== null) {
    clearButton.onclick = function () {
      localStorage.removeItem("jewelryCart");
      renderCart();
      updateBagCount();
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

function renderCart() {
  var cart = getCart();

  var cartItemsBox = document.getElementById("cart-items");
  var subtotalBox = document.getElementById("cart-subtotal");
  var gstBox = document.getElementById("cart-gst");
  var totalBox = document.getElementById("cart-total");

  cartItemsBox.innerHTML = "";

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
      "<div class='cart-item'>" +
        "<div class='cart-product-info'>" +
          "<img class='cart-product-image' src='" + image + "' alt='" + item.name + "' />" +
          "<div>" +
            "<h3>" + item.name + "</h3>" +
            "<button class='remove-item-btn' onclick='removeItem(" + i + ")'>Remove</button>" +
          "</div>" +
        "</div>" +

        "<div class='cart-price'>$" + item.price.toFixed(2) + "</div>" +

        "<div class='cart-qty-control'>" +
          "<button onclick='decreaseQuantity(" + i + ")'>−</button>" +
          "<span>" + item.quantity + "</span>" +
          "<button onclick='increaseQuantity(" + i + ")'>+</button>" +
        "</div>" +

        "<div class='cart-subtotal'>$" + itemTotal.toFixed(2) + "</div>" +
      "</div>";
  }

  var gst = subtotal * 0.1;
  var total = subtotal + gst;

  subtotalBox.innerText = "$" + subtotal.toFixed(2);
  gstBox.innerText = "$" + gst.toFixed(2);
  totalBox.innerText = "$" + total.toFixed(2);
}


/* =========================
   5. Cart item buttons
   ========================= */

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


/* =========================
   6. Checkout page
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
        "<img class='review-item-image' src='" + image + "' alt='" + item.name + "' />" +
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


/* =========================
   7. Confirmation modal
   ========================= */

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
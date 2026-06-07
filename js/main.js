/* =========================
   Simple JavaScript for Project 3
   ========================= */

window.onload = function () {
  updateBagCount();
  setupHomepageCarousel();
  setupProductPage();
  setupProductQuantity();
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
   2. Homepage carousel
   ========================= */

function setupHomepageCarousel() {
  var track = document.getElementById("popular-products-track");
  var prevButton = document.getElementById("popular-prev-btn");
  var nextButton = document.getElementById("popular-next-btn");

  if (track === null || prevButton === null || nextButton === null) {
    return;
  }

  nextButton.onclick = function () {
    track.scrollBy({
      left: track.clientWidth,
      behavior: "smooth"
    });
  };

  prevButton.onclick = function () {
    track.scrollBy({
      left: -track.clientWidth,
      behavior: "smooth"
    });
  };
}


/* =========================
   3. Product detail page
   ========================= */

function setupProductPage() {
  var productTitle = document.getElementById("product-title");

  if (productTitle === null) {
    return;
  }

  var params = new URLSearchParams(window.location.search);

  var name = params.get("name");
  var price = params.get("price");
  var image = params.get("image");

  if (name === null || price === null || image === null) {
    return;
  }

  var productImage = document.getElementById("product-main-image");
  var productPrice = document.getElementById("product-price");
  var addButton = document.getElementById("product-add-btn");

  productTitle.innerText = name;
  productPrice.innerText = "$" + Number(price).toFixed(2);

  productImage.src = image;
  productImage.alt = name;

  addButton.setAttribute("data-name", name);
  addButton.setAttribute("data-price", price);
  addButton.setAttribute("data-image", image);
}


/* =========================
   4. Product quantity buttons
   ========================= */

function setupProductQuantity() {
  var minusButton = document.getElementById("qty-minus-btn");
  var plusButton = document.getElementById("qty-plus-btn");
  var quantityBox = document.getElementById("product-quantity");

  if (minusButton === null || plusButton === null || quantityBox === null) {
    return;
  }

  minusButton.onclick = function () {
    var quantity = Number(quantityBox.innerText);

    if (quantity > 1) {
      quantity = quantity - 1;
    }

    quantityBox.innerText = quantity;
  };

  plusButton.onclick = function () {
    var quantity = Number(quantityBox.innerText);

    quantity = quantity + 1;

    quantityBox.innerText = quantity;
  };

  var buyNowButton = document.getElementById("buy-now-btn");

  if (buyNowButton !== null) {
    buyNowButton.onclick = function () {
      var addButton = document.getElementById("product-add-btn");

      var name = addButton.getAttribute("data-name");
      var price = addButton.getAttribute("data-price");
      var image = addButton.getAttribute("data-image");
      var quantity = Number(quantityBox.innerText);

      addToCart(name, Number(price), image, quantity);

      window.location.href = "checkout.html";
    };
  }
}


/* =========================
   5. Add to cart
   ========================= */

function setupAddToCartButtons() {
  var buttons = document.querySelectorAll(".add-cart-btn, .add-cart-btn-large");

  for (var i = 0; i < buttons.length; i++) {
    buttons[i].onclick = function () {
      var name = this.getAttribute("data-name");
      var price = this.getAttribute("data-price");
      var image = this.getAttribute("data-image");
      var quantity = 1;

      var quantityBox = document.getElementById("product-quantity");

      if (this.classList.contains("add-cart-btn-large") && quantityBox !== null) {
        quantity = Number(quantityBox.innerText);
      }

      if (name === null) {
        name = "Brown Solid Leather Charm Bracelet";
      }

      if (price === null) {
        price = 15;
      }

      if (image === null) {
        image = "images/product-main.jpg";
      }

      addToCart(name, Number(price), image, quantity);
      alert(quantity + " x " + name + " has been added to your cart.");
    };
  }
}

function addToCart(name, price, image, quantity) {
  var cart = getCart();
  var found = false;

  if (quantity === undefined || quantity === null || quantity < 1) {
    quantity = 1;
  }

  for (var i = 0; i < cart.length; i++) {
    if (cart[i].name === name) {
      cart[i].quantity = cart[i].quantity + quantity;
      found = true;
    }
  }

  if (found === false) {
    cart.push({
      name: name,
      price: price,
      image: image,
      quantity: quantity
    });
  }

  saveCart(cart);
  updateBagCount();
}


/* =========================
   6. Bag count
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
   7. Cart page
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
          "<div class='cart-image-box'>" +
            "<img class='cart-product-image' src='" + image + "' alt='" + item.name + "' />" +
          "</div>" +
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
   8. Cart item buttons
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
   9. Checkout page
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


/* =========================
   10. Confirmation modal
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
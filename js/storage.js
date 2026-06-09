/* =========================
   Cart storage functions
   Save and load cart data
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
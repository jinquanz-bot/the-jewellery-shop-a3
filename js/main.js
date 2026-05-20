document.addEventListener("DOMContentLoaded", function () {
  updateBagCount();
  setupAddToCartButtons();
  setupCartPage();
});

function getCart() {
  const savedCart = localStorage.getItem("jewelryCart");

  if (!savedCart) {
    return [];
  }

  return JSON.parse(savedCart);
}

function saveCart(cart) {
  localStorage.setItem("jewelryCart", JSON.stringify(cart));
  updateBagCount();
}

function updateBagCount() {
  const cart = getCart();
  const totalQuantity = cart.reduce(function (total, item) {
    return total + item.quantity;
  }, 0);

  const bagLinks = document.querySelectorAll('a[href="cart.html"]');

  bagLinks.forEach(function (link) {
    if (link.textContent.includes("Bag")) {
      link.textContent = "Bag (" + totalQuantity + ")";
    }
  });
}

function setupAddToCartButtons() {
  const buttons = document.querySelectorAll(".add-cart-btn, .add-cart-btn-large");

  buttons.forEach(function (button) {
    button.addEventListener("click", function () {
      const productName = button.dataset.name || "Brown Solid Leather Charm Bracelet";
      const productPrice = Number(button.dataset.price) || 15;

      addProductToCart(productName, productPrice);
      alert(productName + " has been added to your cart.");
    });
  });
}

function addProductToCart(name, price) {
  const cart = getCart();

  const existingItem = cart.find(function (item) {
    return item.name === name;
  });

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      name: name,
      price: price,
      quantity: 1
    });
  }

  saveCart(cart);
}

function setupCartPage() {
  const cartContainer = document.querySelector("#cart-items");

  if (!cartContainer) {
    return;
  }

  renderCart();

  const clearCartButton = document.querySelector("#clear-cart-btn");

  if (clearCartButton) {
    clearCartButton.addEventListener("click", function () {
      localStorage.removeItem("jewelryCart");
      renderCart();
      updateBagCount();
    });
  }

  const checkoutButton = document.querySelector("#checkout-btn");

  if (checkoutButton) {
    checkoutButton.addEventListener("click", function () {
      const cart = getCart();

      if (cart.length === 0) {
        alert("Your cart is empty. Please add at least one item before checkout.");
        return;
      }

      window.location.href = "review.html";
    });
  }
}

function renderCart() {
  const cartContainer = document.querySelector("#cart-items");
  const subtotalElement = document.querySelector("#cart-subtotal");
  const gstElement = document.querySelector("#cart-gst");
  const totalElement = document.querySelector("#cart-total");

  const cart = getCart();

  cartContainer.innerHTML = "";

  if (cart.length === 0) {
    cartContainer.innerHTML = '<p class="empty-cart-message">Your cart is currently empty.</p>';

    subtotalElement.textContent = "$0.00";
    gstElement.textContent = "$0.00";
    totalElement.textContent = "$0.00";

    return;
  }

  let subtotal = 0;

  cart.forEach(function (item, index) {
    const itemSubtotal = item.price * item.quantity;
    subtotal += itemSubtotal;

    const itemElement = document.createElement("article");
    itemElement.className = "cart-item";

    itemElement.innerHTML =
      '<div class="cart-product-info">' +
        '<div class="cart-product-image"></div>' +
        '<div>' +
          '<h3>' + item.name + '</h3>' +
          '<button type="button" class="remove-item-btn" data-index="' + index + '">Remove</button>' +
        '</div>' +
      '</div>' +

      '<div class="cart-price">$' + item.price.toFixed(2) + '</div>' +

      '<div class="cart-qty-control">' +
        '<button type="button" class="decrease-btn" data-index="' + index + '">−</button>' +
        '<span>' + item.quantity + '</span>' +
        '<button type="button" class="increase-btn" data-index="' + index + '">+</button>' +
      '</div>' +

      '<div class="cart-subtotal">$' + itemSubtotal.toFixed(2) + '</div>';

    cartContainer.appendChild(itemElement);
  });

  const gst = subtotal * 0.1;
  const total = subtotal + gst;

  subtotalElement.textContent = "$" + subtotal.toFixed(2);
  gstElement.textContent = "$" + gst.toFixed(2);
  totalElement.textContent = "$" + total.toFixed(2);

  setupCartItemButtons();
}

function setupCartItemButtons() {
  const increaseButtons = document.querySelectorAll(".increase-btn");
  const decreaseButtons = document.querySelectorAll(".decrease-btn");
  const removeButtons = document.querySelectorAll(".remove-item-btn");

  increaseButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      const index = Number(button.dataset.index);
      const cart = getCart();

      cart[index].quantity += 1;

      saveCart(cart);
      renderCart();
    });
  });

  decreaseButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      const index = Number(button.dataset.index);
      const cart = getCart();

      if (cart[index].quantity > 1) {
        cart[index].quantity -= 1;
      } else {
        cart.splice(index, 1);
      }

      saveCart(cart);
      renderCart();
    });
  });

  removeButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      const index = Number(button.dataset.index);
      const cart = getCart();

      cart.splice(index, 1);

      saveCart(cart);
      renderCart();
    });
  });
}
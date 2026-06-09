/* =========================
   Product detail page
   Product image, title, price, description and quantity
   ========================= */

function setupProductPage() {
  var productTitle = document.getElementById("product-title");
  var productImage = document.getElementById("product-main-image");
  var productPrice = document.getElementById("product-price");
  var productDescription = document.getElementById("product-description");
  var addButton = document.getElementById("product-add-btn");

  if (productTitle === null || productImage === null || productPrice === null || addButton === null) {
    return;
  }

  var params = new URLSearchParams(window.location.search);

  var name = params.get("name");
  var price = params.get("price");
  var image = params.get("image");

  if (name === null || price === null || image === null) {
    name = productTitle.innerText;
    setProductImageStyle(name, productImage);

    if (productDescription !== null) {
      productDescription.innerText = getProductDescription(name);
    }

    return;
  }

  productTitle.innerText = name;
  productPrice.innerText = "$" + Number(price).toFixed(2);

  productImage.src = image;
  productImage.alt = name;

  setProductImageStyle(name, productImage);

  if (productDescription !== null) {
    productDescription.innerText = getProductDescription(name);
  }

  addButton.setAttribute("data-name", name);
  addButton.setAttribute("data-price", price);
  addButton.setAttribute("data-image", image);
}

function setProductImageStyle(name, productImage) {
  productImage.classList.remove("product-image-horizontal");
  productImage.classList.remove("product-image-bracelet");
  productImage.classList.remove("product-image-pendant");

  if (name.indexOf("Anklet") !== -1 || name.indexOf("Figaro") !== -1) {
    productImage.classList.add("product-image-horizontal");
  } else if (name.indexOf("Bracelet") !== -1) {
    productImage.classList.add("product-image-bracelet");
  } else {
    productImage.classList.add("product-image-pendant");
  }
}

function getProductDescription(name) {
  if (name === "Belcher Chain Anklet 3mm") {
    return "This 3mm Belcher chain anklet has a clean silver finish and a slightly bolder chain shape. It is designed for everyday wear and works well as a simple statement piece.";
  }

  if (name === "Belcher Chain Anklet 2mm") {
    return "This 2mm Belcher chain anklet is lightweight and delicate, making it easy to wear daily. Its thinner chain gives a softer and more minimal look.";
  }

  if (name === "Brown Solid Leather Charm Bracelet") {
    return "This brown solid leather charm bracelet combines a warm leather strap with silver hardware. It is simple, casual, and suitable for everyday styling.";
  }

  if (name === "Black Solid Leather Charm Bracelet") {
    return "This black solid leather charm bracelet has a clean and modern style. The darker leather gives it a stronger look while still keeping the design minimal.";
  }

  if (name === "Brown Woven Leather Charm Bracelet") {
    return "This brown woven leather charm bracelet has a textured finish that feels more handcrafted. It is comfortable to wear and adds a casual detail to daily outfits.";
  }

  if (name === "Figaro Diamond Cut Bracelet 3+1 Link") {
    return "This Figaro diamond cut bracelet features a 3+1 link pattern with a polished silver finish. It is suitable for customers who want a classic bracelet with more shine.";
  }

  if (name === "Figaro Becher ID Heart Bracelet") {
    return "This Figaro Becher ID heart bracelet has a simple silver ID plate and heart detail. It is a classic gift-style bracelet with a clean everyday look.";
  }

  if (name === "Symbol Pendant") {
    return "The Symbol Pendant uses a bold shape with dark blue detailing. It is designed as an eye-catching pendant for customers who want a more expressive jewellery piece.";
  }

  if (name === "Orca Killer Whale Pendant") {
    return "The Orca Killer Whale Pendant has a smooth silver form inspired by ocean life. It is a meaningful piece for customers who like animal-inspired jewellery.";
  }

  if (name === "Moto Spear Pendant") {
    return "The Moto Spear Pendant has a slim spear-like shape with dark detailing. Its vertical design gives it a sharp and elegant look.";
  }

  if (name === "Serenity Pendant") {
    return "The Serenity Pendant uses a soft silver shape with red decorative details. It is designed to feel graceful, calm, and visually distinctive.";
  }

  return "This jewellery item is designed for simple everyday styling. It is lightweight, easy to wear, and suitable for gifting or daily use.";
}

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
// Shopping cart model

var cart = {
    "items": [

    ],
    "cart-total": 0,
    "promos": {
    	"10ITEM": 0.9,
    	"15MACPRO": 0.85,
    	"5TOTAL": 0.95
    }  
};

// Toggle show/hide cart w/ button

var shoppingCart = document.getElementById("shopping-cart");
var toggleButton = document.getElementById("toggle");

function showHide (element) {
	if (element.classList.contains("hide")) {
		toggleButton.textContent = "Hide Shopping Cart";
	} else {
		toggleButton.textContent = "Show Shopping Cart";
	}
	element.classList.toggle("hide");
	element.focus();
}

// Add, remove items

// Global variables
var itemsInShoppingCart = document.getElementById("shopping-items");
var subTotal = document.getElementById("subtotal");

// Add item to cart

function addItem(id) {
   	
    // Look up product details
   	var product = document.getElementById(id);
  	var productName = product.querySelector(".product-name").innerHTML;
  	var productDescription = product.querySelector(".product-description").innerHTML;
  	var shortProductDescription = productDescription.substr(0, productDescription.indexOf("."));
  	var productPrice = parseFloat(product.querySelector(".price").innerHTML.replace(/[^\d|\.]/g, ""));
  	var productQuantity = parseInt(product.querySelector(".product-quantity").value) || 1;
  	var inputFieldId = cart.items.length;
	var indexInCartObject = utilities.find(cart.items, id);
	var inputField;

	// If item is the first in the shopping cart, push it on the cart.items array
	if (inputFieldId === 0 || indexInCartObject === -1) {
	    cart.items.push({
	      "id": id,
	      "name": productName,
	      "price": productPrice,
	      "count": productQuantity,
	      "short-product-description": shortProductDescription,
	      "input-id": inputFieldId
	    });
	
		// Show shopping cart and toggle button once there's at least one item in the cart
	    shoppingCart.classList.remove("hide");
	    toggleButton.classList.remove("hide");

	} 
	// If item is already in cart.items, only update the count property
	else {
		      cart.items[indexInCartObject].count += productQuantity;
	}
	
	// Regenerate shopping cart HTML and subtotal
	calculateSubtotal();
    generateShoppingCartHTML();

}

// Activate removeItem() function if user click Remove button
itemsInShoppingCart.addEventListener("click", function(el) {
	if(el.target.classList.contains("remove")) {
		removeItem(el.target);
	}
}, false);

// Remove item from shopping cart

function removeItem (button) {

	// Get product name
	var product = button.parentNode.parentNode.parentNode;
	var productName = product.querySelector(".product-description").firstElementChild.innerHTML;
	
	// Search item index in cart.items array based on product name found above
	var indexInCartObject = utilities.findByProductName(cart.items, productName);
	
	// Delete this item from cart.items array
	cart.items.splice(indexInCartObject, 1);

	// Regenerate shopping cart HTML and subtotal
	calculateSubtotal();
    generateShoppingCartHTML();

}

// Trigger changeQuantity() function when the Change Quantity button is clicked

itemsInShoppingCart.addEventListener("click", function(el) {
	if(el.target.classList.contains("change-quantity")) {
		changeQuantity(el.target);
	}
});

// Change quantity, if quantity of input field is 0, remove item from

function changeQuantity (button) {
	// Get remove button node to pass it as a reference to the removeItem function later if quantity is set to 0 
	var removeButton = button.nextElementSibling;
	// Get new product quantity
	var newInputQuantity = Number(button.previousSibling.value);
	// Product name to look up index of product in cart.items
	var productName = button.parentElement.parentElement.previousSibling.querySelector("h4").innerHTML;
	// Get index of product in cart.items
	var	indexInCartObject = utilities.findByProductName(cart.items, productName);
		
 	cart.items[indexInCartObject].count = newInputQuantity;

 	if (cart.items[indexInCartObject].count === 0) {
 		removeItem(removeButton);
 	} 
 	calculateSubtotal();
}

// Promo code functionality

function calculatePromo() {

	// Set subtotal back to initial value whenever there's no valid user promo in the input box
	subTotal.value = "$" + cart["cart-total"];
	// Get promo code 
	var userPromo = document.getElementById("user-promo").value;
	// Get index of Mac Pro product to check if the product on which an eventual 15MACPRO promo code is applied is valid
	var indexMacPro = utilities.findByProductName(cart.items, "Mac Pro");

	// Loop through valid promo codes in cart object
	for (var promo in cart.promos) {
		// if promo entered by user matches a valid promo, update the subtotal (an input field) with the new price
		if (userPromo === promo) {
			// If Mac Pro is in basket and 15MACPRO promo code is used, discount 15% of Mac Pro price from total
			if (indexMacPro !== -1 && cart.items[indexMacPro].name === "Mac Pro" && userPromo === "15MACPRO" ) {
				subTotal.value = "$" + ((cart["cart-total"] - cart.items[indexMacPro].price + cart.items[indexMacPro].price) * cart.promos[promo]).toFixed(2);
			} else if (userPromo === "10ITEM") {
				// If  promo code is 10ITEM, discount 10% on the first item in the cart
				subTotal.value = "$" + ((cart["cart-total"] - cart.items[0].price + cart.items[0].price) * cart.promos[promo]).toFixed(2);
			} else {
				subTotal.value = "$" + (cart["cart-total"] * cart.promos[promo]).toFixed(2);
			}
		}
	}
}

function calculateSubtotal() {
	
	// Set cart-total back to 0 before calculating it
	cart["cart-total"] = 0;

	// Loop over all product's prices and quantities and add products of them to the cart subtotal
	for (var i = 0; i < cart.items.length; i++) {
		cart["cart-total"] += cart.items[i].price * cart.items[i].count;
	}
	
	// Set subtotal field to cart-total value
	subTotal.value = "$" + cart["cart-total"];
}

function generateShoppingCartHTML() {

	itemsInShoppingCart.innerHTML = "";

	for (var i = 0; i < cart.items.length; i++) {
		itemsInShoppingCart.innerHTML += '<div class="product" id="product' + cart.items.length + '"><div class="img"><img src="https://placeholdit.imgix.net/~text?txtsize=12&txt=110%C3%9775&w=110&h=75" alt=""></div><div class="product-description"><h4>' + cart.items[i].name + '</h4><p>' + cart.items[i]["short-product-description"] + '</p></div><div class="product-total"><div class="price"><span>$' + cart.items[i].price + '</span></div><div class="buttons"><input class="quantity-input" id="' + cart.items[i].inputFieldId + '" value="' + cart.items[i].count + '"></input><button class="change-quantity">Change Qty.</button><button class="remove">Remove</button></div></div></div>'
	}

}


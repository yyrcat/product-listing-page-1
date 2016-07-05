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
var toggleBtn = document.getElementById("toggle");

function showHide (element) {
	if (element.classList.contains("hide")) {
		toggleBtn.textContent = "Hide Shopping Cart";
	} else {
		toggleBtn.textContent = "Show Shopping Cart";
	}
	element.classList.toggle("hide");
	element.focus();
}

// Add item to cart
var shoppingCartHTML = [];

function addItem(id) {

    var target = document.getElementById("shopping-items");
   	
    // Look up product details
   	var product = document.getElementById(id);
  	var productName = product.querySelector(".product-name").innerHTML;
  	var productDescription = product.querySelector(".product-description").innerHTML;
  	var shortProductDescription = productDescription.substr(0, productDescription.indexOf("."));
  	var productPrice = parseFloat(product.querySelector(".price").innerHTML.replace(/[^\d|\.]/g, ""));
  	var productQuantity = parseInt(product.querySelector(".product-quantity").value) || 1;
  	var inputFieldId = cart.items.length;
	// Check if items exists, if so increment count, else add to cart
	var index = utilities.find(cart.items, id);
	var inputFieldId, inputField;
	if (cart.items.length === 0) {
	    cart.items.push({
	      "id": id,
	      "name": productName,
	      "price": productPrice,
	      "count": productQuantity,
	      "input-id": inputFieldId,
	    });
    shoppingCart.classList.remove("hide");
    toggleBtn.classList.remove("hide");

  	cart.items[cart.items.length-1].htmlArrayIndex = cart.items.length-1;

  	shoppingCartHTML.push('<div class="product"><div class="img"><img src="https://placeholdit.imgix.net/~text?txtsize=12&txt=110%C3%9775&w=110&h=75" alt=""></div><div class="product-description"><h4>' + productName + '</h4><p>' + shortProductDescription+ '</p></div><div class="product-total"><div class="price"><span>$' + productPrice + '</span></div><div class="button"><input id="' + inputFieldId + '" value="' + cart.items[0].count + '"></input><button class="remove">Remove</button></div></div></div>');
	} else if (index === -1) {
		      cart.items.push({
		        "id": id,
		        "name": productName,
		        "price": productPrice,
		        "count": productQuantity,
		      });
		      cart.items[cart.items.length-1].htmlArrayIndex = cart.items.length-1;

		      shoppingCartHTML.push('<div class="product"><div class="img"><img src="https://placeholdit.imgix.net/~text?txtsize=12&txt=110%C3%9775&w=110&h=75" alt=""></div><div class="product-description"><h4>' + productName + '</h4><p>' + shortProductDescription + '</p></div><div class="product-total"><div class="price"><span>$' + productPrice + '</span></div><div class="button"><input id="' + inputFieldId + '" value="' + cart.items[cart.items.length-1].count + '"></input><button class="remove">Remove</button></div></div></div>');

	    } else {
		      cart.items[index].count += productQuantity;
		      shoppingCartHTML[cart.items[index].htmlArrayIndex] = '<div class="product"><div class="img"><img src="https://placeholdit.imgix.net/~text?txtsize=12&txt=110%C3%9775&w=110&h=75" alt=""></div><div class="product-description"><h4>' + productName + '</h4><p>' + shortProductDescription + '</p></div><div class="product-total"><div class="price"><span>$' + productPrice + '</span></div><div class="button"><input id="' + inputFieldId + '" value="' + cart.items[index].count + '"></input><button class="remove">Remove</button></div></div></div>'
	    }

	cart["cart-total"] += productQuantity * productPrice;
    target.innerHTML = shoppingCartHTML.join("");
    var shoppingCartItems = document.getElementById("shopping-items");
	var all_quantity_input_fields = shoppingCartItems.querySelectorAll("input");
	console.log(all_quantity_input_fields);

	for (var i = 0; i < all_quantity_input_fields; i++) {
		all_quantity_input_fields[i].value = cart.items[i].count;
	} 
   	document.getElementById("subtotal").value = "$" + cart["cart-total"];

}

// Remove item from shopping cart

// Function to find index of item in cart based on product name
var findUtilities = {
	findByProductName: function (list, name) {
		return list.map(function(x) {
			return x.name;
		})
		.indexOf(name);
	}

};

function removeItem(button) {
	// Place where HTML will be rendered
	var target = document.getElementById("shopping-items");

	// Get product name
	var product = button.parentNode.parentNode.parentNode;
	var productName = product.querySelector(".product-description").firstElementChild.innerHTML;
	
	// Search item in cart.items array based on product name found above
	var index = findUtilities.findByProductName(cart.items, productName);
	
	// Update the shoppingCartHTML array. All items in the shopping cart that come after the deleted element, get their new HTMLArray id assigned.
	shoppingCartHTML.splice(cart.items[index].htmlArrayIndex, 1);
	for (var i = index; i < cart.items.length; i++) { 
		cart.items[i].htmlArrayIndex -= 1;
	}
	cart["cart-total"] -= cart.items[index].price * cart.items[index].count;


	// Also update the JS model
	cart.items.splice(index, 1);

	// Rerender new HTML on screen

	target.innerHTML = shoppingCartHTML.join("");
	document.getElementById("subtotal").value = "$" + cart["cart-total"];

}

var container = document.getElementById("shopping-items");

container.addEventListener("click", function(el) {
	if(el.target.classList.contains("remove")) {
		removeItem(el.target);
	}
}, false);

// Promo code functionality

function calculatePromo () {

	// Get promo code
	var userPromo = document.getElementById("user-promo").value;
	var indexMacPro = findUtilities.findByProductName(cart.items, "Mac Pro");

	// Loop through valid promo codes in cart object
	for (var promo in cart.promos) {
		// if promo entered by user matches a valid promo, update the subtotal (an input field) with the new price
		if (promo === userPromo) {
			// If Mac Pro is in basket and 15MACPRO promo code is used, discount 15% of Mac Pro price from total
			if (findUtilities.findByProductName(cart.items, "Mac Pro") !== -1 && userPromo === "15MACPRO") {
				document.getElementById("subtotal").value = "$" + (cart["cart-total"] - (cart.items[indexMacPro].price * .15));
			} else if (userPromo === "10ITEM") {
				// If  promo code is 10ITEM, discount 10% on the first item in the cart
				document.getElementById("subtotal").value = "$" + (cart["cart-total"] - (cart.items[0].price * .1));
			} else {
				document.getElementById("subtotal").value = "$" + (cart["cart-total"] * cart.promos[promo]).toFixed(2);
			}
		} else {
			document.getElementById("subtotal").value = "$" + (cart["cart-total"]);

		}
	}
}


// If quantity of input field is 0, remove item from



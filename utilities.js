
var utilities = {
by: (function(list, n, callback) {
	// Looping over the list, calling callback on every element whose index is a multiple of n, starting at the nth element of the list.
	for (var i = n - 1; i < list.length; i += n) {
            callback(list[i]);
        }
}),
keys: (function (object) {
	// Create empty array to store the result
	var arr = [];
	// Looping over object's keys; if key belongs to object it will be pushed to arr
	for (var key in object) {
		if (object.hasOwnProperty(key)) {
			arr.push(key);
		}
	}
	return arr;
}),
values: (function (object) {
	// Create empty array to store the result
	var arr = [];
	// Looping over object's keys; if key belongs to object, its value will be pushed to arr
	for (var key in object) {
		if (object.hasOwnProperty(key)) {
			arr.push(object[key]);
		}
	}
	return arr;
}),
pairs: (function (object) {
	// Create empty array to store the result
	var arr = [];
	// Looping over object's keys; if key belongs to object, the key and its corresponding value will be pushed to arr
	for (var key in object) {
		if (object.hasOwnProperty(key)) {
			arr.push(key);
			arr.push(object[key]);
		}
	}
	return arr;
}),
shuffle: (function (arr) {
	// var j will be the random index, temp will hold the old arr[j] version so we can do a swap without losing it
	var i = arr.length, j, temp;
	// Loop will run until i = 0
	while (--i > 0) {
		// Generating a random number between 0 and i
		j = Math.floor(Math.random() * (i + 1));
		// arr[j] gets stored in temp,  before the new element takes its index
		temp = arr [j]; 
		// the element at index i gets assigned to the new random index j
		arr[j] = arr[i];
		// temp (= the old arr[j] value) takes the old place of the element that switched position to index j
		arr[i] = temp;
	}
	return arr;
}),
pluralize: (function(n, word, pluralWord) {
	// ...
	if (n === 1) {
		return word;
	}
	else if (pluralWord) {
		return pluralWord;
	}
	else {
		word += "s";
		return word;
	}
}),
toDash: (function (str) {
	/* Looping through str's characters, if a character is equal to the uppercase version of the character,
	we know the initial character is uppercase. Inside if we slice out this character, replace it with '-'
	and add the lowercase version of the initial character. Finally we append the rest of the initial str
	to the new str, so the part that isn't yet looped over stays the same.
	*/
	for (var i = 0; i < str.length; i++) {
		if (str[i].toUpperCase() === str[i]) {
			str = str.slice(0,i) + "-" + str[i].toLowerCase() + str.slice(i+1,str.length);
		}
	}
	return str;
}),
toCamel: (function (str) {
	/*
	Looping through str's characters, if a character is equal to a dash (-), it gets sliced out and is replaced
	with the next character in uppercase. Finally the rest of str is added back, so the part that isn't yet 
	looped over stays the same.
	*/
	for (var i = 0; i < str.length; i++) {
		if (str[i] === "-") {
			str = str.slice(0,i) + str[i+1].toUpperCase() + str.slice(i+2, str.length);
		}
	}
	return str;
}),
has: (function (obj, search) {
	/*
	Looping through obj's keys. If key belongs to obj, it is checked whether key's corresponding value is equal to
	search.
	*/
	for (var key in obj) {
		if (obj.hasOwnProperty(key)) {
			if (obj[key] === search) {
				return true
			}
		}
	}
	return false;
}),
pick: (function (obj, keys) {
	// Object to store result in
	var result = {};
	// Looping over the keys array (input)
	for (var i = 0; i < keys.length; i++) {
		// Looping over obj's keys for every element in keys
		for (var key in obj) {
			// If element of keys is equal to a key in obj, the result is added to result, with the same key
			if (keys[i] === key) {
				result[key] = obj[key];
			}
		}
	}
	return result;
}),
find: (function(list, id) {
    return list.map(function(x) {
        return x.id;
      })
      .indexOf(id);

}),
findByProductName: (function (list, name) {
		return list.map(function(x) {
			return x.name;
		})
		.indexOf(name);
})};
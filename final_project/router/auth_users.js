const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();



let users = [];

//Check if a user with the given username already exists
const isValid = (username) => { //returns boolean
    // Filter the users array for any user with the same username
    let userwithsamename = users.filter((user) => {
        return user.username === username;
    });
    // Return true if any user with the same username is found, otherwise false
    if (userwithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

// Check if the user with the given username and password exists
const authenticatedUser = (username, password) => { //returns boolean
    // Filter the users array for any user with the same username and password
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });
    // Return true if any valid user is found, otherwise false
    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
}





//only registered users can login
// Login endpoint
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

// Check if username or password is missing
if (!username || !password) {
    return res.status(404).json({ message: "Error loggiing in"});
}

// Authenticate user
if (authenticatedUser(username, password)) {
    // Generate JWT access token
    let accessToken = jwt.sign({
        data: password
    }, 'access', {expiresIn: 60 * 60 });

    // Store access token and username in sesson
    req.session.authorization = {
        accessToken, username
    }
    return res.status(200).send("User successfully logged in");
} else {
    return res.status(208).json({ message: "Invaild Login. Check username and password" });
}
});


// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.user.username;
    const review = req.body.review;
  
    if (!books[isbn]) {
      return res.status(404).json({ message: "Book not found" });
    }
  
    if (!review) {
      return res.status(400).json({ message: "Review content is required" });
    }
  

    books[isbn].reviews[username] = review;
  
    return res.status(200).json({ message: "Review added/updated successfully", reviews: books[isbn].reviews });
  });

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;






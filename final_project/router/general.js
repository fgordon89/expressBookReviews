const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post('/register', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  const userExists = users.some(user => user.username === username);

  if (userExists) {
    return res.status(409).json({ message: "Username already exists" });
  }

  users.push({ username, password });
  return res.status(201).json({ message: "User registered successfully" });
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  // Send JSON resoinse with formatted book data
  res.send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
        const isbn = req.params.isbn;
        const book = books[isbn]; // Access book by numeric key as string

        if (books) { 
            res.send(book);
        } else {
        res.status(404).send({ message: "Book not found"});
        }
    });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  let filteredBooks = [];

  for (let key in books) {
    if (books[key].author === author) {
        filteredBooks.push({ id: key, ...books[key] });
        }
    }

    if (filteredBooks.length > 0) {
        res.send(filteredBooks);
    } else {
        res.status(404).send({ message: "No books found"})    
    }
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
    let matchingBooks = [];
  
    for (let key in books) {
      if (books[key].title === title) {
        matchingBooks.push({ id: key, ...books[key] });
      }
    }
  
    if (matchingBooks.length > 0) {
      res.send(matchingBooks);
    } else {
      res.status(404).send({ message: "No books found with this title" });
    }
  });

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];
  
    if (book) {
      res.send(book.reviews);
    } else {
      res.status(404).send({ message: "Book not found" });
    }
  });

module.exports.general = public_users;

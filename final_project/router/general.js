const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');


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
public_users.get('/', async (req, res) => {
    try {
      const getBooks = () => {
        return new Promise((resolve, reject) => {
            if (books){
                resolve(books);
            } else {
                reject('No books found')
            }
        });
      };

      const allBooks = await getBooks();
      res.send(allBooks);
    } catch (error) {
        res.status(500).send({message: error});
    }
});    

// Get book details based on ISBN
public_users.get('/isbn/:isbn', (req, res) => {
    const isbn = req.params.isbn;
  
    const getBookByISBN = new Promise((resolve, reject) => {
      if (books[isbn]) {
        resolve(books[isbn]);
      } else {
        reject('Book not found');
      }
    });
  
    getBookByISBN
      .then(book => res.send(book))
      .catch(error => res.status(404).send({ message: error }));
  });


// Get book details based on author
public_users.get('/author/:author', (req, res) => {
  const author = req.params.author;
  
  const getBooksByAuthor = new Promise((resolve, reject) => {
    let matchingBooks = [];

    for (let isbn in books) {
        if (books[isbn].author === author) {
            matchingBooks.push({ id:isbn, ...books[isbn] });
        }
    }

    if (matchingBooks.length > 0) {
        resolve(matchingBooks);
    } else {
        reject('No books found by this Author');
    }
  });

  getBooksByAuthor
    .then(books => res.send(books))
    .catch(error => res.status(404).send({ message: error }));
});


// Get all books based on title
public_users.get('/title/:title', (req, res) => {
  const title = req.params.title;

  const getBooksbyTitle = new Promise((resolve, reject) => {
    let matchingBooks = [];

    for (let isbn in books) {
        if (books[isbn].title === title) {
            matchingBooks.push({ id:isbn, ...books[isbn] });
        }
    }

    if (matchingBooks.length > 0) {
        resolve(matchingBooks);
    } else {
        reject('No books found with this title');
    }
   });
    
   getBooksbyTitle
     .then(books => res.send(books))
     .catch(error => res.status(404).send({ message: error}));
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

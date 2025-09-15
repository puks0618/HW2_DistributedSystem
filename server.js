const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8081;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Sample data - in-memory database
let books = [
  { id: 1, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald' },
  { id: 2, title: 'To Kill a Mockingbird', author: 'Harper Lee' },
  { id: 3, title: '1984', author: 'George Orwell' }
];

// Routes

// Home route - display all books
app.get('/', (req, res) => {
  res.render('index', { books });
});

// Add book form
app.get('/add', (req, res) => {
  res.render('add');
});

// Add book - process form submission
app.post('/add', (req, res) => {
  const { title, author } = req.body;
  
  // Validate input
  if (!title || !author) {
    return res.status(400).render('add', { error: 'Title and author are required' });
  }
  
  // Find the highest ID
  const highestId = books.length > 0 ? Math.max(...books.map(book => book.id)) : 0;
  
  // Create new book
  const newBook = {
    id: highestId + 1,
    title,
    author
  };
  
  // Add to books array
  books.push(newBook);
  
  // Redirect to home
  res.redirect('/');
});

// Edit book form
app.get('/edit/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const book = books.find(book => book.id === id);
  
  if (!book) {
    return res.status(404).render('error', { message: 'Book not found' });
  }
  
  res.render('edit', { book });
});

// Update book - process form submission
app.post('/edit/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { title, author } = req.body;
  
  // Validate input
  if (!title || !author) {
    return res.status(400).render('edit', { 
      error: 'Title and author are required',
      book: { id, title, author }
    });
  }
  
  // Find book index
  const index = books.findIndex(book => book.id === id);
  
  if (index === -1) {
    return res.status(404).render('error', { message: 'Book not found' });
  }
  
  // Update book
  books[index] = { id, title, author };
  
  // Redirect to home
  res.redirect('/');
});

// Update book with ID 1 to Harry Potter
app.get('/update-harry-potter', (req, res) => {
  const index = books.findIndex(book => book.id === 1);
  
  if (index !== -1) {
    books[index] = { id: 1, title: 'Harry Potter', author: 'J.K Rowling' };
  }
  
  res.redirect('/');
});

// Delete book with highest ID
app.get('/delete-highest', (req, res) => {
  if (books.length === 0) {
    return res.status(404).render('error', { message: 'No books to delete' });
  }
  
  // Find the highest ID
  const highestId = Math.max(...books.map(book => book.id));
  
  // Filter out the book with the highest ID
  books = books.filter(book => book.id !== highestId);
  
  res.redirect('/');
});

// Delete specific book
app.get('/delete/:id', (req, res) => {
  const id = parseInt(req.params.id);
  
  // Filter out the book with the specified ID
  books = books.filter(book => book.id !== id);
  
  res.redirect('/');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
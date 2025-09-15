# Artist Library

A simple book management system built with Node.js, Express, and EJS.

## Features

- View all books in the library
- Add new books with title and author information
- Update existing books
- Delete books
- Special functionality to update book with ID 1 to "Harry Potter" by "J.K Rowling"
- Special functionality to delete the book with the highest ID

## Requirements

- Node.js (v14 or higher)
- npm (v6 or higher)

## Installation

1. Clone the repository or download the source code
2. Navigate to the project directory
3. Install dependencies:

```bash
npm install
```

## Running the Application

1. Start the server:

```bash
npm start
```

Or for development with auto-restart:

```bash
npm run dev
```

2. Open your browser and navigate to `http://localhost:3000`

## Project Structure

- `server.js` - Main application file with Express server and routes
- `views/` - EJS templates for rendering HTML
  - `index.ejs` - Home page showing all books
  - `add.ejs` - Form for adding new books
  - `edit.ejs` - Form for editing existing books
  - `error.ejs` - Error page
- `public/` - Static assets
  - `css/style.css` - Stylesheet for the application

## API Endpoints

- `GET /` - Home page with list of all books
- `GET /add` - Form to add a new book
- `POST /add` - Process add book form submission
- `GET /edit/:id` - Form to edit a book by ID
- `POST /edit/:id` - Process edit book form submission
- `GET /update-harry-potter` - Update book with ID 1 to Harry Potter
- `GET /delete-highest` - Delete the book with the highest ID
- `GET /delete/:id` - Delete a specific book by ID
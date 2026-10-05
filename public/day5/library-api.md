# Library Books REST API

## Endpoints

### 1. List All Books

- **Method:** `GET`
- **Path:** `/api/books`
- **Description:** Returns a list of all books in the library.
- **Success Status Code:** `200 OK`

---

### 2. Get a Single Book

- **Method:** `GET`
- **Path:** `/api/books/:id`
- **Description:** Returns the details of a specific book by its ID.
- **Success Status Code:** `200 OK`

---

### 3. Create a New Book

- **Method:** `POST`
- **Path:** `/api/books`
- **Description:** Adds a new book to the library catalog.
- **Request Body:**
  ```json
  {
    "title": "The Great Gatsby",
    "author": "F. Scott Fitzgerald",
    "isbn": "978-0743273565",
    "year": 1925,
    "genre": "Fiction"
  }
  ```
- **Success Status Code:** `201 Created`

---

### 4. Update a Book

- **Method:** `PUT`
- **Path:** `/api/books/:id`
- **Description:** Replaces all fields of an existing book with the provided data.
- **Request Body:**
  ```json
  {
    "title": "The Great Gatsby (Revised Edition)",
    "author": "F. Scott Fitzgerald",
    "isbn": "978-0743273565",
    "year": 1925,
    "genre": "Classic Fiction"
  }
  ```
- **Success Status Code:** `200 OK`

---

### 5. Delete a Book

- **Method:** `DELETE`
- **Path:** `/api/books/:id`
- **Description:** Removes a book from the library catalog by its ID.
- **Success Status Code:** `204 No Content`

---

### 6. List Books by Author

- **Method:** `GET`
- **Path:** `/api/books?author=:authorName`
- **Description:** Returns all books written by a specific author using a query parameter.
- **Example:** `GET /api/books?author=Fitzgerald`
- **Success Status Code:** `200 OK`

---

## Error Codes

### 400 Bad Request

- **When it happens:** The request body is missing required fields or contains invalid data (e.g., creating a book without a title, or providing a non-numeric year).
- **Example:**
  ```json
  {
    "error": "Bad Request",
    "message": "Field 'title' is required and cannot be empty."
  }
  ```

### 404 Not Found

- **When it happens:** The requested resource does not exist (e.g., trying to get, update, or delete a book with an ID that is not in the database).
- **Example:**
  ```json
  {
    "error": "Not Found",
    "message": "Book with ID '999' does not exist."
  }
  ```

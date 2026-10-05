# Library Books REST API

## Endpoints

### 1. List All Books

- **Method:** `GET`
- **Path:** `/api/books`
- **Description:** Returns a list of all books in the library.
- **Success Status Code:** `200 OK`

### 2. Get One Book

- **Method:** `GET`
- **Path:** `/api/books/:id`
- **Description:** Returns the details of a single book identified by its ID.
- **Success Status Code:** `200 OK`

### 3. Create a Book

- **Method:** `POST`
- **Path:** `/api/books`
- **Description:** Creates a new book and adds it to the library catalog.
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

### 5. Delete a Book

- **Method:** `DELETE`
- **Path:** `/api/books/:id`
- **Description:** Removes a book from the library catalog by its ID.
- **Success Status Code:** `204 No Content`

### 6. List Books by Author

- **Method:** `GET`
- **Path:** `/api/books?author=:authorName`
- **Description:** Returns all books written by a specific author using a query parameter.
- **Example Request:** `GET /api/books?author=Fitzgerald`
- **Success Status Code:** `200 OK`

---

## Error Codes

### 400 Bad Request

- **When it happens:** The request body is missing required fields or contains invalid data.
- **Example:** Sending a `POST /api/books` request without the required `title` field, or providing a non-numeric value for `year`.

### 404 Not Found

- **When it happens:** The requested resource does not exist in the database.
- **Example:** Sending a `GET /api/books/999` request for a book ID that does not exist.

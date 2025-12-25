import express from "express";
import axios from "axios";
import {
  getAllBooks,
  addBook,
  deleteBook,
  deleteNote,
  updateNotesAndRating,
} from "../db/books.js";

const router = express.Router();



async function getBookCover(isbn) {
  if (!isbn) return null;

  const url = `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg?default=false`;
  try {
    await axios.get(url, {
      responseType: "arraybuffer",
      validateStatus: status => status === 200
    });

    return url;
  } catch (err) {
    console.log(
      `Cover not found for ISBN ${isbn} | Status:`,
      err.response?.status
    );
    return null;
  }
}


// HOME
router.get("/", async (req, res) => {
  try {
    const sort = req.query.sort || "date";
    const page = parseInt(req.query.page) || 1; //default página 1


    const { books, hasNextPage } = await getAllBooks(sort, page);

    res.render("index", { books, sort, page, hasNextPage });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching books");
  }
});


// Add book page
router.get("/books/new", (req, res) => {
  res.render("add");
})

//CREATE BOOK 
router.post("/books", async (req, res) => {
  const { title, author, isbn, rating, description, notes } = req.body;

  if (!title || !author || !rating) {
    return res.status(400).send("Title, author and rating are required");
  }

  try {
    const cover = isbn ? await getBookCover(isbn) : null;

    await addBook({
      title,
      author,
      isbn: isbn || null,
      rating: Number(rating),
      description: description || null,
      notes: notes || null,
      cover,
    });

    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error adding book");
  }
});

// NOTES PAGE
router.get("/notes/:id", async (req, res) => {
  const bookId = Number(req.params.id);

  try {
    const { books } = await getAllBooks();
    const book = books.find(b => b.id === bookId);

    if (!book) {
      return res.status(404).send("Book not found");
    }

    res.render("notes", { book });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error loading notes");
  }
});


// UPDATE NOTE + RATING
router.post("/notes/:id", async (req, res) => {
  const bookId = Number(req.params.id);
  const { notes, rating } = req.body;

  try {
    await updateNotesAndRating(bookId, notes || null, Number(rating));
    res.redirect(`/notes/${bookId}`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating notes");
  }
});



// DELETE NOTES
router.post("/notes/:id/delete", async (req, res) => {
  const bookId = Number(req.params.id);

  try {
    await deleteNote(bookId);
    res.redirect(`/notes/${bookId}`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting note");
  }
});


// DELETE BOOK
router.post("/books/:id/delete", async (req, res) => {
  const bookId = Number(req.params.id);

  try {
    await deleteBook(bookId);
    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting book");
  }
});


export default router;

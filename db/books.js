import pool from "./index.js";

export async function getAllBooks(sort, page = 1, limit = 10) {
  const offset = (page - 1) * limit;
  let orderBy = "created_at DESC";

  if (sort === "rating") orderBy = "rating DESC";

  const result = await pool.query(
    `SELECT * FROM books ORDER BY ${orderBy} LIMIT $1 OFFSET $2`,
    [limit + 1, offset]
  );

  const books = result.rows.slice(0, limit);
  const hasNextPage = result.rows.length > limit;

  return { books, hasNextPage };
}

export async function addBook(book) {
  const {
    title,
    author,
    isbn,
    rating,
    description,
    notes,
    cover
  } = book;

  await pool.query(
    `
    INSERT INTO books
    (title, author, isbn, rating, description, notes, cover)
    VALUES ($1,$2,$3,$4,$5,$6,$7)
    `,
    [title, author, isbn, rating, description, notes, cover]
  );
}

export async function deleteNote(id) {
    await pool.query("UPDATE books SET notes = NULL where id = $1", [id]);
}

export async function deleteBook(id) {
  await pool.query("DELETE FROM books WHERE id = $1", [id]);
}

export async function updateNotesAndRating(id, notes, rating) {
  await pool.query(
    `
    UPDATE books
    SET notes = $1, rating = $2
    WHERE id = $3
    `,
    [notes, rating, id]
  );
}

import express from "express";
import bookRoutes from "./routes/books.js";


const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// app.use(express.static("public"));

// View engine
app.set("view engine", "ejs");

// Routes
app.use("/", bookRoutes);

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});

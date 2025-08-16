import db from "../../db/index.js";

export const getAllCategories = async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM categories ORDER BY id");
    res.render("categories/list", { categories: result.rows });
  } catch (err) {
    console.log("Error fetching categories:", err);
    res.status(500).send("Server Error");
  }
};

export const showCreateForm = (req, res) => {
  res.render("categories/new");
};

export const createCategory = async (req, res) => {
  const { name, description } = req.body;
  try {
    await db.query(
      "INSERT INTO categories (name, description) VALUES ($1, $2)",
      [name, description]
    );
    res.redirect("/categories");
  } catch (err) {
    console.error("Error creating category:", err);
    res.status(500).send("Server Error");
  }
};

export const showEditForm = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query("SELECT * FROM categories WHERE id = $1", [
      id,
    ]);
    const category = result.rows[0];
    if (!category) return res.status(404).send("Category not found");
    res.render("categories/edit", { category });
  } catch (err) {
    console.error("Error fetching category:", err);
    res.status(500).send("Server Error");
  }
};

export const updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  try {
    await db.query(
      "UPDATE categories SET name = $1, description = $2 WHERE id = $3",
      [name, description, id]
    );
    res.redirect("/categories");
  } catch (err) {
    console.error("Error updating category:", err);
    res.status(500).send("Server Error");
  }
};

export const deleteCategory = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM categories WHERE id = $1", [id]);
    res.redirect("/categories");
  } catch (err) {
    console.error("Error deleting category:", err);
    res.status(500).send("Server Error");
  }
};

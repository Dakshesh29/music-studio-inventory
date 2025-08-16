import db from "../../db/index.js";

export const getAllItems = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT items.*, categories.name AS category_name
      FROM items
      JOIN categories ON items.category_id = categories.id
      ORDER BY items.id DESC
    `);
    res.render("items/list", { items: result.rows });
  } catch (err) {
    console.error("Error fetching items:", err);
    res.status(500).send("Server Error");
  }
};

export const showCreateForm = async (req, res) => {
  try {
    const categories = await db.query("SELECT * FROM categories ORDER BY name");
    res.render("items/form", { item: null, categories: categories.rows });
  } catch (err) {
    console.error("Error loading form:", err);
    res.status(500).send("Server Error");
  }
};

export const createItem = async (req, res) => {
  const {
    category_id,
    name,
    brand,
    condition,
    availability,
    notes,
    image_url,
  } = req.body;
  try {
    await db.query(
      "INSERT INTO items (category_id, name, brand, condition, availability, notes, image_url) VALUES ($1,$2,$3,$4,$5,$6,$7)",
      [category_id, name, brand, condition, availability, notes, image_url]
    );
    res.redirect("/items");
  } catch (err) {
    console.error("Error creating item:", err);
    res.status(500).send("Server Error");
  }
};

export const showEditForm = async (req, res) => {
  const { id } = req.params;
  try {
    const item = await db.query("SELECT * FROM items WHERE id = $1", [id]);
    const categories = await db.query("SELECT * FROM categories ORDER BY name");
    res.render("items/form", {
      item: item.rows[0],
      categories: categories.rows,
    });
  } catch (err) {
    console.error("Error loading edit form:", err);
    res.status(500).send("Server Error");
  }
};

export const updateItem = async (req, res) => {
  const { id } = req.params;
  const {
    category_id,
    name,
    brand,
    condition,
    availability,
    notes,
    image_url,
  } = req.body;
  try {
    await db.query(
      "UPDATE items SET category_id=$1, name=$2, brand=$3, condition=$4, availability=$5, notes=$6, image_url=$7 WHERE id=$8",
      [category_id, name, brand, condition, availability, notes, image_url, id]
    );
    res.redirect("/items");
  } catch (err) {
    console.error("Error updating item:", err);
    res.status(500).send("Server Error");
  }
};

export const deleteItem = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM items WHERE id=$1", [id]);
    res.redirect("/items");
  } catch (err) {
    console.error("Error deleting item:", err);
    res.status(500).send("Server Error");
  }
};

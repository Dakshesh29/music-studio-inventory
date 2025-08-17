import db from "../../db/index.js";

export const dashboard = async (_req, res) => {
  try {
    const topItems = await db.query(`
      SELECT i.name, COUNT(b.id) AS usage_count
      FROM items i
      LEFT JOIN bookings b ON b.item_id = i.id
      GROUP BY i.id
      ORDER BY usage_count DESC, i.name ASC
      LIMIT 5
    `);

    const categories = await db.query(`
      SELECT c.name, COUNT(i.id) AS item_count
      FROM categories c
      LEFT JOIN items i ON i.category_id = c.id
      GROUP BY c.id
      ORDER BY c.name ASC
    `);

    const maintenance = await db.query(`
      SELECT i.name, m.next_service_due
      FROM items i
      JOIN maintenance_logs m ON m.item_id = i.id
      WHERE m.next_service_due IS NOT NULL
      ORDER BY m.next_service_due ASC
      LIMIT 7
    `);

    res.render("dashboard", {
      topItems: topItems.rows,
      categories: categories.rows,
      maintenance: maintenance.rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error loading dashboard");
  }
};

import db from "../../db/index.js";

export async function listLogs(req, res) {
  try {
    const { itemId } = req.params;
    const logs = await db.query(
      "SELECT * FROM maintenance_logs WHERE item_id = $1 ORDER BY serviced_at DESC",
      [itemId]
    );

    res.render("maintenance/list", { logs: logs.rows, itemId });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching maintenance logs");
  }
}

export function newLogForm(req, res) {
  const { itemId } = req.params;
  res.render("maintenance/form", { itemId, log: null });
}

export async function createLog(req, res) {
  try {
    const { itemId } = req.params;
    const { serviced_at, next_service_due, notes } = req.body;

    await db.query(
      "INSERT INTO maintenance_logs (item_id, serviced_at, next_service_due, notes) VALUES ($1, $2, $3, $4)",
      [itemId, serviced_at, next_service_due, notes]
    );

    res.redirect(`/items/${itemId}/maintenance`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error creating maintenance log");
  }
}

export async function editLogForm(req, res) {
  try {
    const { id } = req.params;
    const log = await db.query("SELECT * FROM maintenance_logs WHERE id = $1", [
      id,
    ]);

    res.render("maintenance/form", {
      itemId: log.rows[0].item_id,
      log: log.rows[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching maintenance log");
  }
}

export async function updateLog(req, res) {
  try {
    const { id } = req.params;
    const { serviced_at, next_service_due, notes } = req.body;

    const result = await db.query(
      "UPDATE maintenance_logs SET serviced_at = $1, next_service_due = $2, notes = $3 WHERE id = $4 RETURNING item_id",
      [serviced_at, next_service_due, notes, id]
    );

    res.redirect(`/items/${result.rows[0].item_id}/maintenance`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating maintenance log");
  }
}

export async function deleteLog(req, res) {
  try {
    const { id } = req.params;
    const result = await db.query(
      "DELETE FROM maintenance_logs WHERE id = $1 RETURNING item_id",
      [id]
    );

    res.redirect(`/items/${result.rows[0].item_id}/maintenance`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting maintenance log");
  }
}

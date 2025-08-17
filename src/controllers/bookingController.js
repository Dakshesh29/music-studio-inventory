import db from "../../db/index.js";

const bookingController = {
  async newBookingForm(req, res) {
    try {
      const items = await db.query("SELECT id, name FROM items ORDER BY name");
      const selectedItemId = req.query.item_id || null;
      const error = req.query.error || null;
      res.render("bookings/new", { items: items.rows, selectedItemId, error });
    } catch (err) {
      console.error(err);
      res.status(500).send("Error loading booking form");
    }
  },

  async createBooking(req, res) {
    try {
      const { item_id, user_name, start_time, end_time } = req.body;

      const conflict = await db.query(
        `SELECT * FROM bookings
         WHERE item_id = $1
         AND status IN ('Reserved','Active')
         AND (start_time, end_time) OVERLAPS ($2::timestamptz, $3::timestamptz)`,
        [item_id, start_time, end_time]
      );

      if (conflict.rows.length > 0) {
        return res.redirect(
          `/bookings/new?item_id=${item_id}&error=Time%20slot%20already%20booked`
        );
      }

      await db.query(
        "INSERT INTO bookings (item_id, user_name, start_time, end_time) VALUES ($1,$2,$3,$4)",
        [item_id, user_name, start_time, end_time]
      );

      res.redirect("/bookings");
    } catch (err) {
      console.error(err);
      res.status(500).send("Error creating booking");
    }
  },

  async listBookings(req, res) {
    try {
      const result = await db.query(
        `SELECT b.*, i.name as item_name 
         FROM bookings b 
         JOIN items i ON b.item_id = i.id
         ORDER BY b.start_time DESC`
      );
      res.render("bookings/list", { bookings: result.rows });
    } catch (err) {
      console.error(err);
      res.status(500).send("Error fetching bookings");
    }
  },
};

export default bookingController;

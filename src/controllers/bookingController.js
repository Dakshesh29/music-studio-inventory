import db from "../../db/index.js";

const bookingController = {
  async listBookings(req, res) {
    try {
      const result = await db.query(
        `SELECT b.*, i.name AS item_name
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

  async newBookingForm(req, res) {
    try {
      const items = await db.query("SELECT id, name FROM items ORDER BY name");
      const selectedItemId = req.query.item_id || null;
      res.render("bookings/new", { items: items.rows, selectedItemId });
    } catch (err) {
      console.error(err);
      res.status(500).send("Error loading booking form");
    }
  },

  async createBooking(req, res) {
    const { item_id, user_name, start_time, end_time } = req.body;
    try {
      await db.query(
        `INSERT INTO bookings (item_id, user_name, start_time, end_time, status)
         VALUES ($1, $2, $3, $4, 'Reserved')`,
        [item_id, user_name, start_time, end_time]
      );
      res.redirect("/bookings");
    } catch (err) {
      console.error(err);
      res.status(500).send("Error creating booking");
    }
  },

  async editBookingForm(req, res) {
    try {
      const booking = await db.query("SELECT * FROM bookings WHERE id = $1", [
        req.params.id,
      ]);
      res.render("bookings/edit", { booking: booking.rows[0] });
    } catch (err) {
      console.error(err);
      res.status(500).send("Error loading booking edit form");
    }
  },

  async updateBooking(req, res) {
    const { user_name, start_time, end_time, status } = req.body;
    try {
      await db.query(
        `UPDATE bookings
         SET user_name=$1, start_time=$2, end_time=$3, status=$4
         WHERE id=$5`,
        [user_name, start_time, end_time, status, req.params.id]
      );
      res.redirect("/bookings");
    } catch (err) {
      console.error(err);
      res.status(500).send("Error updating booking");
    }
  },

  async deleteBooking(req, res) {
    try {
      await db.query("DELETE FROM bookings WHERE id = $1", [req.params.id]);
      res.redirect("/bookings");
    } catch (err) {
      console.error(err);
      res.status(500).send("Error deleting booking");
    }
  },
};

export default bookingController;

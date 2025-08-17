import db from "../../db/index.js";

const bookingController = {
  async listBookings(req, res) {
    try {
      await db.query(`
        UPDATE bookings 
        SET status = CASE 
          WHEN NOW() BETWEEN start_time AND end_time THEN 'Active'
          WHEN NOW() > end_time THEN 'Completed'
          ELSE status
        END
      `);

      const result = await db.query(
        `SELECT b.*, i.name AS item_name
         FROM bookings b
         JOIN items i ON i.id = b.item_id
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

      if (new Date(start_time) >= new Date(end_time)) {
        return res.redirect(
          `/bookings/new?item_id=${item_id}&error=End%20time%20must%20be%20after%20start%20time`
        );
      }

      const conflict = await db.query(
        `SELECT 1 FROM bookings
         WHERE item_id = $1
           AND status IN ('Reserved','Active')
           AND (start_time, end_time) OVERLAPS ($2::timestamptz, $3::timestamptz)`,
        [item_id, start_time, end_time]
      );
      if (conflict.rowCount > 0) {
        return res.redirect(
          `/bookings/new?item_id=${item_id}&error=Time%20slot%20already%20booked`
        );
      }

      await db.query(
        `INSERT INTO bookings (item_id, user_name, start_time, end_time, status)
         VALUES ($1,$2,$3,$4,'Reserved')`,
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
      const { id } = req.params;
      const bookingRes = await db.query(
        "SELECT * FROM bookings WHERE id = $1",
        [id]
      );
      if (bookingRes.rowCount === 0)
        return res.status(404).send("Booking not found");

      const items = await db.query("SELECT id, name FROM items ORDER BY name");
      res.render("bookings/edit", {
        booking: bookingRes.rows[0],
        items: items.rows,
      });
    } catch (err) {
      console.error(err);
      res.status(500).send("Error loading edit form");
    }
  },

  async updateBooking(req, res) {
    try {
      const { id } = req.params;
      const { item_id, user_name, start_time, end_time, status } = req.body;

      if (new Date(start_time) >= new Date(end_time)) {
        return res.status(400).send("End time must be after start time");
      }

      const conflict = await db.query(
        `SELECT 1 FROM bookings
         WHERE item_id = $1
           AND id <> $2
           AND status IN ('Reserved','Active')
           AND (start_time, end_time) OVERLAPS ($3::timestamptz, $4::timestamptz)`,
        [item_id, id, start_time, end_time]
      );
      if (conflict.rowCount > 0) {
        return res.status(400).send("Time slot already booked");
      }

      await db.query(
        `UPDATE bookings
           SET item_id=$1, user_name=$2, start_time=$3, end_time=$4, status=$5
         WHERE id=$6`,
        [item_id, user_name, start_time, end_time, status, id]
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

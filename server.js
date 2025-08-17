import dotenv from "dotenv";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import db from "./db/index.js";
import categoryRoutes from "./src/routes/categoryRoutes.js";
import itemRoutes from "./src/routes/itemRoutes.js";
import maintenanceRoutes from "./src/routes/maintenanceRoutes.js";

dotenv.config();

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use("/categories", categoryRoutes);

app.use("/items", itemRoutes);
app.use("/", maintenanceRoutes);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "src/views"));

app.get("/", (req, res) => {
  res.send("Music Studio Inventory App is running with ES Modules!");
});

app.get("/db-test", async (req, res) => {
  try {
    const result = await db.query("SELECT NOW()");
    res.json({ success: true, time: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "DB connection failed" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});

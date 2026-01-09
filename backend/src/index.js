const express = require("express");
const cors = require("cors");
require("dotenv").config();
require("./jobs/email.cron");


const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Discipline Tracker Backend is running 🚀");
});

const PORT = process.env.PORT || 5000;
const taskRoutes = require("./routes/task.routes");
app.use("/api/tasks", taskRoutes);
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const emailRoutes = require("./routes/email.routes");
const confirmRoutes = require("./routes/confirm.routes");

app.use("/api/email", emailRoutes);
app.use("/api/confirm", confirmRoutes);

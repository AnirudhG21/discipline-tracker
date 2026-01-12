const express = require("express");
const router = express.Router();
const prisma = require("../config/prisma");

// Daily points for line graph
router.get("/daily", async (req, res) => {
  const logs = await prisma.dailyTaskLog.findMany({
    where: { status: 1 },
    include: { task: true },
    orderBy: { date: "asc" },
  });

  const dailyMap = {};

  logs.forEach(log => {
    const date = log.date.toISOString().split("T")[0];
    dailyMap[date] = (dailyMap[date] || 0) + log.task.points;
  });

  const data = Object.keys(dailyMap).map(date => ({
    date,
    points: dailyMap[date],
  }));

  res.json(data);
});

// Streak calculation
router.get("/streak", async (req, res) => {
  const logs = await prisma.dailyTaskLog.findMany({
    where: { status: 1 },
    orderBy: { date: "desc" },
  });

  let streak = 0;
  let currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  for (const log of logs) {
    const logDate = new Date(log.date);
    logDate.setHours(0, 0, 0, 0);

    if (
      logDate.getTime() === currentDate.getTime() ||
      logDate.getTime() === currentDate.getTime() - 86400000
    ) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      break;
    }
  }

  res.json({ streak });
});

module.exports = router;

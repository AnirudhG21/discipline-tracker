const express = require("express");
const router = express.Router();
const prisma = require("../config/prisma");

// Mark task as done for today
router.post("/done", async (req, res) => {
  try {
    const { taskId } = req.body;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existing = await prisma.dailyTaskLog.findFirst({
      where: {
        taskId,
        date: today,
      },
    });

    if (existing) {
      return res.json({ message: "Already marked for today" });
    }

    await prisma.dailyTaskLog.create({
      data: {
        taskId,
        date: today,
        status: 1,
      },
    });

    res.json({ message: "Task marked as done" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;

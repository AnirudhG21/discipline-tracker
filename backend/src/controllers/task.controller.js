const prisma = require("../config/prisma");

/**
 * Create a new task
 */
exports.createTask = async (req, res) => {
  try {
    const { name, time, points = 1 } = req.body;

    if (!name || !time) {
      return res.status(400).json({ message: "Name and time are required" });
    }

    const task = await prisma.task.create({
      data: {
        name,
        time,
        points,
        userId: 1, // TEMP: single user
      },
    });

    res.status(201).json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create task" });
  }
};

/**
 * Get all tasks
 */
exports.getTasks = async (req, res) => {
  try {
    const tasks = await prisma.task.findMany({
      where: { userId: 1 },
      orderBy: { createdAt: "desc" },
    });

    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch tasks" });
  }
};

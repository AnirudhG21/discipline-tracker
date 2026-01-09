const prisma = require("../config/prisma");

exports.confirmTask = async (req, res) => {
  const { token } = req.query;

  try {
    const record = await prisma.emailToken.findUnique({
      where: { token },
      include: { task: true },
    });

    if (!record || record.expiresAt < new Date()) {
      return res.status(400).send("Invalid or expired token");
    }

    await prisma.dailyTaskLog.upsert({
      where: {
        taskId_date: {
          taskId: record.taskId,
          date: new Date().toISOString().split("T")[0],
        },
      },
      update: { status: 1 },
      create: {
        taskId: record.taskId,
        date: new Date(),
        status: 1,
      },
    });

    await prisma.emailToken.delete({
      where: { token },
    });

    res.send("✅ Task marked as completed. Great job!");
  } catch (err) {
    console.error(err);
    res.status(500).send("Something went wrong");
  }
};

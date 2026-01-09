const prisma = require("../config/prisma");
const { generateToken } = require("../services/token.service");
const { sendTaskEmail } = require("../services/email.service");

exports.sendTaskReminder = async (req, res) => {
  try {
    const tasks = await prisma.task.findMany({
      where: { isActive: true },
    });

    for (const task of tasks) {
      const token = generateToken();

      await prisma.emailToken.create({
        data: {
          token,
          taskId: task.id,
          date: new Date(),
          expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
        },
      });

      const confirmUrl = `${process.env.APP_BASE_URL}/api/confirm?token=${token}`;

      await sendTaskEmail({
        to: "yourgmail@gmail.com",
        taskName: task.name,
        confirmUrl,
      });
    }

    res.json({ message: "Emails sent" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Email send failed" });
  }
};

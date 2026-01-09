const cron = require("node-cron");
const prisma = require("../config/prisma");
const { generateToken } = require("../services/token.service");
const { sendTaskEmail } = require("../services/email.service");

const runEmailJob = async () => {
  console.log("⏰ Running email reminder cron...");

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
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    });

    const confirmUrl = `${process.env.APP_BASE_URL}/api/confirm?token=${token}`;

    await sendTaskEmail({
      to: process.env.SMTP_USER,
      taskName: task.name,
      confirmUrl,
    });
  }
};

// ⏰ Every day at 9 PM IST
cron.schedule("30 15 * * *", runEmailJob);

module.exports = {};

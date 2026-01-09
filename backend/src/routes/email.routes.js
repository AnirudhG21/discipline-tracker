const router = require("express").Router();
const controller = require("../controllers/email.controller");

router.post("/send", controller.sendTaskReminder);

module.exports = router;

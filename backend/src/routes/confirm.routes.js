const router = require("express").Router();
const controller = require("../controllers/confirm.controller");

router.get("/", controller.confirmTask);

module.exports = router;

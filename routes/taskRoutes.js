const express = require("express");
const taskController = require("../controllers/taskController");
const validateId = require("../middlewares/validateId");

const router = express.Router();

router.get("/", taskController.getAllTasks);
router.get("/:id", validateId, taskController.getTaskById);
router.post("/", taskController.createTask);

module.exports = router;

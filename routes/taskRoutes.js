const express = require("express");
const taskController = require("../controllers/taskController");
const validateId = require("../middlewares/validateId");

const router = express.Router();

router.get("/", taskController.getAllTasks);
router.get("/:id", validateId, taskController.getTaskById);
router.post("/", taskController.createTask);
router.put("/:id", validateId, taskController.updateTask);
router.delete("/:id", validateId, taskController.deleteTask);

module.exports = router;

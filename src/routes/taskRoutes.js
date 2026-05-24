const express = require('express');

const router = express.Router();

const authMiddleware = require('../middleware/authMiddleware');

const {
  createTask,
  getTasks,
  updateTask,
  deleteTask
} = require('../controllers/taskController');


// CREATE TASK
router.post('/', authMiddleware, createTask);

// GET TASKS
router.get('/', authMiddleware, getTasks);

// UPDATE TASK
router.put('/:id', authMiddleware, updateTask);

// DELETE TASK
router.delete('/:id', authMiddleware, deleteTask);

module.exports = router;
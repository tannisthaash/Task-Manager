const Task = require('../models/Task');


// CREATE TASK
exports.createTask = async (req, res) => {

  try {

    const {
      title,
      description,
      priority,
      dueDate
    } = req.body;

    const task = await Task.create({
      title,
      description,
      priority,
      dueDate,
      createdBy: req.user.id
    });

    res.status(201).json({
      message: 'Task created successfully',
      task
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};


// GET ALL TASKS
exports.getTasks = async (req, res) => {

  try {

    // Pagination
    const page = Number(req.query.page) || 1;

    const limit = Number(req.query.limit) || 5;

    const skip = (page - 1) * limit;

    // Filters
    const filter = {
      createdBy: req.user.id
    };

    // Status filter
    if (req.query.status) {
      filter.status = req.query.status;
    }

    // Priority filter
    if (req.query.priority) {
      filter.priority = req.query.priority;
    }

    // Search
    if (req.query.search) {
      filter.title = {
        $regex: req.query.search,
        $options: 'i'
      };
    }

    // Sorting
    const sortBy = req.query.sort || '-createdAt';

    // Fetch tasks
    const tasks = await Task.find(filter)
      .sort(sortBy)
      .skip(skip)
      .limit(limit);

    res.status(200).json(tasks);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};


// UPDATE TASK
exports.updateTask = async (req, res) => {

  try {

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        message: 'Task not found'
      });
    }

    // Ensure user owns task
    if (task.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        message: 'Unauthorized'
      });
    }

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(200).json({
      message: 'Task updated successfully',
      updatedTask
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};


// DELETE TASK
exports.deleteTask = async (req, res) => {

  try {

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        message: 'Task not found'
      });
    }

    // Ensure user owns task
    if (task.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        message: 'Unauthorized'
      });
    }

    await task.deleteOne();

    res.status(200).json({
      message: 'Task deleted successfully'
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};
const Task = require('../models/Task');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB file size limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files (jpeg, jpg, png, gif) are allowed!'));
    }
  }
}).single('image');

exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error: Could not retrieve tasks.'
    });
  }
};

exports.createTask = (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      console.error('Multer Error on Create:', err.message);
      return res.status(400).json({ success: false, error: err.message || 'Image upload failed' });
    }

    try {
      const { title, date, priority, description, status, progress } = req.body;

      if (!title) {
        return res.status(400).json({ success: false, error: 'Task title is required.' });
      }

      const userId = req.user.id;
      const userName = req.user.displayName;

      const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

      const task = await Task.create({
        user: userId,
        userName,
        title,
        date: date || undefined,
        priority,
        description,
        status,
        progress,
        image: imageUrl,
      });

      res.status(201).json(task);
    } catch (error) {
      console.error('Create Task Error:', error.message);
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  });
};

exports.updateTask = (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      console.error('Multer Error on Update:', err.message);
      return res.status(400).json({ success: false, error: err.message || 'Image upload failed' });
    }

    try {
      const taskId = req.params.id;
      const userId = req.user.id;

      let task = await Task.findById(taskId);

      if (!task) {
        return res.status(404).json({ success: false, error: 'Task not found' });
      }

      if (task.user.toString() !== userId) {
        return res.status(401).json({ success: false, error: 'Not authorized to update this task' });
      }

      let imageUrl = task.image;
      if (req.file) {
        if (task.image && fs.existsSync(path.join(__dirname, '..', task.image))) {
          fs.unlink(path.join(__dirname, '..', task.image), (unlinkErr) => {
            if (unlinkErr) console.error("Failed to delete old image file:", unlinkErr);
          });
        }
        imageUrl = `/uploads/${req.file.filename}`;
      } else if (req.body.clearImage === 'true' || req.body.image === 'null') {
          if (task.image && fs.existsSync(path.join(__dirname, '..', task.image))) {
              fs.unlink(path.join(__dirname, '..', task.image), (unlinkErr) => {
                  if (unlinkErr) console.error("Failed to delete old image file:", unlinkErr);
              });
          }
          imageUrl = null;
      }

      const newUserName = req.user.displayName;
      if (task.userName !== newUserName) {
          task.userName = newUserName;
      }

      const updatedData = {
        title: req.body.title || task.title,
        date: req.body.date || task.date,
        priority: req.body.priority || task.priority,
        description: req.body.description || task.description,
        status: req.body.status || task.status,
        progress: req.body.progress || task.progress,
        image: imageUrl,
        userName: task.userName
      };

      task = await Task.findByIdAndUpdate(taskId, updatedData, {
        new: true,
        runValidators: true
      });

      res.status(200).json(task);
    } catch (error) {
      console.error('Update Task Error:', error.message);
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  });
};

exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({
        success: false,
        error: 'Task not found'
      });
    }

    if (task.user.toString() !== userId) {
      return res.status(401).json({ success: false, error: 'Not authorized to delete this task' });
    }

    if (task.image && fs.existsSync(path.join(__dirname, '..', task.image))) {
      fs.unlink(path.join(__dirname, '..', task.image), (err) => {
        if (err) console.error("Error deleting image file:", err);
      });
    }

    await Task.deleteOne({ _id: id });

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully.'
    });
  } catch (error) {
    console.error('Delete Task Error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Server Error: ' + error.message
    });
  }
};
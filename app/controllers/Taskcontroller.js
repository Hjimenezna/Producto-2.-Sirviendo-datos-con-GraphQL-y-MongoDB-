const Task = require('../models/Task');

exports.getTasks = async (req, res) => {
    const tasks = await Task.find();
    res.json(tasks);
};


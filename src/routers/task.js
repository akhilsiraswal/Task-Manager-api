const express = require("express");
const router = new express.Router();
const Task = require("../models/task");
const User = require("../models/user");
const auth = require("../middleware/auth");

router.delete("/tasks/:id", auth, async (req, res) => {
  const _id = req.params.id;
  try {
    // const task = await Task.findByIdAndDelete(req.params.id);
    const task = await Task.findOneAndDelete({ _id, owner: req.user.id });
    if (!task) {
      return res.status(404).send();
    }

    res.send(task);
  } catch (error) {
    res.status(500).send();
  }
});

router.post("/tasks", auth, async (req, res) => {
  const task = new Task({
    ...req.body,
    owner: req.user._id,
  });
  try {
    task.save();
    res.status(201).send(task);
  } catch (error) {
    res.status(400).json({
      Error: "Error!!!!!",
    });
  }
});

//   GET /tasks?completed=true
//   GET /tasks?limit=10&skip=10
//   GET /tasks?sortBy=createAt_asc
router.get("/tasks", auth, async (req, res) => {
  const _id = req.user._id;
  // console.log(_id);
  const match = {};
  const sort = {};

  if (req.query.completed) {
    match.completed = req.query.completed === "true";
  }

  if (req.query.sortBy) {
    const parts = req.query.sortBy.split(":");
    sort[parts[0]] = parts[1] === "desc" ? -1 : 1;
  }

  try {
    const user = await User.findById({ _id });
    await user
      .populate({
        path: "tasks",
        match,
        options: {
          limit: parseInt(req.query.limit),
          skip: parseInt(req.query.skip),
          sort,
        },
      })
      .execPopulate();
    res.status(201).send(user.tasks);
  } catch (error) {
    res.status(500).send();
  }
});

router.get("/task/:id", auth, async (req, res) => {
  const _id = req.params.id;
  try {
    const task = await Task.findOne({ _id, owner: req.user._id });
    if (!task) {
      res.status(404).send();
    }
    res.status(201).send(task);
  } catch (error) {
    res.status(404).json({
      Error: "Task not found",
    });
  }

  router.patch("/task/:id", auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["description", "completed"];
    const isValidOperation = updates.every((update) => {
      return allowedUpdates.includes(update);
    });

    if (!isValidOperation) {
      return res.status(400).send({ Error: "Invalid Updates!!" });
    }
    try {
      const task = await Task.findOne({
        _id: req.params.id,
        owner: req.user._id,
      });
      console.log(task);
      if (!task) {
        return res.status(404).json({
          Error: "Error!! task not found",
        });
      }
      updates.forEach((update) => (task[update] = req.body[update]));

      await task.save();
      res.send(task);
    } catch (error) {
      res.status(400).json({
        Error: "Error!!!1",
      });
    }
  });
});

module.exports = router;

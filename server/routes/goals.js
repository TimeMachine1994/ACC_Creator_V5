const express = require('express');
const router = express.Router({ mergeParams: true });
const mongoose = require('mongoose');
const { generateGoalSuggestion } = require('../openai');

const GoalSchema = new mongoose.Schema({
  title: String,
  status: { type: String, default: 'In Progress' },
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
});

const Goal = mongoose.model('Goal', GoalSchema);
const Project = mongoose.model('Project');

router.post('/', async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const goal = new Goal({
      title: req.body.title,
      project: project._id,
    });

    const newGoal = await goal.save();
    project.goals.push(newGoal._id);
    await project.save();

    res.status(201).json(newGoal);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get('/:goalId', async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.goalId);
    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }
    res.json(goal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/generate-suggestion', async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    const suggestion = await generateGoalSuggestion(project.name);
    res.json({ suggestion });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

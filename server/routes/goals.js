const express = require('express');
const router = express.Router({ mergeParams: true });
const mongoose = require('mongoose');
const { generateGoalSuggestion } = require('../openai');

const GoalSchema = new mongoose.Schema({
  title: String,
  goal_summary: { type: String, default: ' ' },
  notes: { type: String, default: ' ' },
  
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

// New functions

router.put('/:projectId', async (req, res) => {
  try {
    const { name, summary } = req.body;
    const project = await Project.findByIdAndUpdate(
      req.params.projectId,
      { name, summary },
      { new: true }
    );
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json(project);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post('/:projectId/goals', async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const goal = new Goal({
      title: req.body.name,
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

router.delete('/:projectId/goals/:goalId', async (req, res) => {
  try {
    const { projectId, goalId } = req.params;
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const goal = await Goal.findByIdAndDelete(goalId);
    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    project.goals = project.goals.filter(id => id.toString() !== goalId);
    await project.save();

    res.status(200).json({ message: 'Goal deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;

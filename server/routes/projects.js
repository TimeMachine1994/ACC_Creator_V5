const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { generateProjectIdea } = require('../openai');


const ProjectSchema = new mongoose.Schema({
  name: String,
  goals: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Goal' }],
});

const Project = mongoose.model('Project', ProjectSchema);

router.get('/', async (req, res) => {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', async (req, res) => {
  const project = new Project({
    name: req.body.name,
  });

  try {
    const newProject = await project.save();
    res.status(201).json(newProject);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate('goals');
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.get('/generate-idea', async (req, res) => {
  try {
    const idea = await generateProjectIdea();
    res.json({ idea });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

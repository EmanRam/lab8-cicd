const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/tasksdb')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error(err));

// Task schema
const Task = mongoose.model('Task', new mongoose.Schema({
  id: Number,
  name: String,
  status: String
}));

// Seed on first run
async function seed() {
  const count = await Task.countDocuments();
  if (count === 0) {
    await Task.insertMany([
      { id: 1, name: 'Buy groceries', status: 'pending' },
      { id: 2, name: 'Walk the dog', status: 'done' },
      { id: 3, name: 'Read a book', status: 'pending' },
      { id: 7, name: 'Tea', status: 'pending' },
    ]);
    console.log('Database seeded');
  }
}
seed();

// Routes
app.get('/tasks', async (req, res) => {
  const tasks = await Task.find({}, '-_id -__v');
  res.json(tasks);
});

app.post('/tasks', async (req, res) => {
  const task = new Task(req.body);
  await task.save();
  res.status(201).json(task);
});

app.listen(3000, () => console.log('Server running on port 3000'));
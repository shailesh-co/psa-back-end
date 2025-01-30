const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
// Middleware to parse JSON requests
app.use(bodyParser.json());

// Connect to MongoDB (local)
mongoose.connect('mongodb://localhost:27017/test')
  .then(() => {
    console.log('MongoDB connected');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB', err);
  });

// Define a Schema for the 'loging' collection
const logingSchema = new mongoose.Schema({
  name: String,
  email: String,
  mobileNumber: { type: String, required: true },  // Mobile number is required
  isActive: Boolean,
});

// Create a Model based on the schema
const Loging = mongoose.model('Loging', logingSchema);

// POST route to create a new loging entry
app.post('/loging', async (req, res) => {
  try {
    const newLoging = new Loging(req.body); // Create a new loging instance
    await newLoging.save(); // Save to MongoDB
    res.status(201).send(newLoging); // Return the created entry
  } catch (err) {
    res.status(500).send(err); // Send error if entry cannot be created
  }
});

// GET route to retrieve a loging entry by ID
app.get('/loging/:id', async (req, res) => {
  try {
    const logingId = req.params.id;
    const loging = await Loging.findById(logingId); // Find by ID
    if (!loging) {
      return res.status(404).send({ message: 'Loging entry not found' });
    }
    res.status(200).send(loging); // Return found entry
  } catch (err) {
    res.status(500).send(err); // Send error if something goes wrong
  }
});

// PUT route to update a loging entry by ID
app.put('/loging/:id', async (req, res) => {
  try {
    const logingId = req.params.id;
    const updatedLoging = await Loging.findByIdAndUpdate(logingId, req.body, { new: true }); // Find and update
    if (!updatedLoging) {
      return res.status(404).send({ message: 'Loging entry not found' });
    }
    res.status(200).send(updatedLoging); // Return updated entry
  } catch (err) {
    res.status(500).send(err); // Send error if update fails
  }
});

// DELETE route to delete a loging entry by ID
app.delete('/loging/:id', async (req, res) => {
  try {
    const logingId = req.params.id;
    const deletedLoging = await Loging.findByIdAndDelete(logingId); // Find and delete
    if (!deletedLoging) {
      return res.status(404).send({ message: 'Loging entry not found' });
    }
    res.status(200).send({ message: 'Loging entry deleted successfully' });
  } catch (err) {
    res.status(500).send(err); // Send error if deletion fails
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/mern_text_editor', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const textEditorSchema = new mongoose.Schema({
  name: String,
  content: String,
});

const TextEditor = mongoose.model('TextEditor', textEditorSchema);

// CRUD operations
app.get('/api/documents', async (req, res) => {
  try {
    const documents = await TextEditor.find();
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/documents', async (req, res) => {
  const { name, content } = req.body;

  try {
    const newDocument = new TextEditor({ name, content });
    await newDocument.save();
    res.json(newDocument);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/documents/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const document = await TextEditor.findById(id);
    res.json(document);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.put('/api/documents/:id', async (req, res) => {
  const id = req.params.id;
  const { name, content } = req.body;

  try {
    const updatedDocument = await TextEditor.findByIdAndUpdate(
      id,
      { name, content },
      { new: true }
    );
    res.json(updatedDocument);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.delete('/api/documents/:id', async (req, res) => {
  const id = req.params.id;

  try {
    await TextEditor.findByIdAndDelete(id);
    res.json({ message: 'Document deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

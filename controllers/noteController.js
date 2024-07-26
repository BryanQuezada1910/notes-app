import Note from '../models/Note.js';

export const getNotes = async (req, res) => {
  try {
    const notes = await Note.find({ userID: req.user._id });
    if (notes.length === 0) {
      return res.status(404).json({ message: 'No hay notas' });
    }
    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener las notas' });
  }
};

export const createNote = async (req, res) => {
  try {
    const { title, content } = req.body;
    console.log(title, content, req.user._id);
    const note = new Note({
      title,
      content,
      userID: req.user._id,
    });
    await note.save();
    res.status(201).json(note);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear la nota' });
  }
}

export const updateNote = async (req, res) => {
  try {
    const { title, content } = req.body;
    await Note.findByIdAndUpdate(req.params.id, { title, content });
    res.status(200).json({ message: 'Nota actualizada correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar la nota' });
  }
};

export const deleteNote = async (req, res) => {
  try {
    await Note.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Nota eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar la nota' });
  }
};
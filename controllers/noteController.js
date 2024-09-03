import Note from '../models/Note.js';

export const getNotes = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'No estás autorizado' });
    }
  
    const notes = await Note.find({ userID: req.user._id });
    if (notes.length === 0) {
      return res.status(404).json({ message: 'No hay notas' });
    }
    return res.status(200).json(notes);
  } catch (error) {
    return res.status(500).json({ message: 'Error al obtener las notas' });
  }
};

export const createNote = async (req, res) => {
  try {
    const { title, content } = req.body;
    const note = new Note({
      title,
      content,
      userID: req.user._id,
    });
    await note.save();
    return res.status(201).json(note);
  } catch (error) {
    return res.status(500).json({ message: 'Error al crear la nota' });
  }
}

export const updateNote = async (req, res) => {
  try {
    const { title, content, status } = req.body;
    const completed = status === 'true' ? true : false;
    if (!title || !content) {
      return res.status(400).json({ message: 'Por favor, ingresa un título y contenido' });
    }

    if (typeof completed !== 'boolean') {
      return res.status(400).json({ message: 'Por favor, ingresa un valor booleano para el estado' });
    }

    await Note.findByIdAndUpdate(req.params.id, { title, content, completed });
    return res.status(200).json({ message: 'Nota actualizada correctamente' });
  } catch (error) {
    return res.status(500).json({ message: 'Error al actualizar la nota' });
  }
};

export const deleteNote = async (req, res) => {
  try {
    await Note.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: 'Nota eliminada correctamente' });
  } catch (error) {
    return res.status(500).json({ message: 'Error al eliminar la nota' });
  }
};
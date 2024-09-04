import { Router } from 'express';
import { getNotes, createNote, updateNote, updateStatus, deleteNote } from '../controllers/noteController.js';

const router = Router();

router.get('/', getNotes);

router.post('/', createNote);

router.put('/:id', updateNote);

router.put('/status/:id', updateStatus);

router.delete('/:id', deleteNote);

export default router;
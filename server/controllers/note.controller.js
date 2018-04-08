import Note from '../models/note';
import Lane from '../models/lane';
import uuid from 'uuid';

export function getSomething(req, res) {
  return res.status(200).end();
}

export function addNote(req, res) {
  const { note, laneId } = req.body;

  if (!note || !note.task || !laneId) {
    res.status(400).end();
  }

  const newNote = new Note({
    task: note.task,
  });

  newNote.id = uuid();
  newNote.save((err, saved) => {
    if (err) {
      res.status(500).send(err);
    }
    Lane.findOne({ id: laneId })
      .then(lane => {
        lane.notes.push(saved);
        return lane.save();
      })
      .then(() => {
        res.json(saved);
      });
  });
}

export function editNote(req, res) {
  Note.findOneAndUpdate({ id: req.params.noteId}, {task: req.body.task}, (err, note) => {
    if (err) {
      return res.status(500).send(err);
    }
    console.log(note);

    res.status(200).end();
  });
}

export function deleteNote(req, res) {
  Note.findOne({ id: req.params.noteId }).exec((err, note) => {
    if (err) {
      return res.status(500).send(err);
    }

    Lane.findOne({ id: req.body.laneId }).exec((err, lane) => {
      if (err) {
        return res.status(500).send(err);
      }

      const newNotes = lane.notes.filter(note => note.id !== req.params.noteId);
      lane.notes = newNotes;

      lane.save(err => {
        if (err) {
          return res.status(500).send(err);
        }

        note.remove(() => {
          return res.status(200).end();
        });
      });
    });      
  });
}
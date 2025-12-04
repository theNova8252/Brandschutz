import express from 'express';

const router = express.Router();

const chapters = [
  { id: 1, title: 'Kapitel 1: Verhalten im Brandfall' },
  { id: 2, title: 'Kapitel 2: Brandverhütung' },
  { id: 3, title: 'Kapitel 3: Flucht- und Rettungswege' },
];

router.get('/', (req, res) => {
  res.json(chapters);
});

export default router;

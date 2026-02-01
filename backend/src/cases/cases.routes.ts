import { Router } from 'express';

const router = Router();

// Endpoint to fetch all cases
router.get('/', (req, res) => {
  // Logic to fetch all cases
  res.json({ message: 'List of cases' });
});

// Endpoint to fetch a single case by ID
router.get('/:caseId', (req, res) => {
  const { caseId } = req.params;

  // Logic to fetch a specific case
  res.json({ message: `Details of case ${caseId}` });
});

export default router;
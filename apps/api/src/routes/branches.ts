import { Router } from 'express';
import {
  getBranches,
  createBranch,
  updateBranch,
} from '../controllers/branchController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, getBranches);
router.post('/', authenticate, createBranch);
router.put('/:id', authenticate, updateBranch);

export default router;

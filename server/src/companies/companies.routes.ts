import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import * as ctrl from './companies.controllers';

const router = Router();

router.use(authMiddleware);

router.post('/', ctrl.create);
router.get('/', ctrl.list);
router.get('/:id', ctrl.getById);
router.put('/:id', ctrl.update);
router.delete('/:id', ctrl.remove);

export default router;

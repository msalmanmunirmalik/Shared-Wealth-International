import { Router } from 'express';
import { NetworkController } from '../controllers/networkController.js';
import { authenticateToken } from '../middleware/auth.js';
import { generalLimiter } from '../middleware/rateLimit.js';
const router = Router();
router.get('/user', authenticateToken, generalLimiter, NetworkController.getUserNetwork);
router.post('/add', authenticateToken, generalLimiter, NetworkController.addToNetwork);
router.delete('/remove', authenticateToken, generalLimiter, NetworkController.removeFromNetwork);
router.get('/available', authenticateToken, generalLimiter, NetworkController.getAvailableCompanies);
export default router;
//# sourceMappingURL=networks.js.map
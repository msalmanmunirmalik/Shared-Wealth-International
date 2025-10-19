import express from 'express';
import { UserProfileController } from '../controllers/userProfileController.js';
import { authenticateToken } from '../middleware/auth.js';
import { generalLimiter } from '../middleware/rateLimit.js';
const router = express.Router();
router.get('/profile', authenticateToken, generalLimiter, UserProfileController.getUserProfile);
router.put('/profile', authenticateToken, generalLimiter, UserProfileController.updateUserProfile);
router.get('/companies', authenticateToken, generalLimiter, UserProfileController.getUserCompanies);
router.get('/team', generalLimiter, UserProfileController.getTeamMembers);
export default router;
//# sourceMappingURL=userProfile.js.map
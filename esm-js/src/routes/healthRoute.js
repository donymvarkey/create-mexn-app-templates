import { Router } from 'express';
import { healthController } from '../controllers/healthController.js';
const router = Router();

/**
 * @openapi
 * '/api/v1/health':
 *  get:
 *     tags:
 *     - Health
 *     summary: Server Health
 *     responses:
 *      200:
 *        description: Server running
 */
router.get('/', healthController);

export default router;

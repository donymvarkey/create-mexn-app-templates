import { Router } from 'express';
import { healthController } from '../controllers/HealthController.js';
const router = Router();

/**
 * @openapi
 * '/api/health':
 *  get:
 *     tags:
 *     - Health
 *     summary: Server Health
 *     responses:
 *      200:
 *        description: Server running
 */
router.get('/', async (req, res) => {
  await healthController(req, res);
});

export default router;

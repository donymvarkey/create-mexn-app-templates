const express = require('express');
const { healthController } = require('../controllers/healthController');
const router = express.Router();

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

module.exports = router;

// routes/authRoutes.js
const express = require('express');
const { loginUser } = require('../controllers/authControllers');
const { body } = require('express-validator');
const validateRequest = require('../middleware/validateRequest');

const router = express.Router();

// POST /api/login
router.post(
  '/login', 
  [
    body('email').isEmail().withMessage('Enter a valid email'),
    body('password').notEmpty().withMessage('Password is required')
  ],
  validateRequest,       
  loginUser             
);

module.exports = router;

const express = require('express');
const router  = express.Router();

const { registerEmployee, loginEmployee, getEmployeeProfile } = require('../../controllers/Employeeauthcontroller/Employeeauthcontroller');

// ── Import from ONE shared middleware file ────────────────────────────────────
const {
    protect,
    isEmployee,
    verifyEmployeeExists,
} = require('../../Middleware/rolemiddleware');

// ── Public routes ─────────────────────────────────────────────────────────────
router.post('/employee/register', registerEmployee);
router.post('/employee/login',    loginEmployee);

// ── Protected routes ──────────────────────────────────────────────────────────
router.get('/me',
    protect,           // 1. Verify JWT
    isEmployee,            // 2. Role must be 'employee' or 'admin'
    verifyEmployeeExists,  // 3. Employee must exist in DB
    getEmployeeProfile
);

module.exports = router;
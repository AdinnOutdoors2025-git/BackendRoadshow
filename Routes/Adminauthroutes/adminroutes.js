

const express = require('express');
const router  = express.Router();

const { registerAdmin, loginAdmin, getAdminProfile } = require('../../controllers/Adminauthcontroller/admincontroller');

// ── Import from ONE shared middleware file ────────────────────────────────────
const {
    protect,
    isAdmin,
    verifyAdminExists,
} = require('../../Middleware/rolemiddleware');

// ── Public routes ─────────────────────────────────────────────────────────────
router.post('/register-admin', registerAdmin);
router.post('/admin',          loginAdmin);

// ── Protected routes ──────────────────────────────────────────────────────────
router.get('/me',
    protect,        // 1. Verify JWT
    isAdmin,            // 2. Role must be 'admin'
    verifyAdminExists,  // 3. Admin must exist in DB
    getAdminProfile
);

module.exports = router;
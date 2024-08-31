const express = require('express');
const router = express();
const { index } = require('./controllers');
const { authenticateUser, authorizeRoles } = require('../../../middleware/auth'); 


router.get('/orders', authenticateUser, authorizeRoles('organizer', 'admin', 'owner'), index);
module.exports = router;
const express = require('express');
const router = express();
const { createCMSOrganizer, createCMSUser, getCMSUsers } = require('./controllers');
const { authenticateUser, authorizeRoles } = require('../../../middleware/auth'); 



router.post('/organizers', authenticateUser, authorizeRoles('owner'), createCMSOrganizer);
router.post('/users',authenticateUser, authenticateUser, authorizeRoles('organizer'), createCMSUser);
router.get('/users',authenticateUser, authenticateUser, authorizeRoles('owner'), getCMSUsers);


module.exports = router;

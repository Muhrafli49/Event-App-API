const express = require('express');
const router = express();
const { createCMSOrganizer, createCMSUser } = require('./controllers');
const { authenticateUser } = require('../../../middleware/auth'); 


router.post('/organizers', createCMSOrganizer);
router.post('/users',authenticateUser, createCMSUser);

module.exports = router;

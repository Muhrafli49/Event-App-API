const express = require('express');
const router = express();
const { create, index, update, find, destroy, changeStatus } = require('./controllers');
const { authenticateUser, authorizeRoles } = require('../../../middleware/auth'); 


router.post('/events', authenticateUser, authorizeRoles('organizer'), create);
router.get('/events', authenticateUser, authorizeRoles('organizer'), index);
router.get('/events/:id', authenticateUser, authorizeRoles('organizer'), find);
router.put('/events/:id', authenticateUser, authorizeRoles('organizer'), update);
router.delete('/events/:id', authenticateUser, authorizeRoles('organizer'), destroy);
router.put('/events/:id/status', authenticateUser, authorizeRoles('organizer'), changeStatus);

module.exports = router;
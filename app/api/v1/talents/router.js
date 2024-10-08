const express = require('express');
const router = express();
const { create, index, update, find, destroy } = require('./controllers');
const { authenticateUser, authorizeRoles } = require('../../../middleware/auth'); 


router.post('/talents', authenticateUser, authorizeRoles('organizer'), create);
router.get('/talents', authenticateUser, authorizeRoles('organizer'), index);
router.get('/talents/:id', authenticateUser, authorizeRoles('organizer'), find);
router.put('/talents/:id', authenticateUser, authorizeRoles('organizer'), update);
router.delete('/talents/:id', authenticateUser, authorizeRoles('organizer'), destroy);

module.exports = router;
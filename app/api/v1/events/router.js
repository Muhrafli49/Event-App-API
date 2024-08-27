const express = require('express');
const router = express();
const { create, index, update, find, destroy } = require('./controllers');

router.post('/events', create);
router.get('/events', index);
router.get('/events/:id', find);
router.put('/events/:id', update);
router.delete('/events/:id', destroy);

module.exports = router;
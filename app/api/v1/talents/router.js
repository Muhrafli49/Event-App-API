const express = require('express');
const router = express();
const { create, index, update, find, destroy } = require('./controllers');


router.post('/talents', create);
router.get('/talents', index);
router.get('/talents/:id', find);
router.put('/talents/:id', update);
router.delete('/talents/:id', destroy);

module.exports = router;
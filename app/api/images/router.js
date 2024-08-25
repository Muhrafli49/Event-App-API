const express = require('express');
const router = express();
const { create } = require('./controllers');

const upload = require('../../middleware/multer');

router.post('/images',upload.single('avatar'), create);

module.exports = router;

const express = require('express');
const router = express();
const { signinCms } = require('./controllers');


router.post('/auth/signin', signinCms);


module.exports = router;

const express = require('express');
const router = express.Router();
const apiController = require('../controllers/apiController');


router.get("/countActiveUSer", apiController.countActiveUsers);


module.exports = router;
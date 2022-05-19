var express = require('express');
var router = express.Router();
const {
  refreshToken
} = require('../controllers/RefreshToken.js')
const {
  verifyToken
} = require('../middleware/VerifyToken.js')
const  { 
    Logout, getUsers
} = require('../controllers/Users.js')


router.get('/', verifyToken, getUsers);
router.delete('/logout', verifyToken, Logout);
router.get('/token', refreshToken);

module.exports = router;

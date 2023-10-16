const express = require('express');
const router = express.Router()
const userController = require('../controllers/userController.js');
const {profileImage} = require('../middlewares/fileUserMiddleware.js');
const {logged, adminAcces} = require('../middlewares/authMiddleware.js');

router.get("/signinForm",userController.signinForm);
router.get("/login",userController.loginForm);
router.post("/signinProcess",userController.signinProcess);
router.post("/login",userController.loginProcess);
router.get("/createUser",userController.createUser);
router.get("/logout", logged, userController.logout);
router.post("/editActiveDataUser", logged, profileImage.single('imagen'),userController.editActiveDataUser);
router.patch("/changePassword", logged, userController.changePassword);
router.delete("/disableUserAndProfileImage/:userID", logged, userController.disableUserAndProfileImage);
router.get("/getEditUserDataById/:userID", logged, userController.getEditUserDataById);
router.get("/changePasswordForm", logged, userController.changePasswordForm);
router.get("/getUserProfil", logged, userController.getUserProfil);
router.get("/allUserData", logged, adminAcces, userController.allUserData);

module.exports = router;

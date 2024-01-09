const express = require("express");
const {
    getRegisterUserView,
    getLoginUserView,
    getUserList,
    register,
    login
} = require("../controllers/userController");

const router = express.Router();

// /user/register
router.route("/register").get(getRegisterUserView).post(register);

// /user/login
router.route("/login").get(getLoginUserView).post(login);

// /user/users
router.route("/users").get(getUserList);

module.exports = router;
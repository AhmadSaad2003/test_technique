const asyncHandler = require("express-async-handler");
const { User, validateLoginUser, validateRegisterUser } = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

/**
 *  @desc    Get register user view
 *  @route   /user/register
 *  @method  GET
 *  @access  public
 */
module.exports.getRegisterUserView = asyncHandler((req, res) => {
    res.render("Register", { errorMessage: '', formData: {} });
});

/**
 *  @desc    Create user
 *  @route   /user/register
 *  @method  POST
 *  @access  public
 */
module.exports.register = asyncHandler(async (req, res) => {
    const { error } = validateRegisterUser(req.body);
    if (error) {
        return res.render("Register", { errorMessage: error.details[0].message, formData: req.body });
    }

    let user = await User.findOne({ email: req.body.email });
    if (user) {
        return res.render("Register", { errorMessage: "This user is already registered", formData: req.body });
    }

    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, salt);

    user = new User({
        email: req.body.email,
        password: req.body.password,
    });

    const result = await user.save();
    res.redirect('http://localhost:8000/user/login');
});

/**
 *  @desc    Get login user view
 *  @route   /user/login
 *  @method  GET
 *  @access  public
 */
module.exports.getLoginUserView = asyncHandler((req, res) => {
    res.render("Login", { errorMessage: '', formData: {} });
});

/**
 *  @desc    Login
 *  @route   /user/login
 *  @method  POST
 *  @access  public
 */
module.exports.login = asyncHandler(async (req, res) => {
    const { error } = validateLoginUser(req.body);
    if (error) {
        return res.render("Login", { errorMessage: error.details[0].message, formData: req.body });
    }

    let user = await User.findOne({ email: req.body.email });
    if (!user) {
        return res.render("Login", { errorMessage: "Invalid password or email", formData: req.body });
    }

    const isPasswordMatch = await bcrypt.compare(req.body.password, user.password);

    if (!isPasswordMatch) {
        return res.render("Login", { errorMessage: "Invalid password or email", formData: req.body });
    }
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRETKEY);
    //res.cookie('jwt', token);
    res.redirect('http://localhost:8000/user/users');
});

/**
 *  @desc    Get userlist view
 *  @route   /user/userlist
 *  @method  GET
 *  @access  public
 */
module.exports.getUserList = asyncHandler(async (req, res) => {
    /*const token = req.cookies.jwt;

    if (!token) {
        return res.status(401).render("Login", { errorMessage: "Unauthorized access",formData: {} });
    }

    jwt.verify(token, process.env.JWT_SECRETKEY,async (err, user) => {
        if (err) {
            return res.status(403).render("Login", { errorMessage: "Invalid token",formData: {} });
        }*/

        const userslist = await User.find().select("-password");
        res.render("UserList", { users: userslist });
    //});
});
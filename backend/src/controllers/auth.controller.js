/**
 * controllers/auth.controller.js - Authentication logic
 * Handles register, login, and profile retrieval.
 */

const User = require("../models/User");
const generateToken = require("../utils/generateToken");

// ─── @desc    Register a new user
// ─── @route   POST /api/auth/register
// ─── @access  Public
const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Basic field validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide name, email, and password",
      });
    }

    // Check if email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "An account with that email already exists",
      });
    }

    // Create user — password is hashed automatically via pre-save hook
    const newUser = await User.create({ name, email, password });

    // Notify admins about new registration
    const { onUserRegistered } = require("../utils/notificationHelper");
    onUserRegistered({ newUserName: name, triggeredById: newUser._id.toString() }).catch(() => {});

    res.status(201).json({
      success: true,
      message: "User registered successfully",
    });
  } catch (error) {
    next(error);
  }
};

// ─── @desc    Login user and return JWT
// ─── @route   POST /api/auth/login
// ─── @access  Public
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Basic field validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }

    // Fetch user and explicitly include the password field (select: false by default)
    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Generate signed JWT
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      token,
      user: user.toPublicJSON(),
    });
  } catch (error) {
    next(error);
  }
};

// ─── @desc    Get authenticated user's profile
// ─── @route   GET /api/auth/profile
// ─── @access  Private (requires Bearer token)
const getProfile = async (req, res, next) => {
  try {
    // req.user is set by the protect middleware
    res.status(200).json({
      success: true,
      user: req.user.toPublicJSON(),
    });
  } catch (error) {
    next(error);
  }
};

// ─── @desc    Change password (authenticated user)
// ─── @route   PUT /api/auth/change-password
// ─── @access  Private
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'currentPassword and newPassword are required' })
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'New password must be at least 6 characters' })
    }

    const user = await User.findById(req.user._id).select('+password')
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }

    const isMatch = await user.matchPassword(currentPassword)
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Current password is incorrect' })
    }

    user.password = newPassword // pre-save hook will hash it
    await user.save()

    res.status(200).json({ success: true, message: 'Password changed successfully' })
  } catch (error) {
    next(error)
  }
}

module.exports = { register, login, getProfile, changePassword }

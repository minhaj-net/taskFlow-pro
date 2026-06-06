/**
 * models/User.js - Mongoose User model
 * Handles password hashing automatically via pre-save hook.
 */

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [50, "Name cannot exceed 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false, // Never return password in queries by default
    },
    role: {
      type: String,
      enum: ["admin", "manager", "member"],
      default: "member",
    },
    avatar: {
      type: String,
      default: null,
    },
    department: {
      type: String,
      trim: true,
      default: '',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);

// ─── Pre-save Hook: Hash password before saving ───────────────────────────────

userSchema.pre("save", async function (next) {
  // Only hash if the password field was modified (or is new)
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ─── Instance Method: Compare plaintext password with hash ───────────────────

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// ─── Instance Method: Return user object without sensitive fields ─────────────

userSchema.methods.toPublicJSON = function () {
  return {
    _id: this._id,
    id: this._id.toString(),
    name: this.name,
    email: this.email,
    role: this.role,
    avatar: this.avatar ?? null,
    department: this.department ?? '',
    joinedAt: this.createdAt ? new Date(this.createdAt).toISOString() : new Date().toISOString(),
    isActive: true,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

const User = mongoose.model("User", userSchema);

module.exports = User;

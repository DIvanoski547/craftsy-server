const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required."],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/\S+@\S+\.\S+/, "Please use a valid email address."],
    },
    password: {
      type: String,
      required: [true, "Password is required."],
      minLength: [5, "Password must be at least 5 characters long."],
    },
    username: {
      type: String,
      required: [true, "Username is required."],
      minLength: [5, "Username must be at least 5 characters long."],
      maxLength: [15, "Username cannot exceed 15 characters."],
      unique: [true, 'Username already taken'],
      trim: true,
    },
    role: {
      type: String,
      default: "client",
      enum: ["admin", "client"],
    },
  },
  {
    timestamps: true,
  }
);

const User = model("User", userSchema);

module.exports = User;

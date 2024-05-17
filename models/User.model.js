const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required."],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required."],
      minLength: 5,
    },
    username: {
      type: String,
      required: [true, "Username is required."],
      unique: true,
      trim: true,
      minLength: 5,
      maxLength: 15,
      message: "Username already taken"
    },
    role: {
      type: String,
      default: "client",
      enum: ["admin","client"]
    },
  },
  {
    timestamps: true,
  }
);

const User = model("User", userSchema);

module.exports = User;

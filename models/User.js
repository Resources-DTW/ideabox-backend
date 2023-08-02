const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    age: { type: Number, required: true },
    mobilenumber: { type: Number, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isClinician: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);

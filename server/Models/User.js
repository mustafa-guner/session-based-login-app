const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const hashsedPassword = await bcrypt.hash(this.password, 10);
    this.password = hashsedPassword;

    return next();
  } catch (err) {
    console.log(err);
  }
});

UserSchema.methods.comparePasswords = function (password) {
  return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model("User", UserSchema);

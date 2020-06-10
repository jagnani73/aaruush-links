const { Schema, model } = require("mongoose");
const adminSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

module.exports = {
  adminModel: model("admin", adminSchema),
};

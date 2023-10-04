const mongoose = require("mongoose");

const WhquestSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    quest_title: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    questions: [
      {
        text: {
          type: String,
          required: true,
        },
        imageUrl: {
          type: String,
        },
        isCorrect: {
          type: Boolean,
          required: true,
          default: false,
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Whquest", WhquestSchema);

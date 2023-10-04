const Whquest = require("../models/Whquest");

module.exports = {
  //create a new wh question
  createQuest: async (req, res) => {
    const newWhquest = new Whquest(req.body);
    try {
      await newWhquest.save();
      res.status(200).json("Wh Question Created successfully");
    } catch (error) {
      res.status(500).json("Failed to create Wh Question!");
    }
  },

  //get all wh questions
  getAllQuest: async (req, res) => {
    try {
      const WhQ = await Whquest.find();
      return res.status(200).json(WhQ);
    } catch (error) {
      return res.status(500).json("Failed to get all wh questions!");
    }
  },

  //get one wh question
  getQuest: async (req, res) => {
    try {
      const _id = req.params.id;

      const question = await Whquest.findOne({ _id });
      if (!question) {
        return res.status(404).json({});
      } else {
        return res.status(200).json(question);
      }
    } catch (error) {
      return res.status(500).json({ Error: error });
    }
  },

  //update one wh question
  updateQuest: async (req, res) => {
    try {
      const _id = req.params.id;
      const { title, description, quest_title, imageUrl, questions } = req.body;
      let question = await Whquest.findOne({ _id });

      if (!question) {
        question = await Whquest.create({
          title,
          description,
          quest_title,
          imageUrl,
          questions,
        });
        return res.status(201).json(question);
      } else {
        question.title = title;
        question.description = description;
        question.quest_title = quest_title;
        question.imageUrl = imageUrl;
        question.questions = questions;

        await question.save();
        return res.status(200).json(question);
      }
    } catch (error) {
      return res.status(500).json({ Error: error });
    }
  },

  //delete one wh question
  deleteQuest: async (req, res) => {
    try {
      const _id = req.params.id;

      const question = await Whquest.deleteOne({ _id });

      if (question.deleteCount === 0) {
        return res.status(404).json();
      } else {
        return res.status(200).json("Question deleted successfully");
      }
    } catch (error) {
      return res.status(500).json({ Error: error });
    }
  },
};

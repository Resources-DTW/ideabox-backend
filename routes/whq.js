const router = require("express").Router();
const whqController = require("../controllers/whqController");

router.post("/add", whqController.createQuest);
router.get("/", whqController.getAllQuest);
router.get("/:id", whqController.getQuest);
router.put("/:id", whqController.updateQuest);
router.delete("/:id", whqController.deleteQuest);

module.exports = router;

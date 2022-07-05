const msgControllers = require("../controllers/msg-controllers");
const authCheck = require("../middle-wares/auth-check");

const router = require("express").Router();
const { check } = require("express-validator");

router.use(authCheck);

router.post(
  "/add-msg",
  [check("msg").not().isEmpty(), check("toUsers").not().isEmpty()],
  msgControllers.addMsg
);

router.post("/get-msgs", msgControllers.getMsgs);

router.post("/del-msgs", msgControllers.removeUnreadMsgs);

router.post(
  "/unread-msgs",
  [check("msg").not().isEmpty(), check("from").not().isEmpty()],
  msgControllers.addUnreadMsgs
);

module.exports = router;

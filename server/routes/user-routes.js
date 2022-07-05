const userControllers = require("../controllers/user-controllers");
const authCheck = require("../middle-wares/auth-check");

const router = require("express").Router();
const { check } = require("express-validator");

router.post(
  "/signup",
  [
    check("name").not().isEmpty(),
    check("email").normalizeEmail().isEmail(),
    check("username").isLength({ min: 3 }),
    check("password").isLength({ min: 8 }),
  ],
  userControllers.signUp
);

router.post("/login", userControllers.login);

router.post("/get-usernames", userControllers.getUserNames);

router.post(
  "/forget-password",
  [check("email").normalizeEmail().isEmail()],
  userControllers.forgetPassword
);

router.post("/verify-reset", userControllers.verifyResetToken);

router.post(
  "/reset-password",
  [check("newPassword").isLength({ min: 8 })],
  userControllers.resetPassword
);

router.use(authCheck);
router.post(
  "/set-avatar",
  [check("avatar").not().isEmpty()],
  userControllers.setAvatar
);

router.post(
  "/add-friend",
  [check("friendID").not().isEmpty()],
  userControllers.addFriend
);

router.post("/get-friends", userControllers.getFriends);

router.post(
  "/delete-friend",
  [check("friendID").not().isEmpty()],
  userControllers.deleteFriend
);

router.post("/get-users", userControllers.getUsers);

router.post("/del-account", userControllers.delUser);

router.post(
  "/new-pass",
  [check("newPassword").isLength({ min: 8 })],
  userControllers.changePassword
);

module.exports = router;

import express from "express";
import passport from "passport";
import userController from "./controller/userController";
const router = express.Router();
const auth = passport.authenticate("jwt", { session: false });

router.get("/", (req, res, next) => {
  res.send("<h1>This is backend</h1>");
});

// User api call
router.get("/user", auth, userController.get_user);
router.put("/user", auth, userController.edit_user);
router.post("/user", userController.create_user);
router.delete("/user", auth, userController.delete_user);
router.post("user/logIn", userController.log_in);
router.put("user/change_password", auth, userController.change_password);
router.post("user/forgot_password", userController.forgot_password_reset);
router.put("user/reset_password", userController.password_reset);

export default router;

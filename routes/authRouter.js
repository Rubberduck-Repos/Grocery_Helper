const { Router } = require("express");

const authRouter = Router();
const authController = require("../controllers/authController")

authRouter.get("/sign-up", (req, res) => res.render("sign-up-form"));

authRouter.post("/sign-up", authController.signupPost);

authRouter.post("/log-in", authController.loginPost);

authRouter.get("/log-out", authController.logoutGet);

module.exports = authRouter;
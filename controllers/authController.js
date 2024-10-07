const db = require("../db/queries");
const passport = require("../passport");
const bcrypt = require("bcryptjs");
const { body, validationResult} = require("express-validator");

const alphaErr = "must only contain letters.";
const lengthErr = "must be between 1 and 15 characters.";

const validateUser = [
    body('firstName').trim()
        .isAlpha().withMessage(`First name ${alphaErr}`)
        .isLength({ min: 1, max: 15 }).withMessage(`First name ${lengthErr}`),
    body("lastName").trim()
        .isAlpha().withMessage(`Last name ${alphaErr}`)
        .isLength({ min: 1, max: 15 }).withMessage(`Last name ${lengthErr}`),
    body("email").trim()
        .isEmail().withMessage(`Email must be a valid email.`)
        .custom(async value => {
            const user = await db.findUserByEmail(value);
            if (user) {
                throw new Error('Email already in use');
            }
        }),
    body('password').isLength({ min: 5 }),
    body('confirmPassword')
        .custom((value, { req }) => {return value === req.body.password;})
        .withMessage(`Passwords must match`)
];

const signupPost = [
    validateUser,
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).render("sign-up-form", {
            errors: errors.array(),
          });
        }
        const { firstName, lastName, password, email } = req.body;
        bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
            if (err) {
                return next(err);
            }
            
            await db.addUser(firstName, lastName, email, hashedPassword, false)
        });
        res.redirect("/");
      }
];

function loginPost(req, res, next){
    passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/"
    })(req, res, next);
}

function logoutGet(req, res, next) {
    req.logout((err) => {
      if (err) {
        return next(err);
      }
      res.redirect("/");
    });
}

module.exports = {
    signupPost,
    loginPost,
    logoutGet
}
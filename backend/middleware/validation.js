const { body, validationResult } = require("express-validator");

// Validation middleware for registration
const validateRegister = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please enter a valid email"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters")
    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/)
    .withMessage(
      "Password must contain at least one uppercase letter, one lowercase letter, and one number",
    ),
  body("name").trim().notEmpty().withMessage("Name is required"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }
    next();
  },
];

// Validation middleware for login
const validateLogin = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please enter a valid email"),
  body("password").notEmpty().withMessage("Password is required"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }
    next();
  },
];

// Validation middleware for website URL
const validateWebsiteUrl = [
  body("websiteUrl")
    .isURL({ protocols: ["http", "https"], require_protocol: true })
    .withMessage("Please enter a valid URL with http:// or https://"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }
    next();
  },
];

// Validation middleware for content generation
const validateContentGeneration = [
  body("businessId")
    .notEmpty()
    .isMongoId()
    .withMessage("Valid business ID is required"),
  body("prompt")
    .trim()
    .notEmpty()
    .withMessage("Prompt is required")
    .isLength({ min: 5, max: 500 })
    .withMessage("Prompt must be between 5 and 500 characters"),
  body("platforms")
    .isArray({ min: 1 })
    .withMessage("At least one platform is required"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }
    next();
  },
];

module.exports = {
  validateRegister,
  validateLogin,
  validateWebsiteUrl,
  validateContentGeneration,
};

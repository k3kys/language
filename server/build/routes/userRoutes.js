"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var middlewares_1 = require("../middlewares");
var express_1 = __importDefault(require("express"));
var express_validator_1 = require("express-validator");
var authController = __importStar(require("../controllers/authControllers"));
var router = express_1.default.Router();
router.route("/signin/").post([
    express_validator_1.body("email")
        .isEmail()
        .withMessage("Email must be valid"),
    express_validator_1.body("password")
        .trim()
        .notEmpty()
        .withMessage("Yout must supply a password")
], middlewares_1.validateRequest, authController.signin);
router.route("/signup/").post([
    express_validator_1.body("email")
        .isEmail()
        .withMessage("Email must be valid"),
    express_validator_1.body("password")
        .trim()
        .isLength({ min: 4, max: 20 })
        .withMessage("Password must be between 4 and 20 charcters"),
    express_validator_1.body("confirmPassword")
        .trim()
        .isLength({ min: 4, max: 20 })
        .withMessage("confirmPassword must be between 4 and 20 charcters")
], middlewares_1.validateRequest, authController.signup);
router.route("/send-email").post([
    express_validator_1.body("email")
        .isEmail()
        .contains("ac.kr")
        .withMessage("must ac.kr"),
], middlewares_1.validateRequest, authController.sendEmail);
router.route("/signout").post(authController.signout);
router.route("/currentuser").get(middlewares_1.currentUser, authController.currentUser);
router.route('/forgotPassword').post();
router.route("/resetPassword/:token").patch();
router.route("/").get();
router
    .route("/:id")
    .get()
    .patch()
    .delete();
exports.default = router;

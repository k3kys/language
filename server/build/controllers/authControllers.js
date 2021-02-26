"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = exports.resetPassword = exports.forgotPassword = exports.currentUser = exports.signout = exports.signin = exports.signup = void 0;
var services_1 = require("../services");
var errors_1 = require("../errors");
var user_1 = require("../models/user");
var middlewares_1 = require("../middlewares");
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var http_status_codes_1 = require("http-status-codes");
var generateRandom = function (min, max) {
    var ranNum = Math.floor(Math.random() * (max - min + 1)) + min;
    return ranNum;
};
var generateToken = function (id, email) {
    return jsonwebtoken_1.default.sign({ id: id, email: email }, 
    //@ts-ignore
    process.env.JWT_KEY, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};
var createSendToken = function (user, statusCode, req, res) {
    var token = generateToken(user.id, user.email);
    //@ts-ignore
    var expiration = new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000);
    var cookieOptions = {
        expires: expiration,
        httpOnly: true,
        secure: req.secure || req.headers['x-forwarded-proto'] === 'https'
    };
    res.cookie('jwt', token, cookieOptions);
    if (user.password) {
        user.password = undefined;
    }
    res.status(statusCode).json({
        status: 'success',
        token: token,
        data: {
            user: user
        }
    });
};
exports.signup = middlewares_1.catchAsync(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, name, email, password, confirmPassword, university, existingUser, user;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, name = _a.name, email = _a.email, password = _a.password, confirmPassword = _a.confirmPassword, university = _a.university;
                return [4 /*yield*/, user_1.User.findOne({ email: email })];
            case 1:
                existingUser = _b.sent();
                if (existingUser) {
                    throw new errors_1.BadRequestError("사용중인 이메일 입니다.");
                }
                user = user_1.User.build({ name: name, email: email, password: password, confirmPassword: confirmPassword, university: university });
                return [4 /*yield*/, user.save()];
            case 2:
                _b.sent();
                createSendToken(user, http_status_codes_1.StatusCodes.CREATED, req, res);
                return [2 /*return*/];
        }
    });
}); });
exports.signin = middlewares_1.catchAsync(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, password, existingUser, passwordsMatch;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, email = _a.email, password = _a.password;
                return [4 /*yield*/, user_1.User.findOne({ email: email }).select('+password')];
            case 1:
                existingUser = _b.sent();
                if (!existingUser) {
                    throw new errors_1.BadRequestError("Invalid credentials");
                }
                return [4 /*yield*/, user_1.User.correctPassword(password, existingUser.password)];
            case 2:
                passwordsMatch = _b.sent();
                if (!passwordsMatch) {
                    throw new errors_1.BadRequestError("Invalid credentials");
                }
                createSendToken(existingUser, http_status_codes_1.StatusCodes.OK, req, res);
                return [2 /*return*/];
        }
    });
}); });
exports.signout = (function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        res.cookie('jwt', 'loggedout', {
            expires: new Date(Date.now() + 10 * 1000),
            httpOnly: true
        });
        res.status(http_status_codes_1.StatusCodes.OK).json({ status: 'success' });
        return [2 /*return*/];
    });
}); });
exports.currentUser = (function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        res.send({ currentUser: req.currentUser || null });
        return [2 /*return*/];
    });
}); });
exports.forgotPassword = (function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/];
    });
}); });
exports.resetPassword = (function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/];
    });
}); });
exports.sendEmail = middlewares_1.catchAsync(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var number, email, message, gmail;
    return __generator(this, function (_a) {
        number = generateRandom(111111, 999999);
        email = req.body.email;
        message = "오른쪽 숫자 6자리를 입력해주세요 : " + number;
        gmail = new services_1.Gmailer();
        gmail.sendMessage({
            email: email,
            subject: "웹메일 인증",
            message: message
        });
        res.status(http_status_codes_1.StatusCodes.OK).json({
            data: {
                number: number, email: email
            }
        });
        return [2 /*return*/];
    });
}); });

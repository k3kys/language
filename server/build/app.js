"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
var errors_1 = require("./errors");
var middlewares_1 = require("./middlewares");
var express_1 = __importDefault(require("express"));
var cookie_parser_1 = __importDefault(require("cookie-parser"));
var userRoutes_1 = __importDefault(require("./routes/userRoutes"));
var app = express_1.default();
exports.app = app;
app.use(express_1.default.json());
app.use(cookie_parser_1.default());
app.use("/api/test", function (req, res) {
    res.send("hi");
});
app.use("/api/users", userRoutes_1.default);
app.get("*", function (req, res) {
    throw new errors_1.NotFoundError();
});
app.use(middlewares_1.errorHandler);

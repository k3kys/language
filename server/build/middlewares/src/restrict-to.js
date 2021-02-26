"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.restrictTo = void 0;
var errors_1 = require("./../../errors/");
var restrictTo = function () {
    var roles = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        roles[_i] = arguments[_i];
    }
    return function (req, res, next) {
        if (!roles.includes(req.currentUser.role)) {
            throw new errors_1.BadRequestError("You do not have permission to perform this action");
        }
        next();
    };
};
exports.restrictTo = restrictTo;

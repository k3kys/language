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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Emailer = void 0;
var nodemailer = __importStar(require("nodemailer"));
var Emailer = /** @class */ (function () {
    function Emailer(service_name, mail_host, mail_port, secure_bool, mail_user, mail_password) {
        this.service_name = service_name;
        this.mail_host = mail_host;
        this.mail_port = mail_port;
        this.secure_bool = secure_bool;
        this.mail_user = mail_user;
        this.mail_password = mail_password;
        this.transporter = nodemailer.createTransport({
            service: service_name,
            host: mail_host,
            port: mail_port,
            secure: secure_bool,
            auth: {
                user: mail_user,
                pass: mail_password,
            },
        });
    }
    return Emailer;
}());
exports.Emailer = Emailer;

"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
// src/utils/email.ts
const nodemailer = __importStar(require("nodemailer"));
const config_1 = require("../config");
const logger_1 = __importDefault(require("../config/logger"));
const sendEmail = async (options) => {
    try {
        // Create a transporter
        const transporter = nodemailer.createTransport({
            host: config_1.config.email.host,
            port: config_1.config.email.port,
            secure: config_1.config.email.secure,
            auth: {
                user: config_1.config.email.user,
                pass: config_1.config.email.password,
            },
        });
        // Define email options
        const mailOptions = {
            from: `${config_1.config.email.fromName} <${config_1.config.email.fromEmail}>`,
            to: options.to,
            subject: options.subject,
            text: options.text,
            html: options.html,
        };
        // Send email
        await transporter.sendMail(mailOptions);
        logger_1.default.info(`Email sent to ${options.to}`);
    }
    catch (error) {
        logger_1.default.error('Error sending email:', error);
        throw new Error('Email could not be sent');
    }
};
exports.sendEmail = sendEmail;
//# sourceMappingURL=email.js.map
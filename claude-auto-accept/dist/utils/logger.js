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
exports.Logger = void 0;
const winston_1 = __importDefault(require("winston"));
const path = __importStar(require("path"));
const fs = __importStar(require("fs-extra"));
class Logger {
    constructor() {
        this.ensureLogDirectories();
        this.logger = this.createMainLogger();
        this.auditLogger = this.createAuditLogger();
    }
    static getInstance() {
        if (!Logger.instance) {
            Logger.instance = new Logger();
        }
        return Logger.instance;
    }
    ensureLogDirectories() {
        const logsDir = path.join(process.cwd(), 'logs');
        fs.ensureDirSync(logsDir);
    }
    createMainLogger() {
        return winston_1.default.createLogger({
            level: process.env.LOG_LEVEL || 'info',
            format: winston_1.default.format.combine(winston_1.default.format.timestamp(), winston_1.default.format.errors({ stack: true }), winston_1.default.format.colorize(), winston_1.default.format.printf(({ timestamp, level, message, stack }) => {
                return `${timestamp} ${level}: ${message} ${stack ? '\n' + stack : ''}`;
            })),
            transports: [
                new winston_1.default.transports.Console(),
                new winston_1.default.transports.File({
                    filename: path.join(process.cwd(), 'logs', 'auto-accept.log'),
                    maxsize: 10 * 1024 * 1024, // 10MB
                    maxFiles: 5
                })
            ]
        });
    }
    createAuditLogger() {
        return winston_1.default.createLogger({
            format: winston_1.default.format.combine(winston_1.default.format.timestamp(), winston_1.default.format.json()),
            transports: [
                new winston_1.default.transports.File({
                    filename: path.join(process.cwd(), 'logs', 'auto-accept-audit.log'),
                    maxsize: 50 * 1024 * 1024, // 50MB
                    maxFiles: 10
                })
            ]
        });
    }
    info(message, meta) {
        this.logger.info(message, meta);
    }
    error(message, error) {
        this.logger.error(message, error);
    }
    warn(message, meta) {
        this.logger.warn(message, meta);
    }
    debug(message, meta) {
        this.logger.debug(message, meta);
    }
    audit(entry) {
        this.auditLogger.info('audit', entry);
        this.info(`AUDIT: ${entry.operation} - ${entry.decision} - ${entry.reason}`);
    }
    getAuditLogs(limit = 100) {
        return new Promise((resolve, reject) => {
            const auditLogPath = path.join(process.cwd(), 'logs', 'auto-accept-audit.log');
            if (!fs.existsSync(auditLogPath)) {
                resolve([]);
                return;
            }
            try {
                const content = fs.readFileSync(auditLogPath, 'utf8');
                const lines = content.split('\n').filter(line => line.trim());
                const entries = [];
                for (const line of lines.slice(-limit)) {
                    try {
                        const parsed = JSON.parse(line);
                        if (parsed.message === 'audit') {
                            entries.push(parsed.meta || parsed);
                        }
                    }
                    catch (error) {
                        // Skip invalid JSON lines
                    }
                }
                resolve(entries.reverse()); // Most recent first
            }
            catch (error) {
                reject(error);
            }
        });
    }
    clearAuditLogs() {
        const auditLogPath = path.join(process.cwd(), 'logs', 'auto-accept-audit.log');
        if (fs.existsSync(auditLogPath)) {
            fs.writeFileSync(auditLogPath, '');
            this.info('Audit logs cleared');
        }
    }
}
exports.Logger = Logger;
//# sourceMappingURL=logger.js.map
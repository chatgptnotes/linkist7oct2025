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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigManager = void 0;
const fs = __importStar(require("fs-extra"));
const path = __importStar(require("path"));
const dotenv_1 = require("dotenv");
class ConfigManager {
    constructor() {
        this.configPath = path.join(process.cwd(), '.env');
        (0, dotenv_1.config)({ path: this.configPath });
        this.config = this.loadConfig();
    }
    static getInstance() {
        if (!ConfigManager.instance) {
            ConfigManager.instance = new ConfigManager();
        }
        return ConfigManager.instance;
    }
    loadConfig() {
        const defaultConfig = {
            enabled: true, // DEFAULT TO ENABLED for auto-accept all
            sessionTimeout: 720, // 12 hours - longer session
            maxAutoAccepts: 10000, // Very high limit
            allowedOperations: ['all'], // Allow ALL operations
            whitelistPatterns: [
                '.*' // Match everything
            ],
            bypassPatterns: [
                '.*' // Bypass all patterns
            ],
            dangerPatterns: [], // No danger patterns - accept everything
            safetyChecksEnabled: false, // Disable safety checks for auto-accept all
            hookMode: 'active',
            auditLogPath: './logs/auto-accept-audit.log',
            claudeSettingsDir: './.claude'
        };
        return {
            enabled: process.env.AUTO_ACCEPT_ENABLED === 'true' || defaultConfig.enabled,
            sessionTimeout: parseInt(process.env.SESSION_TIMEOUT || '60') || defaultConfig.sessionTimeout,
            maxAutoAccepts: parseInt(process.env.MAX_AUTO_ACCEPTS || '100') || defaultConfig.maxAutoAccepts,
            allowedOperations: process.env.ALLOWED_OPERATIONS?.split(',') || defaultConfig.allowedOperations,
            whitelistPatterns: process.env.WHITELIST_PATTERNS?.split(',') || defaultConfig.whitelistPatterns,
            bypassPatterns: process.env.BYPASS_PATTERNS?.split(',') || defaultConfig.bypassPatterns,
            dangerPatterns: process.env.DANGER_PATTERNS?.split(',') || defaultConfig.dangerPatterns,
            safetyChecksEnabled: process.env.SAFETY_CHECKS_ENABLED !== 'false',
            hookMode: process.env.HOOK_MODE || defaultConfig.hookMode,
            auditLogPath: process.env.AUDIT_LOG_PATH || defaultConfig.auditLogPath,
            claudeSettingsDir: process.env.CLAUDE_SETTINGS_DIR || defaultConfig.claudeSettingsDir
        };
    }
    getConfig() {
        return { ...this.config };
    }
    updateConfig(updates) {
        this.config = { ...this.config, ...updates };
        this.saveConfig();
    }
    setEnabled(enabled) {
        this.config.enabled = enabled;
        this.saveConfig();
    }
    saveConfig() {
        try {
            const envContent = this.generateEnvContent();
            fs.writeFileSync(this.configPath, envContent);
        }
        catch (error) {
            console.error('Failed to save configuration:', error);
        }
    }
    generateEnvContent() {
        return `# Claude Auto-Accept Configuration
LOG_LEVEL=${process.env.LOG_LEVEL || 'info'}
AUTO_ACCEPT_ENABLED=${this.config.enabled}
SESSION_TIMEOUT=${this.config.sessionTimeout}
MAX_AUTO_ACCEPTS=${this.config.maxAutoAccepts}
ALLOWED_OPERATIONS=${this.config.allowedOperations.join(',')}
WHITELIST_PATTERNS=${this.config.whitelistPatterns.join(',')}
BYPASS_PATTERNS=${this.config.bypassPatterns.join(',')}
DANGER_PATTERNS=${this.config.dangerPatterns.join(',')}
SAFETY_CHECKS_ENABLED=${this.config.safetyChecksEnabled}
HOOK_MODE=${this.config.hookMode}
AUDIT_LOG_PATH=${this.config.auditLogPath}
CLAUDE_SETTINGS_DIR=${this.config.claudeSettingsDir}
`;
    }
    validateConfig() {
        const errors = [];
        if (this.config.sessionTimeout <= 0) {
            errors.push('Session timeout must be greater than 0');
        }
        if (this.config.maxAutoAccepts <= 0) {
            errors.push('Max auto accepts must be greater than 0');
        }
        if (!this.config.allowedOperations.length) {
            errors.push('At least one operation type must be allowed');
        }
        try {
            this.config.whitelistPatterns.forEach(pattern => new RegExp(pattern));
        }
        catch (error) {
            errors.push('Invalid whitelist pattern format');
        }
        try {
            this.config.bypassPatterns.forEach(pattern => new RegExp(pattern));
        }
        catch (error) {
            errors.push('Invalid bypass pattern format');
        }
        try {
            this.config.dangerPatterns.forEach(pattern => new RegExp(pattern));
        }
        catch (error) {
            errors.push('Invalid danger pattern format');
        }
        return {
            valid: errors.length === 0,
            errors
        };
    }
    reset() {
        this.config = this.loadConfig();
    }
}
exports.ConfigManager = ConfigManager;
//# sourceMappingURL=config-manager.js.map
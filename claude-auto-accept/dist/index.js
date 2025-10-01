#!/usr/bin/env node
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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfirmationInterceptor = exports.SecurityChecker = exports.Logger = exports.ConfigManager = exports.AutoAcceptAgent = exports.AutoAcceptSystem = void 0;
const auto_accept_command_1 = require("./commands/auto-accept-command");
const confirmation_interceptor_1 = require("./hooks/confirmation-interceptor");
const logger_1 = require("./utils/logger");
const config_manager_1 = require("./config/config-manager");
/**
 * Claude Code Auto-Accept System
 *
 * This system provides autonomous confirmation handling for Claude Code,
 * eliminating the need for manual user intervention during automated tasks.
 */
class AutoAcceptSystem {
    constructor() {
        this.logger = logger_1.Logger.getInstance();
        this.configManager = config_manager_1.ConfigManager.getInstance();
        this.command = new auto_accept_command_1.AutoAcceptCommand();
        this.interceptor = new confirmation_interceptor_1.ConfirmationInterceptor();
    }
    async initialize() {
        try {
            this.logger.info('Initializing Claude Code Auto-Accept System');
            // Validate configuration
            const validation = this.configManager.validateConfig();
            if (!validation.valid) {
                this.logger.error('Configuration validation failed', validation.errors);
                throw new Error(`Configuration errors: ${validation.errors.join(', ')}`);
            }
            // Activate interceptor if enabled
            const config = this.configManager.getConfig();
            if (config.enabled && config.hookMode === 'active') {
                this.interceptor.activate();
            }
            this.logger.info('Auto-Accept System initialized successfully');
        }
        catch (error) {
            this.logger.error('Failed to initialize Auto-Accept System', error);
            throw error;
        }
    }
    getCommand() {
        return this.command.createCommand();
    }
    getInterceptor() {
        return this.interceptor;
    }
    async shutdown() {
        this.logger.info('Shutting down Auto-Accept System');
        this.interceptor.deactivate();
    }
}
exports.AutoAcceptSystem = AutoAcceptSystem;
// Export main classes for programmatic use
var auto_accept_agent_1 = require("./agents/auto-accept-agent");
Object.defineProperty(exports, "AutoAcceptAgent", { enumerable: true, get: function () { return auto_accept_agent_1.AutoAcceptAgent; } });
var config_manager_2 = require("./config/config-manager");
Object.defineProperty(exports, "ConfigManager", { enumerable: true, get: function () { return config_manager_2.ConfigManager; } });
var logger_2 = require("./utils/logger");
Object.defineProperty(exports, "Logger", { enumerable: true, get: function () { return logger_2.Logger; } });
var security_checker_1 = require("./utils/security-checker");
Object.defineProperty(exports, "SecurityChecker", { enumerable: true, get: function () { return security_checker_1.SecurityChecker; } });
var confirmation_interceptor_2 = require("./hooks/confirmation-interceptor");
Object.defineProperty(exports, "ConfirmationInterceptor", { enumerable: true, get: function () { return confirmation_interceptor_2.ConfirmationInterceptor; } });
__exportStar(require("./types"), exports);
// CLI entry point
async function main() {
    try {
        const system = new AutoAcceptSystem();
        await system.initialize();
        const program = system.getCommand();
        // Handle graceful shutdown
        process.on('SIGINT', async () => {
            console.log('\nShutting down...');
            await system.shutdown();
            process.exit(0);
        });
        process.on('SIGTERM', async () => {
            await system.shutdown();
            process.exit(0);
        });
        // Parse command line arguments
        program.parse();
    }
    catch (error) {
        console.error('Fatal error:', error);
        process.exit(1);
    }
}
// Run CLI if this file is executed directly
if (require.main === module) {
    main().catch(error => {
        console.error('Unhandled error:', error);
        process.exit(1);
    });
}
//# sourceMappingURL=index.js.map
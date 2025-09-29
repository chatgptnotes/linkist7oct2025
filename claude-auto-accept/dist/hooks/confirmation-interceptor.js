"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfirmationInterceptor = void 0;
const auto_accept_agent_1 = require("../agents/auto-accept-agent");
const logger_1 = require("../utils/logger");
const uuid_1 = require("uuid");
class ConfirmationInterceptor {
    constructor() {
        this.isActive = false;
        this.agent = new auto_accept_agent_1.AutoAcceptAgent();
        this.logger = logger_1.Logger.getInstance();
    }
    activate() {
        if (this.isActive) {
            this.logger.warn('Confirmation interceptor already active');
            return;
        }
        this.isActive = true;
        this.setupHooks();
        this.logger.info('Confirmation interceptor activated');
    }
    deactivate() {
        if (!this.isActive) {
            this.logger.warn('Confirmation interceptor not active');
            return;
        }
        this.isActive = false;
        this.cleanupHooks();
        this.logger.info('Confirmation interceptor deactivated');
    }
    setupHooks() {
        // Hook into Claude Code's confirmation system
        if (typeof process !== 'undefined' && process.stdin) {
            this.interceptStdin();
        }
        // Hook into common confirmation patterns
        this.interceptConsoleInteractions();
    }
    cleanupHooks() {
        // Restore original functions if needed
        this.logger.debug('Cleaning up confirmation hooks');
    }
    interceptStdin() {
        const originalCreateInterface = require('readline').createInterface;
        const self = this;
        // Override readline interface creation
        require('readline').createInterface = function (options) {
            const rl = originalCreateInterface.call(this, options);
            const originalQuestionMethod = rl.question;
            rl.question = function (query, callback) {
                // Check if this looks like a confirmation request
                if (self.isConfirmationRequest(query)) {
                    self.handleConfirmationRequest(query, callback);
                }
                else {
                    originalQuestionMethod.call(this, query, callback);
                }
            };
            return rl;
        };
    }
    interceptConsoleInteractions() {
        // Intercept common confirmation patterns in console
        const originalLog = console.log;
        const self = this;
        console.log = function (...args) {
            const message = args.join(' ');
            if (self.isConfirmationRequest(message)) {
                // Don't log confirmation requests that we auto-handle
                if (self.shouldIntercept(message)) {
                    return;
                }
            }
            originalLog.apply(console, args);
        };
    }
    isConfirmationRequest(message) {
        const confirmationPatterns = [
            /do you want to proceed/i,
            /continue\?/i,
            /are you sure/i,
            /confirm/i,
            /\(y\/n\)/i,
            /\(yes\/no\)/i,
            /press.*to continue/i
        ];
        return confirmationPatterns.some(pattern => pattern.test(message));
    }
    shouldIntercept(message) {
        if (!this.isActive) {
            return false;
        }
        const status = this.agent.getSessionStatus();
        return status.active;
    }
    async handleConfirmationRequest(message, callback) {
        try {
            const request = {
                id: (0, uuid_1.v4)(),
                message: message.trim(),
                operation: this.extractOperation(message),
                timestamp: new Date(),
                riskLevel: 'medium'
            };
            this.logger.debug('Intercepted confirmation request', {
                requestId: request.id,
                message: request.message,
                operation: request.operation
            });
            const response = await this.agent.processConfirmationRequest(request);
            if (response.accepted) {
                this.logger.info('Auto-accepted confirmation', {
                    requestId: request.id,
                    reason: response.reason
                });
                callback('y'); // or 'yes' depending on expected format
            }
            else {
                this.logger.info('Confirmation requires manual input', {
                    requestId: request.id,
                    reason: response.reason
                });
                // Fall back to manual input
                this.requestManualInput(message, callback);
            }
        }
        catch (error) {
            this.logger.error('Error handling confirmation request', error);
            // Fall back to manual input on error
            this.requestManualInput(message, callback);
        }
    }
    requestManualInput(message, callback) {
        // Use the original readline interface for manual input
        const readline = require('readline');
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        rl.question(message + ' ', (answer) => {
            rl.close();
            callback(answer);
        });
    }
    extractOperation(message) {
        // Extract operation type from the confirmation message
        const operationPatterns = [
            { pattern: /git\s+(\w+)/i, type: 'git' },
            { pattern: /npm\s+(\w+)/i, type: 'npm' },
            { pattern: /(install|update|delete|remove)/i, type: 'package' },
            { pattern: /(create|mkdir|touch)/i, type: 'file_create' },
            { pattern: /(delete|rm|remove)/i, type: 'file_delete' },
            { pattern: /(deploy|push|publish)/i, type: 'deploy' }
        ];
        for (const { pattern, type } of operationPatterns) {
            if (pattern.test(message)) {
                return type;
            }
        }
        return 'unknown';
    }
    simulateConfirmation(message, operation = 'test') {
        const request = {
            id: 'sim-' + (0, uuid_1.v4)(),
            message,
            operation,
            timestamp: new Date(),
            riskLevel: 'medium'
        };
        return this.agent.processConfirmationRequest(request)
            .then(response => response.accepted);
    }
    getStatus() {
        return {
            active: this.isActive,
            agentStatus: this.agent.getSessionStatus()
        };
    }
}
exports.ConfirmationInterceptor = ConfirmationInterceptor;
//# sourceMappingURL=confirmation-interceptor.js.map
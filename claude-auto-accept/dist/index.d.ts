#!/usr/bin/env node
import { ConfirmationInterceptor } from './hooks/confirmation-interceptor';
/**
 * Claude Code Auto-Accept System
 *
 * This system provides autonomous confirmation handling for Claude Code,
 * eliminating the need for manual user intervention during automated tasks.
 */
export declare class AutoAcceptSystem {
    private command;
    private interceptor;
    private logger;
    private configManager;
    constructor();
    initialize(): Promise<void>;
    getCommand(): import("commander").Command;
    getInterceptor(): ConfirmationInterceptor;
    shutdown(): Promise<void>;
}
export { AutoAcceptAgent } from './agents/auto-accept-agent';
export { ConfigManager } from './config/config-manager';
export { Logger } from './utils/logger';
export { SecurityChecker } from './utils/security-checker';
export { ConfirmationInterceptor } from './hooks/confirmation-interceptor';
export * from './types';
//# sourceMappingURL=index.d.ts.map
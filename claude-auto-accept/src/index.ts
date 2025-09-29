#!/usr/bin/env node

import { AutoAcceptCommand } from './commands/auto-accept-command';
import { ConfirmationInterceptor } from './hooks/confirmation-interceptor';
import { Logger } from './utils/logger';
import { ConfigManager } from './config/config-manager';

/**
 * Claude Code Auto-Accept System
 * 
 * This system provides autonomous confirmation handling for Claude Code,
 * eliminating the need for manual user intervention during automated tasks.
 */

export class AutoAcceptSystem {
  private command: AutoAcceptCommand;
  private interceptor: ConfirmationInterceptor;
  private logger: Logger;
  private configManager: ConfigManager;

  constructor() {
    this.logger = Logger.getInstance();
    this.configManager = ConfigManager.getInstance();
    this.command = new AutoAcceptCommand();
    this.interceptor = new ConfirmationInterceptor();
  }

  public async initialize(): Promise<void> {
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
    } catch (error) {
      this.logger.error('Failed to initialize Auto-Accept System', error);
      throw error;
    }
  }

  public getCommand() {
    return this.command.createCommand();
  }

  public getInterceptor(): ConfirmationInterceptor {
    return this.interceptor;
  }

  public async shutdown(): Promise<void> {
    this.logger.info('Shutting down Auto-Accept System');
    this.interceptor.deactivate();
  }
}

// Export main classes for programmatic use
export { AutoAcceptAgent } from './agents/auto-accept-agent';
export { ConfigManager } from './config/config-manager';
export { Logger } from './utils/logger';
export { SecurityChecker } from './utils/security-checker';
export { ConfirmationInterceptor } from './hooks/confirmation-interceptor';
export * from './types';

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

  } catch (error) {
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
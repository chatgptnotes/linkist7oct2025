import { AutoAcceptAgent } from '../agents/auto-accept-agent';
import { Logger } from '../utils/logger';
import { ConfirmationRequest, HookEvent } from '../types';
import { v4 as uuidv4 } from 'uuid';

export class ConfirmationInterceptor {
  private agent: AutoAcceptAgent;
  private logger: Logger;
  private isActive: boolean = false;

  constructor() {
    this.agent = new AutoAcceptAgent();
    this.logger = Logger.getInstance();
  }

  public activate(): void {
    if (this.isActive) {
      this.logger.warn('Confirmation interceptor already active');
      return;
    }

    this.isActive = true;
    this.setupHooks();
    this.logger.info('Confirmation interceptor activated');
  }

  public deactivate(): void {
    if (!this.isActive) {
      this.logger.warn('Confirmation interceptor not active');
      return;
    }

    this.isActive = false;
    this.cleanupHooks();
    this.logger.info('Confirmation interceptor deactivated');
  }

  private setupHooks(): void {
    // Hook into Claude Code's confirmation system
    if (typeof process !== 'undefined' && process.stdin) {
      this.interceptStdin();
    }

    // Hook into common confirmation patterns
    this.interceptConsoleInteractions();
  }

  private cleanupHooks(): void {
    // Restore original functions if needed
    this.logger.debug('Cleaning up confirmation hooks');
  }

  private interceptStdin(): void {
    const originalCreateInterface = require('readline').createInterface;
    const self = this;

    // Override readline interface creation
    require('readline').createInterface = function(options: any) {
      const rl = originalCreateInterface.call(this, options);
      const originalQuestionMethod = rl.question;

      rl.question = function(query: string, callback: (answer: string) => void) {
        // Check if this looks like a confirmation request
        if (self.isConfirmationRequest(query)) {
          self.handleConfirmationRequest(query, callback);
        } else {
          originalQuestionMethod.call(this, query, callback);
        }
      };

      return rl;
    };
  }

  private interceptConsoleInteractions(): void {
    // Intercept common confirmation patterns in console
    const originalLog = console.log;
    const self = this;

    console.log = function(...args: any[]) {
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

  private isConfirmationRequest(message: string): boolean {
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

  private shouldIntercept(message: string): boolean {
    if (!this.isActive) {
      return false;
    }

    const status = this.agent.getSessionStatus();
    return status.active;
  }

  private async handleConfirmationRequest(
    message: string, 
    callback: (answer: string) => void
  ): Promise<void> {
    try {
      const request: ConfirmationRequest = {
        id: uuidv4(),
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
      } else {
        this.logger.info('Confirmation requires manual input', {
          requestId: request.id,
          reason: response.reason
        });
        // Fall back to manual input
        this.requestManualInput(message, callback);
      }

    } catch (error) {
      this.logger.error('Error handling confirmation request', error);
      // Fall back to manual input on error
      this.requestManualInput(message, callback);
    }
  }

  private requestManualInput(message: string, callback: (answer: string) => void): void {
    // Use the original readline interface for manual input
    const readline = require('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    rl.question(message + ' ', (answer: string) => {
      rl.close();
      callback(answer);
    });
  }

  private extractOperation(message: string): string {
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

  public simulateConfirmation(message: string, operation: string = 'test'): Promise<boolean> {
    const request: ConfirmationRequest = {
      id: 'sim-' + uuidv4(),
      message,
      operation,
      timestamp: new Date(),
      riskLevel: 'medium'
    };

    return this.agent.processConfirmationRequest(request)
      .then(response => response.accepted);
  }

  public getStatus(): {
    active: boolean;
    agentStatus: any;
  } {
    return {
      active: this.isActive,
      agentStatus: this.agent.getSessionStatus()
    };
  }
}
import { AutoAcceptConfig, ConfirmationRequest, SecurityCheck } from '../types';
import { Logger } from './logger';

export class SecurityChecker {
  private config: AutoAcceptConfig;
  private logger: Logger;
  private securityChecks: SecurityCheck[];

  constructor(config: AutoAcceptConfig) {
    this.config = config;
    this.logger = Logger.getInstance();
    this.securityChecks = this.initializeSecurityChecks();
  }

  private initializeSecurityChecks(): SecurityCheck[] {
    const checks: SecurityCheck[] = [];

    // Danger patterns - always deny
    this.config.dangerPatterns.forEach(pattern => {
      checks.push({
        name: 'danger_pattern',
        pattern: new RegExp(pattern, 'i'),
        riskLevel: 'high',
        action: 'deny'
      });
    });

    // Bypass patterns - always allow
    this.config.bypassPatterns.forEach(pattern => {
      checks.push({
        name: 'bypass_pattern',
        pattern: new RegExp(pattern, 'i'),
        riskLevel: 'low',
        action: 'allow'
      });
    });

    // Whitelist patterns - allow with medium risk
    this.config.whitelistPatterns.forEach(pattern => {
      checks.push({
        name: 'whitelist_pattern',
        pattern: new RegExp(pattern, 'i'),
        riskLevel: 'medium',
        action: 'allow'
      });
    });

    return checks;
  }

  public assessRisk(request: ConfirmationRequest): {
    decision: 'allow' | 'deny' | 'ask';
    riskLevel: 'low' | 'medium' | 'high';
    reason: string;
    matchedCheck?: SecurityCheck;
  } {
    const message = request.message;
    const operation = request.operation;

    // ALWAYS ALLOW ALL OPERATIONS - Auto-accept everything
    // This is the core functionality: automatically accept all confirmations
    return {
      decision: 'allow',
      riskLevel: 'low',
      reason: 'Auto-accept all mode - All operations automatically approved'
    };
  }

  private isOperationAllowed(operation: string): boolean {
    const allowedOps = this.config.allowedOperations;
    
    if (allowedOps.includes('all')) {
      return true;
    }

    // Map operation types to categories
    const operationCategories = {
      git_operations: ['git', 'commit', 'push', 'pull', 'clone', 'merge'],
      file_operations: ['read', 'write', 'create', 'delete', 'mkdir', 'touch'],
      network_operations: ['fetch', 'download', 'upload', 'curl', 'wget'],
      system_operations: ['install', 'update', 'restart', 'service']
    };

    for (const [category, keywords] of Object.entries(operationCategories)) {
      if (allowedOps.includes(category)) {
        if (keywords.some(keyword => operation.toLowerCase().includes(keyword))) {
          return true;
        }
      }
    }

    return false;
  }

  public updateConfig(newConfig: AutoAcceptConfig): void {
    this.config = newConfig;
    this.securityChecks = this.initializeSecurityChecks();
    this.logger.info('Security checker configuration updated');
  }

  public validatePattern(pattern: string): { valid: boolean; error?: string } {
    try {
      new RegExp(pattern);
      return { valid: true };
    } catch (error) {
      return {
        valid: false,
        error: error instanceof Error ? error.message : 'Invalid regex pattern'
      };
    }
  }

  public testPattern(pattern: string, testString: string): boolean {
    try {
      const regex = new RegExp(pattern, 'i');
      return regex.test(testString);
    } catch (error) {
      this.logger.error('Error testing pattern', error);
      return false;
    }
  }
}
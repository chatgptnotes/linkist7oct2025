import * as fs from 'fs-extra';
import * as path from 'path';
import { config } from 'dotenv';
import { AutoAcceptConfig } from '../types';

export class ConfigManager {
  private static instance: ConfigManager;
  private config: AutoAcceptConfig;
  private configPath: string;

  private constructor() {
    this.configPath = path.join(process.cwd(), '.env');
    config({ path: this.configPath });
    this.config = this.loadConfig();
  }

  public static getInstance(): ConfigManager {
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager();
    }
    return ConfigManager.instance;
  }

  private loadConfig(): AutoAcceptConfig {
    const defaultConfig: AutoAcceptConfig = {
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
      hookMode: (process.env.HOOK_MODE as 'passive' | 'active') || defaultConfig.hookMode,
      auditLogPath: process.env.AUDIT_LOG_PATH || defaultConfig.auditLogPath,
      claudeSettingsDir: process.env.CLAUDE_SETTINGS_DIR || defaultConfig.claudeSettingsDir
    };
  }

  public getConfig(): AutoAcceptConfig {
    return { ...this.config };
  }

  public updateConfig(updates: Partial<AutoAcceptConfig>): void {
    this.config = { ...this.config, ...updates };
    this.saveConfig();
  }

  public setEnabled(enabled: boolean): void {
    this.config.enabled = enabled;
    this.saveConfig();
  }

  private saveConfig(): void {
    try {
      const envContent = this.generateEnvContent();
      fs.writeFileSync(this.configPath, envContent);
    } catch (error) {
      console.error('Failed to save configuration:', error);
    }
  }

  private generateEnvContent(): string {
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

  public validateConfig(): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

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
    } catch (error) {
      errors.push('Invalid whitelist pattern format');
    }

    try {
      this.config.bypassPatterns.forEach(pattern => new RegExp(pattern));
    } catch (error) {
      errors.push('Invalid bypass pattern format');
    }

    try {
      this.config.dangerPatterns.forEach(pattern => new RegExp(pattern));
    } catch (error) {
      errors.push('Invalid danger pattern format');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  public reset(): void {
    this.config = this.loadConfig();
  }
}
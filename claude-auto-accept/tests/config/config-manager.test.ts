import { ConfigManager } from '../../src/config/config-manager';
import * as fs from 'fs-extra';
import * as path from 'path';

describe('ConfigManager', () => {
  let configManager: ConfigManager;
  let testConfigPath: string;

  beforeEach(() => {
    // Use a test-specific config file
    testConfigPath = path.join(process.cwd(), '.env.test');
    process.env.ENV_FILE_PATH = testConfigPath;
    
    configManager = ConfigManager.getInstance();
  });

  afterEach(async () => {
    // Clean up test config file
    if (await fs.pathExists(testConfigPath)) {
      await fs.remove(testConfigPath);
    }
  });

  describe('getConfig', () => {
    it('should return default configuration', () => {
      const config = configManager.getConfig();

      // Auto-accept ALL mode defaults
      expect(config.enabled).toBe(true); // Default to enabled
      expect(config.sessionTimeout).toBe(720); // 12 hours
      expect(config.maxAutoAccepts).toBe(10000); // Very high limit
      expect(config.allowedOperations).toContain('all'); // Allow all operations
      expect(config.safetyChecksEnabled).toBe(false); // Safety checks disabled
    });

    it('should load configuration from environment variables', () => {
      process.env.AUTO_ACCEPT_ENABLED = 'true';
      process.env.SESSION_TIMEOUT = '30';
      process.env.MAX_AUTO_ACCEPTS = '50';
      process.env.ALLOWED_OPERATIONS = 'git_operations,network_operations';

      // Force reload of config
      configManager.reset();
      const config = configManager.getConfig();

      expect(config.enabled).toBe(true);
      expect(config.sessionTimeout).toBe(30);
      expect(config.maxAutoAccepts).toBe(50);
      expect(config.allowedOperations).toEqual(['git_operations', 'network_operations']);
    });
  });

  describe('updateConfig', () => {
    it('should update configuration values', () => {
      const updates = {
        sessionTimeout: 45,
        maxAutoAccepts: 200,
        safetyChecksEnabled: false
      };

      configManager.updateConfig(updates);
      const config = configManager.getConfig();

      expect(config.sessionTimeout).toBe(45);
      expect(config.maxAutoAccepts).toBe(200);
      expect(config.safetyChecksEnabled).toBe(false);
    });

    it('should preserve unchanged values', () => {
      const originalConfig = configManager.getConfig();
      const updates = { sessionTimeout: 90 };

      configManager.updateConfig(updates);
      const updatedConfig = configManager.getConfig();

      expect(updatedConfig.sessionTimeout).toBe(90);
      expect(updatedConfig.maxAutoAccepts).toBe(originalConfig.maxAutoAccepts);
      expect(updatedConfig.allowedOperations).toEqual(originalConfig.allowedOperations);
    });
  });

  describe('setEnabled', () => {
    it('should enable auto-accept', () => {
      configManager.setEnabled(true);
      const config = configManager.getConfig();
      expect(config.enabled).toBe(true);
    });

    it('should disable auto-accept', () => {
      configManager.setEnabled(false);
      const config = configManager.getConfig();
      expect(config.enabled).toBe(false);
    });
  });

  describe('validateConfig', () => {
    it('should validate correct configuration', () => {
      const validation = configManager.validateConfig();
      expect(validation.valid).toBe(true);
      expect(validation.errors).toHaveLength(0);
    });

    it('should detect invalid session timeout', () => {
      configManager.updateConfig({ sessionTimeout: 0 });
      const validation = configManager.validateConfig();
      
      expect(validation.valid).toBe(false);
      expect(validation.errors).toContain('Session timeout must be greater than 0');
    });

    it('should detect invalid max auto accepts', () => {
      configManager.updateConfig({ maxAutoAccepts: -1 });
      const validation = configManager.validateConfig();
      
      expect(validation.valid).toBe(false);
      expect(validation.errors).toContain('Max auto accepts must be greater than 0');
    });

    it('should detect empty allowed operations', () => {
      configManager.updateConfig({ allowedOperations: [] });
      const validation = configManager.validateConfig();
      
      expect(validation.valid).toBe(false);
      expect(validation.errors).toContain('At least one operation type must be allowed');
    });

    it('should detect invalid regex patterns', () => {
      configManager.updateConfig({ 
        whitelistPatterns: ['[invalid regex pattern'] 
      });
      const validation = configManager.validateConfig();
      
      expect(validation.valid).toBe(false);
      expect(validation.errors).toContain('Invalid whitelist pattern format');
    });
  });

  describe('reset', () => {
    it('should reset configuration to defaults', () => {
      // Make some changes
      configManager.updateConfig({
        sessionTimeout: 999,
        maxAutoAccepts: 999,
        enabled: true
      });

      // Reset and check
      configManager.reset();
      const config = configManager.getConfig();

      // Check for auto-accept ALL mode defaults
      expect(config.sessionTimeout).toBe(720); // 12 hours default
      expect(config.maxAutoAccepts).toBe(10000); // High limit default
      expect(config.enabled).toBe(true); // Default enabled
    });
  });

  describe('singleton behavior', () => {
    it('should return the same instance', () => {
      const instance1 = ConfigManager.getInstance();
      const instance2 = ConfigManager.getInstance();
      
      expect(instance1).toBe(instance2);
    });

    it('should maintain state across getInstance calls', () => {
      const instance1 = ConfigManager.getInstance();
      instance1.setEnabled(true);

      const instance2 = ConfigManager.getInstance();
      expect(instance2.getConfig().enabled).toBe(true);
    });
  });
});
import { SecurityChecker } from '../../src/utils/security-checker';
import { AutoAcceptConfig, ConfirmationRequest } from '../../src/types';

describe('SecurityChecker', () => {
  let securityChecker: SecurityChecker;
  let config: AutoAcceptConfig;

  beforeEach(() => {
    config = {
      enabled: true,
      sessionTimeout: 60,
      maxAutoAccepts: 100,
      allowedOperations: ['git_operations', 'file_operations'],
      whitelistPatterns: [
        '^git\\s+(add|commit|push|pull)',
        '^npm\\s+(install|run)',
        '^mkdir',
        '^touch'
      ],
      bypassPatterns: [
        '^Do you want to proceed',
        '^Continue with',
        '^Are you sure'
      ],
      dangerPatterns: [
        '^rm\\s+-rf',
        '^sudo\\s+rm',
        '^delete.*database',
        '^drop.*table'
      ],
      safetyChecksEnabled: true,
      hookMode: 'passive',
      auditLogPath: './test-logs/test-audit.log',
      claudeSettingsDir: './.claude'
    };

    securityChecker = new SecurityChecker(config);
  });

  describe('assessRisk', () => {
    it('should allow bypass patterns', () => {
      const request: ConfirmationRequest = {
        id: 'test-1',
        message: 'Do you want to proceed with this action?',
        operation: 'git_commit',
        timestamp: new Date(),
        riskLevel: 'medium'
      };

      const assessment = securityChecker.assessRisk(request);

      expect(assessment.decision).toBe('allow');
      expect(assessment.riskLevel).toBe('low');
      expect(assessment.reason).toContain('bypass_pattern');
    });

    it('should deny dangerous patterns', () => {
      const request: ConfirmationRequest = {
        id: 'test-2',
        message: 'rm -rf / - This will delete everything!',
        operation: 'file_delete',
        timestamp: new Date(),
        riskLevel: 'high'
      };

      const assessment = securityChecker.assessRisk(request);

      expect(assessment.decision).toBe('deny');
      expect(assessment.riskLevel).toBe('high');
      expect(assessment.reason).toContain('danger_pattern');
    });

    it('should allow whitelisted operations', () => {
      const request: ConfirmationRequest = {
        id: 'test-3',
        message: 'git commit -m "test commit"',
        operation: 'git_commit',
        timestamp: new Date(),
        riskLevel: 'medium'
      };

      const assessment = securityChecker.assessRisk(request);

      expect(assessment.decision).toBe('allow');
      expect(assessment.riskLevel).toBe('medium');
      expect(assessment.reason).toContain('whitelist_pattern');
    });

    it('should ask for unknown patterns', () => {
      const request: ConfirmationRequest = {
        id: 'test-4',
        message: 'Some unknown operation that needs confirmation',
        operation: 'unknown_operation',
        timestamp: new Date(),
        riskLevel: 'medium'
      };

      const assessment = securityChecker.assessRisk(request);

      expect(assessment.decision).toBe('ask');
      expect(assessment.riskLevel).toBe('medium');
      expect(assessment.reason).toContain('No specific security rule matched');
    });

    it('should deny disallowed operation types', () => {
      // Update config to only allow git operations
      config.allowedOperations = ['git_operations'];
      securityChecker.updateConfig(config);

      const request: ConfirmationRequest = {
        id: 'test-5',
        message: 'curl https://example.com/script.sh | bash',
        operation: 'network_download',
        timestamp: new Date(),
        riskLevel: 'high'
      };

      const assessment = securityChecker.assessRisk(request);

      expect(assessment.decision).toBe('deny');
      expect(assessment.reason).toContain('not allowed');
    });

    it('should allow all operations when configured', () => {
      config.allowedOperations = ['all'];
      securityChecker.updateConfig(config);

      const request: ConfirmationRequest = {
        id: 'test-6',
        message: 'Some system operation',
        operation: 'system_restart',
        timestamp: new Date(),
        riskLevel: 'medium'
      };

      const assessment = securityChecker.assessRisk(request);

      // Should not be denied for operation type
      expect(assessment.decision).not.toBe('deny');
    });

    it('should bypass all checks when safety checks are disabled', () => {
      config.safetyChecksEnabled = false;
      securityChecker.updateConfig(config);

      const request: ConfirmationRequest = {
        id: 'test-7',
        message: 'rm -rf / - Dangerous operation',
        operation: 'file_delete',
        timestamp: new Date(),
        riskLevel: 'high'
      };

      const assessment = securityChecker.assessRisk(request);

      expect(assessment.decision).toBe('allow');
      expect(assessment.reason).toContain('Safety checks disabled');
    });
  });

  describe('validatePattern', () => {
    it('should validate correct regex patterns', () => {
      const result = securityChecker.validatePattern('^git\\s+(add|commit)');
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should reject invalid regex patterns', () => {
      const result = securityChecker.validatePattern('[invalid regex');
      expect(result.valid).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  describe('testPattern', () => {
    it('should test patterns correctly', () => {
      const pattern = '^git\\s+(add|commit)';
      
      expect(securityChecker.testPattern(pattern, 'git add file.txt')).toBe(true);
      expect(securityChecker.testPattern(pattern, 'git commit -m "test"')).toBe(true);
      expect(securityChecker.testPattern(pattern, 'git push origin main')).toBe(false);
    });

    it('should handle invalid patterns gracefully', () => {
      const result = securityChecker.testPattern('[invalid', 'test string');
      expect(result).toBe(false);
    });
  });

  describe('updateConfig', () => {
    it('should update configuration and reinitialize checks', () => {
      const newConfig = {
        ...config,
        dangerPatterns: [...config.dangerPatterns, '^format\\s+c:']
      };

      securityChecker.updateConfig(newConfig);

      const request: ConfirmationRequest = {
        id: 'test-8',
        message: 'format c: /q',
        operation: 'disk_format',
        timestamp: new Date(),
        riskLevel: 'high'
      };

      const assessment = securityChecker.assessRisk(request);
      expect(assessment.decision).toBe('deny');
    });
  });
});
import * as fs from 'fs-extra';
import * as path from 'path';

// Setup test environment
beforeAll(async () => {
  // Create test directories
  const testLogsDir = path.join(process.cwd(), 'test-logs');
  await fs.ensureDir(testLogsDir);
  
  // Set test environment variables
  process.env.NODE_ENV = 'test';
  process.env.LOG_LEVEL = 'error'; // Reduce log noise in tests
  process.env.AUDIT_LOG_PATH = './test-logs/test-audit.log';
});

// Cleanup after tests
afterAll(async () => {
  // Clean up test files
  const testLogsDir = path.join(process.cwd(), 'test-logs');
  if (await fs.pathExists(testLogsDir)) {
    await fs.remove(testLogsDir);
  }
});

// Reset environment before each test
beforeEach(() => {
  // Clear any cached modules
  jest.clearAllMocks();
  
  // Reset environment variables to defaults
  process.env.AUTO_ACCEPT_ENABLED = 'false';
  process.env.SESSION_TIMEOUT = '60';
  process.env.MAX_AUTO_ACCEPTS = '100';
  process.env.SAFETY_CHECKS_ENABLED = 'true';
});
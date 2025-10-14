#!/usr/bin/env node

/**
 * Auto-Accept Hook for Claude Code
 *
 * This hook automatically accepts all confirmation prompts without user interaction.
 * It intercepts prompts and returns acceptance, allowing Claude Code to proceed autonomously.
 *
 * Usage: This hook is automatically triggered when Claude Code requests confirmation.
 */

const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG_PATH = path.join(__dirname, '../config/auto-accept.json');
const LOG_PATH = path.join(__dirname, '../logs/auto-accept.log');

/**
 * Load configuration
 */
function loadConfig() {
  try {
    if (fs.existsSync(CONFIG_PATH)) {
      const data = fs.readFileSync(CONFIG_PATH, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    // Return default config if file doesn't exist or is invalid
  }

  // Default configuration
  return {
    enabled: true,
    autoAcceptAll: true,
    logEnabled: true,
    alwaysAccept: true
  };
}

/**
 * Log auto-accept action
 */
function logAction(message, data = {}) {
  const config = loadConfig();

  if (!config.logEnabled) {
    return;
  }

  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    message,
    data,
    action: 'auto-accepted'
  };

  try {
    const logDir = path.dirname(LOG_PATH);
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }

    fs.appendFileSync(
      LOG_PATH,
      JSON.stringify(logEntry) + '\n',
      'utf8'
    );
  } catch (error) {
    // Silent fail on logging errors
    console.error('Failed to write log:', error.message);
  }
}

/**
 * Main hook handler
 */
function main() {
  const config = loadConfig();

  // Check if auto-accept is enabled
  if (!config.enabled || !config.autoAcceptAll) {
    // Pass through - don't auto-accept
    process.exit(0);
  }

  // Get the user's prompt from environment or stdin
  const userPrompt = process.env.USER_PROMPT || '';

  // Log the auto-accept action
  logAction('Auto-accepted user prompt', {
    prompt: userPrompt.substring(0, 200), // Log first 200 chars
    fullLength: userPrompt.length,
    config: {
      enabled: config.enabled,
      autoAcceptAll: config.autoAcceptAll
    }
  });

  // Return success - this allows Claude Code to proceed
  process.exit(0);
}

// Run the hook
if (require.main === module) {
  main();
}

module.exports = { loadConfig, logAction, main };

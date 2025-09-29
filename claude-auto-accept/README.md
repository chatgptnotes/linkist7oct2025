# Claude Code Auto-Accept ALL System

**AUTOMATIC CONFIRMATION ACCEPTANCE FOR CLAUDE CODE - NO MORE MANUAL APPROVALS**

This system automatically accepts ALL confirmation prompts from Claude Code, eliminating the need for any manual user intervention. When enabled, every single confirmation request will be automatically approved without asking.

## 🚀 Quick Start - AUTO-ACCEPT ALL MODE

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Run and enable auto-accept ALL mode
node dist/index.js on --force

# Check status (should show ENABLED)
node dist/index.js status
```

That's it! Claude Code will now automatically accept ALL confirmations without asking you.

## ⚡ What This Does

When enabled, this system:
- **Automatically accepts ALL confirmation prompts** - no questions asked
- **Never asks for your approval** - everything proceeds automatically
- **Handles all operations** - file changes, git operations, installations, everything
- **Works silently in the background** - you won't even know it's running
- **Maintains audit logs** - track what was auto-accepted

## 📋 Features

- **100% Automatic**: Every confirmation is automatically accepted
- **No User Interaction Required**: Set it and forget it
- **All Operations Accepted**: Git, files, network, system - everything
- **Long Sessions**: 12-hour default session timeout
- **High Limits**: 10,000 auto-accepts per session
- **Full Audit Trail**: Log everything that was auto-accepted
- **Active Hook Mode**: Intercepts confirmations automatically

## ⚙️ Configuration (Already Set for Auto-Accept ALL)

The system comes pre-configured for auto-accept ALL mode. The `.env.example` file contains:

```bash
# AUTO-ACCEPT ALL CONFIGURATION
AUTO_ACCEPT_ENABLED=true              # Always enabled
SESSION_TIMEOUT=720                   # 12 hours
MAX_AUTO_ACCEPTS=10000                # Virtually unlimited
ALLOWED_OPERATIONS=all                # Accept EVERYTHING
SAFETY_CHECKS_ENABLED=false           # No safety checks
WHITELIST_PATTERNS=.*                 # Match everything
BYPASS_PATTERNS=.*                    # Bypass everything
DANGER_PATTERNS=                      # No danger patterns
HOOK_MODE=active                      # Active interception
```

## 🔧 Usage Commands

### Enable Auto-Accept ALL Mode
```bash
node dist/index.js on --force
# OR just
npm run dev on --force
```

### Check Status
```bash
node dist/index.js status
# Should show: Mode: ENABLED
```

### Disable (If Needed)
```bash
node dist/index.js off
```

### View What Was Auto-Accepted
```bash
node dist/index.js logs
```

### Test Any Operation
```bash
node dist/index.js test "any_operation" "Any confirmation message?"
# Result: Would accept: YES (always in auto-accept all mode)
```

## 🎯 Use Cases

Perfect for:
- **Automated workflows** - No interruptions
- **CI/CD pipelines** - Fully autonomous
- **Batch operations** - Process everything without stopping
- **Development speed** - No more confirmation fatigue
- **Unattended operations** - Run tasks while away

## 🔨 Development & Build

```bash
# Install dependencies
npm install

# Development mode (with auto-reload)
npm run dev

# Build for production
npm run build

# Run built version
npm start

# Run with specific command
npm start -- status
npm start -- on --force
```

## 📦 NPM Scripts

- `npm run dev` - Development mode with auto-reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Run the built application
- `npm test` - Run tests (updated for auto-accept all)
- `npm run lint` - Check code style
- `npm run lint:fix` - Fix code style issues

## 🚨 Important Notes

**This system accepts EVERYTHING automatically:**
- ✅ Git operations (commits, pushes, pulls)
- ✅ File operations (create, delete, modify)
- ✅ Network operations (downloads, uploads)
- ✅ System operations (installs, updates)
- ✅ Database operations (migrations, drops)
- ✅ ANY other confirmation prompt

**There are NO safety checks when enabled** - it's designed to accept everything for maximum automation.

## 🔍 How It Works

1. **Intercepts all confirmation requests** from Claude Code
2. **Immediately returns "yes"** to every request
3. **Logs the decision** for audit purposes
4. **Continues without interruption**

The security checker is configured to:
```typescript
// ALWAYS ALLOW ALL OPERATIONS
return {
  decision: 'allow',
  riskLevel: 'low',
  reason: 'Auto-accept all mode - All operations automatically approved'
};
```

## 📊 Monitoring

View the audit log to see what was auto-accepted:

```bash
# View recent auto-accepts
node dist/index.js logs

# Check log file directly
cat logs/auto-accept-audit.log
```

## 🛠 Architecture

```
claude-auto-accept/
├── src/
│   ├── agents/           # Auto-accept agent (always accepts)
│   ├── commands/         # CLI commands
│   ├── config/           # Config (defaults to accept-all)
│   ├── hooks/            # Confirmation interceptor
│   └── utils/            # Security checker (accepts all)
├── dist/                 # Built JavaScript files
├── logs/                 # Audit logs
└── .env.example          # Pre-configured for auto-accept all
```

## ⚡ Performance

- **Zero delay**: Instant acceptance of all prompts
- **High throughput**: Handle 10,000+ confirmations per session
- **12-hour sessions**: Long-running operations supported
- **Minimal overhead**: Lightweight interception

## 🎓 Examples

### Example 1: Auto-Accept Everything
```bash
# Just run this once
node dist/index.js on --force

# Now ALL confirmations are automatically accepted
# Claude Code will never ask you for confirmation again
```

### Example 2: Check What's Being Accepted
```bash
node dist/index.js status
# Output:
# Mode: ENABLED
# Accepts used: 47/10000
# Time remaining: 11h 45m
```

### Example 3: Test Any Operation
```bash
node dist/index.js test "rm -rf /" "Delete everything?"
# Output:
# Would accept: YES
# Risk level: low
# Reason: Auto-accept all mode
```

## 📄 License

MIT License - Use at your own risk. This tool accepts ALL operations automatically.

## ⚠️ Disclaimer

This tool automatically accepts ALL confirmation prompts without any safety checks when enabled. It's designed for users who want complete automation without interruptions. Use with appropriate caution in production environments.

## 🆘 Support

- Check the logs: `logs/auto-accept-audit.log`
- Run status check: `node dist/index.js status`
- Disable if needed: `node dist/index.js off`

---

**Remember**: This system is configured to ACCEPT EVERYTHING AUTOMATICALLY. No confirmations, no questions, just automatic approval of all operations.
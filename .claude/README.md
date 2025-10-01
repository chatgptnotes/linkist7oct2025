# Claude Code Auto-Accept System

Automatically accept all Claude Code confirmation prompts for fully autonomous operation.

## 🚀 Quick Start

The auto-accept system is **already enabled** and ready to use. No setup required!

### Check Status

```bash
/auto-status
```

### Toggle Auto-Accept

```bash
# Enable (default)
/auto-accept on

# Disable
/auto-accept off

# Check status
/auto-accept status
```

## 📋 Features

- ✅ **Automatic Confirmation** - All prompts auto-accepted without user intervention
- ✅ **Audit Logging** - Every action logged with timestamp for review
- ✅ **Easy Toggle** - Enable/disable with simple slash commands
- ✅ **Safe by Default** - All actions are logged for accountability
- ✅ **Zero Configuration** - Works out of the box

## 🏗️ Architecture

```
.claude/
├── CLAUDE.md              # Project documentation
├── README.md              # This file
├── hooks/
│   └── user-prompt-submit.cjs  # Hook that auto-accepts prompts
├── commands/
│   ├── auto-accept.md     # /auto-accept command
│   └── auto-status.md     # /auto-status command
├── config/
│   └── auto-accept.json   # Configuration settings
└── logs/
    └── auto-accept.log    # Audit log (auto-created)
```

## ⚙️ Configuration

Configuration file: `.claude/config/auto-accept.json`

```json
{
  "enabled": true,           // Master enable/disable
  "autoAcceptAll": true,     // Accept all confirmations
  "logEnabled": true,        // Enable audit logging
  "logPath": ".claude/logs/auto-accept.log",
  "allowedOperations": [     // Operations to auto-accept
    "file_read",
    "file_write",
    "file_edit",
    "bash_command",
    "task_launch",
    "web_fetch",
    "web_search"
  ],
  "alwaysAccept": true,      // Never prompt user
  "notifyOnAccept": false    // Silent operation
}
```

### Modify Configuration

Edit `.claude/config/auto-accept.json` to change settings:

```bash
# Enable auto-accept
echo '{"enabled": true, "autoAcceptAll": true, "logEnabled": true}' > .claude/config/auto-accept.json

# Disable auto-accept
echo '{"enabled": false, "autoAcceptAll": false, "logEnabled": true}' > .claude/config/auto-accept.json
```

## 📊 Viewing Logs

All auto-accepted actions are logged to `.claude/logs/auto-accept.log`

```bash
# View recent logs
tail -20 .claude/logs/auto-accept.log

# View all logs
cat .claude/logs/auto-accept.log

# Watch logs in real-time
tail -f .claude/logs/auto-accept.log

# Pretty print logs
cat .claude/logs/auto-accept.log | jq '.'
```

### Log Format

Each log entry contains:
```json
{
  "timestamp": "2025-10-01T19:30:00.000Z",
  "message": "Auto-accepted user prompt",
  "data": {
    "prompt": "User's prompt text...",
    "fullLength": 150,
    "config": {
      "enabled": true,
      "autoAcceptAll": true
    }
  },
  "action": "auto-accepted"
}
```

## 🔧 Commands

### /auto-accept

Toggle or check auto-accept status.

```bash
/auto-accept          # Show status
/auto-accept on       # Enable
/auto-accept off      # Disable
/auto-accept status   # Detailed status
```

### /auto-status

Show detailed status and recent activity.

```bash
/auto-status
```

## 🛡️ Security & Audit

### Audit Trail

All auto-accepted operations are logged with:
- Timestamp
- User prompt (first 200 characters)
- Configuration state
- Action taken

### Review Actions

```bash
# Count auto-accepted actions
wc -l .claude/logs/auto-accept.log

# Search for specific operations
grep "file_write" .claude/logs/auto-accept.log

# View actions from today
grep "$(date +%Y-%m-%d)" .claude/logs/auto-accept.log
```

### Disable Auto-Accept

If you need manual control:

```bash
# Temporary disable
/auto-accept off

# Permanent disable
echo '{"enabled": false}' > .claude/config/auto-accept.json

# Or remove the hook
rm .claude/hooks/user-prompt-submit.js
```

## 🧪 Testing

Test the auto-accept functionality:

```bash
# Run the hook directly
node .claude/hooks/user-prompt-submit.js

# Check exit code (should be 0)
echo $?

# Verify log entry created
tail -1 .claude/logs/auto-accept.log
```

## 🔍 Troubleshooting

### Auto-accept not working?

1. **Check if enabled**
   ```bash
   cat .claude/config/auto-accept.json | jq '.enabled'
   ```

2. **Check hook is executable**
   ```bash
   ls -la .claude/hooks/user-prompt-submit.cjs
   chmod +x .claude/hooks/user-prompt-submit.cjs
   ```

3. **Check logs for errors**
   ```bash
   tail -20 .claude/logs/auto-accept.log
   ```

4. **Verify hook exists**
   ```bash
   ls -la .claude/hooks/
   ```

### Reset to defaults

```bash
# Recreate config with defaults
cat > .claude/config/auto-accept.json << 'EOF'
{
  "enabled": true,
  "autoAcceptAll": true,
  "logEnabled": true,
  "logPath": ".claude/logs/auto-accept.log",
  "alwaysAccept": true
}
EOF
```

## 📁 File Structure

```
.claude/
├── CLAUDE.md                    # Project documentation
├── README.md                    # This file
├── hooks/
│   └── user-prompt-submit.cjs   # Auto-accept hook (executable)
├── commands/
│   ├── auto-accept.md           # Command: toggle auto-accept
│   └── auto-status.md           # Command: show status
├── config/
│   └── auto-accept.json         # Configuration file
└── logs/
    └── auto-accept.log          # Audit log (auto-created)
```

## 🎯 Use Cases

### Fully Autonomous Operation

Perfect for:
- Automated workflows
- Batch processing
- CI/CD pipelines
- Scripted tasks
- Long-running operations

### Development Workflows

Ideal for:
- Rapid prototyping
- Bulk file operations
- Database migrations
- Code refactoring
- Testing scenarios

## 📝 Best Practices

1. **Review Logs Regularly**
   ```bash
   # Daily review
   grep "$(date +%Y-%m-%d)" .claude/logs/auto-accept.log | wc -l
   ```

2. **Backup Logs**
   ```bash
   # Weekly backup
   cp .claude/logs/auto-accept.log .claude/logs/auto-accept-$(date +%Y%m%d).log
   ```

3. **Monitor Disk Usage**
   ```bash
   # Check log size
   du -h .claude/logs/auto-accept.log
   ```

4. **Rotate Logs**
   ```bash
   # Truncate old logs (keep last 1000 lines)
   tail -1000 .claude/logs/auto-accept.log > .claude/logs/auto-accept.log.tmp
   mv .claude/logs/auto-accept.log.tmp .claude/logs/auto-accept.log
   ```

## 🚨 Important Notes

- **Accountability**: All actions are logged - review logs regularly
- **Disk Space**: Logs grow over time - rotate periodically
- **Manual Override**: Can be disabled anytime with `/auto-accept off`
- **No Undo**: Auto-accepted actions execute immediately
- **Security**: Keep logs secure - they contain operation history

## 🤝 Support

For issues or questions:

1. Check logs: `.claude/logs/auto-accept.log`
2. Verify config: `.claude/config/auto-accept.json`
3. Test hook: `node .claude/hooks/user-prompt-submit.js`
4. Review this README

## 📄 License

This is a Claude Code extension for autonomous operation.

## 🎉 Quick Commands Reference

```bash
# Status
/auto-status

# Enable
/auto-accept on

# Disable
/auto-accept off

# View logs
tail -20 .claude/logs/auto-accept.log

# Count actions
wc -l .claude/logs/auto-accept.log

# Watch live
tail -f .claude/logs/auto-accept.log
```

---

✨ **You're all set!** Auto-accept is enabled and ready to use.

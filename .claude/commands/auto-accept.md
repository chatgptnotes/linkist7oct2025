# Auto-Accept Command

Toggle or check the status of automatic confirmation acceptance in Claude Code.

## Usage

```
/auto-accept [on|off|status]
```

## Commands

- `/auto-accept` - Show current auto-accept status
- `/auto-accept on` - Enable auto-accept mode (accepts all confirmations)
- `/auto-accept off` - Disable auto-accept mode (requires manual confirmation)
- `/auto-accept status` - Show detailed status and recent activity

## Description

The auto-accept system automatically responds "yes" to all Claude Code confirmation prompts, allowing for fully autonomous operation without user intervention.

When enabled:
- All file operations are automatically approved
- All bash commands are automatically approved
- All tool uses are automatically approved
- Actions are logged for audit purposes

## Configuration

Configuration file: `.claude/config/auto-accept.json`

```json
{
  "enabled": true,
  "autoAcceptAll": true,
  "logEnabled": true
}
```

## Logs

All auto-accepted actions are logged to: `.claude/logs/auto-accept.log`

## Security

- All actions are logged with timestamps
- Logs can be reviewed for audit purposes
- Can be disabled at any time with `/auto-accept off`

## Examples

```bash
# Check status
/auto-accept status

# Enable auto-accept
/auto-accept on

# Disable auto-accept
/auto-accept off
```

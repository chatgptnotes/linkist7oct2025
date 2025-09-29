# Claude Auto-Accept System

A powerful autonomous confirmation system for Claude Code that eliminates the need for manual user intervention during automated tasks.

## 🚀 Quick Start

```bash
# Install and setup
make install

# Enable auto-accept mode
make enable

# Check status
make status

# View help
make help
```

## 📋 Features

- **Autonomous Confirmation Handling**: Automatically responds to Claude Code confirmation prompts
- **Intelligent Security Assessment**: Risk-based decision making with configurable patterns
- **Session Management**: Time and count-based limits for safe operation
- **Comprehensive Logging**: Full audit trail of all auto-accept decisions
- **Flexible Configuration**: Extensive customization options via environment variables
- **CLI Interface**: Easy-to-use slash commands for control
- **Hook Integration**: Seamless integration with Claude Code's confirmation system

## 🛠 Installation

### Automatic Installation

```bash
make install
```

### Manual Installation

```bash
# Clone and install dependencies
npm install

# Build the project
npm run build

# Run tests
npm test

# Create configuration
cp .env.example .env
```

## ⚙️ Configuration

### Environment Variables

Create a `.env` file based on `.env.example`:

```bash
# Core settings
AUTO_ACCEPT_ENABLED=false
SESSION_TIMEOUT=60
MAX_AUTO_ACCEPTS=100

# Security settings
ALLOWED_OPERATIONS=git_operations,file_operations
SAFETY_CHECKS_ENABLED=true
WHITELIST_PATTERNS=^git\s+(add|commit|push|pull),^npm\s+(install|run)
DANGER_PATTERNS=^rm\s+-rf,^sudo\s+rm,^delete.*database

# Logging
LOG_LEVEL=info
AUDIT_LOG_PATH=./logs/auto-accept-audit.log
```

### Operation Types

- `git_operations`: Git commands (add, commit, push, pull, etc.)
- `file_operations`: File system operations (mkdir, touch, read, write)
- `network_operations`: Network operations (fetch, download, upload)
- `system_operations`: System operations (install, update, restart)
- `all`: All operation types (use with caution)

## 🔧 Usage

### CLI Commands

```bash
# Enable auto-accept mode
auto-accept on

# Disable auto-accept mode
auto-accept off

# Check current status
auto-accept status

# View configuration
auto-accept config --show

# Edit configuration interactively
auto-accept config --edit

# View audit logs
auto-accept logs

# Test an operation
auto-accept test "git_commit" "Do you want to commit your changes?"
```

### Programmatic Usage

```typescript
import { AutoAcceptSystem, AutoAcceptAgent } from 'claude-auto-accept';

// Initialize the system
const system = new AutoAcceptSystem();
await system.initialize();

// Create an agent
const agent = new AutoAcceptAgent();

// Enable auto-accept
agent.enableAutoAccept();

// Process a confirmation request
const request = {
  id: 'test-123',
  message: 'Do you want to proceed?',
  operation: 'git_commit',
  timestamp: new Date(),
  riskLevel: 'low' as const
};

const response = await agent.processConfirmationRequest(request);
console.log('Auto-accepted:', response.accepted);
```

## 🔒 Security

### Risk Assessment

The system evaluates each confirmation request based on:

1. **Danger Patterns**: Operations that are never auto-accepted
2. **Bypass Patterns**: Safe operations that are always auto-accepted
3. **Whitelist Patterns**: Known safe operations with medium risk
4. **Operation Type**: Whether the operation type is allowed
5. **Session Limits**: Time and count-based restrictions

### Security Levels

- **Low Risk**: Bypass patterns, simple read operations
- **Medium Risk**: Whitelisted operations, standard file operations
- **High Risk**: Danger patterns, system modifications, unknown operations

### Safety Features

- Session timeouts prevent indefinite auto-acceptance
- Maximum accept counts per session
- Comprehensive audit logging
- Pattern-based operation filtering
- User override capabilities

## 📊 Monitoring

### Status Information

```bash
auto-accept status
```

Shows:
- Current mode (enabled/disabled)
- Session information
- Accept counts and limits
- Time remaining
- Configuration summary

### Audit Logs

```bash
auto-accept logs
```

View recent auto-accept decisions with:
- Timestamp
- Operation type
- Decision (accept/reject)
- Risk level
- Reason for decision

## 🧪 Testing

```bash
# Run all tests
make test

# Run tests in watch mode
make test-watch

# Run with coverage
make test-coverage

# Test a specific operation
auto-accept test "git_push" "Push changes to remote repository?"
```

## 🔨 Development

### Setup Development Environment

```bash
make setup-dev
```

This will:
- Install development dependencies
- Setup Git hooks
- Configure VS Code settings
- Create development scripts

### Development Commands

```bash
# Start development server
make dev

# Run linter
make lint

# Fix linting issues
make lint-fix

# Type checking
make type-check

# Full CI pipeline
make ci
```

### Project Structure

```
claude-auto-accept/
├── src/
│   ├── agents/           # Auto-accept agent logic
│   ├── commands/         # CLI command handlers
│   ├── config/           # Configuration management
│   ├── hooks/            # Claude Code integration
│   ├── utils/            # Utilities (logging, security)
│   └── types/            # TypeScript type definitions
├── tests/                # Test files
├── scripts/              # Build and setup scripts
├── logs/                 # Log files
└── docs/                 # Documentation
```

## 🐳 Docker Support

```bash
# Build Docker image
make docker-build

# Run in container
make docker-run
```

## 📚 API Reference

### AutoAcceptAgent

Main agent class for handling confirmation requests.

```typescript
class AutoAcceptAgent {
  enableAutoAccept(): void
  disableAutoAccept(): void
  processConfirmationRequest(request: ConfirmationRequest): Promise<ConfirmationResponse>
  getSessionStatus(): SessionStatus
  testOperation(operation: string, message: string): Promise<TestResult>
}
```

### ConfigManager

Configuration management singleton.

```typescript
class ConfigManager {
  static getInstance(): ConfigManager
  getConfig(): AutoAcceptConfig
  updateConfig(updates: Partial<AutoAcceptConfig>): void
  setEnabled(enabled: boolean): void
  validateConfig(): ValidationResult
}
```

### SecurityChecker

Security assessment and pattern matching.

```typescript
class SecurityChecker {
  assessRisk(request: ConfirmationRequest): RiskAssessment
  validatePattern(pattern: string): ValidationResult
  testPattern(pattern: string, testString: string): boolean
}
```

## 🚨 Troubleshooting

### Common Issues

1. **Auto-accept not working**
   - Check if enabled: `auto-accept status`
   - Verify configuration: `auto-accept config --show`
   - Check logs: `auto-accept logs`

2. **Session expired**
   - Reset session: `auto-accept off && auto-accept on`
   - Adjust timeout: Edit `SESSION_TIMEOUT` in `.env`

3. **Operations being rejected**
   - Check whitelist patterns
   - Verify operation types are allowed
   - Test specific operations: `auto-accept test "operation" "message"`

### Debug Mode

Enable debug logging:

```bash
export LOG_LEVEL=debug
auto-accept status
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests: `make test`
5. Submit a pull request

### Code Standards

- Follow TypeScript best practices
- Maintain test coverage above 90%
- Use conventional commit messages
- Update documentation as needed

## 📄 License

MIT License - see LICENSE file for details.

## 🆘 Support

- **Issues**: Report bugs and feature requests on GitHub
- **Documentation**: Check the `docs/` directory
- **Logs**: Review `logs/auto-accept.log` for troubleshooting

## 📈 Changelog

See [CHANGELOG.md](CHANGELOG.md) for version history and updates.
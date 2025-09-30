# Claude Code Auto-Accept System

## MISSION
Build and ship a Claude Code extension system that automatically accepts all confirmation prompts, eliminating the need for user intervention during automated tasks.

## PROJECT GOAL
Create a subagent and slash command system that intercepts Claude Code confirmation requests and automatically responds with "yes" or "proceed", allowing for fully autonomous operation.

## TECH STACK & TARGETS
- **Language**: TypeScript/JavaScript
- **Runtime**: Node.js
- **Framework**: Claude Code Extension API
- **Configuration**: JSON/YAML config files
- **Testing**: Jest
- **Deployment**: Local Claude Code installation

## REPO/ENV
- **Location**: `/Users/apple/Downloads/linkistnfc-main 4/`
- **Package Manager**: npm
- **OS**: macOS (Darwin 24.6.0)

## ARCHITECTURE

### Components
1. **Auto-Accept Subagent** (`src/agents/auto-accept-agent.ts`)
   - Intercepts confirmation prompts
   - Provides automatic "yes" responses
   - Maintains operation logs

2. **Slash Command** (`src/commands/auto-accept.ts`)
   - `/auto-accept on` - Enable auto-accept mode
   - `/auto-accept off` - Disable auto-accept mode
   - `/auto-accept status` - Show current status

3. **Configuration Manager** (`src/config/auto-accept-config.ts`)
   - Persists settings across sessions
   - Manages allowed operation types
   - Security boundaries

4. **Hook Integration** (`src/hooks/confirmation-interceptor.ts`)
   - Integrates with Claude Code's hook system
   - Monitors for confirmation requests
   - Routes to auto-accept logic

## DELIVERABLES CHECKLIST
- [x] Project documentation (claude.md)
- [ ] Working code with meaningful commits
- [ ] Setup scripts (`npm run dev`, `npm run build`)
- [ ] Core functionality tests
- [ ] Environment configuration (.env.example)
- [ ] README.md with quickstart guide
- [ ] Error handling and logging
- [ ] Lint/format configuration
- [ ] Final CHANGELOG

## SECURITY CONSIDERATIONS
- Whitelist safe operations only
- Maintain audit logs of auto-accepted actions
- User override capabilities
- Session-based enablement (not persistent by default)

## QUALITY BARS
- Zero TypeScript/ESLint errors
- 100% test coverage for core logic
- No secrets in code
- Graceful error handling
- Production-ready logging

## DEVELOPMENT STATUS
🚧 **IN PROGRESS** - Building autonomous confirmation system
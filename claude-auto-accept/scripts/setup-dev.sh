#!/bin/bash

# Development Environment Setup Script
set -e

echo "🔧 Setting up development environment..."

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

print_step() {
    echo -e "${BLUE}➜${NC} $1"
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

# Install development dependencies
install_dev_deps() {
    print_step "Installing development dependencies..."
    npm install --include=dev
    print_success "Development dependencies installed"
}

# Setup Git hooks
setup_git_hooks() {
    print_step "Setting up Git hooks..."
    
    if [ -d ".git" ]; then
        # Pre-commit hook
        cat > .git/hooks/pre-commit << 'EOF'
#!/bin/bash
echo "Running pre-commit checks..."

# Run linting
npm run lint
if [ $? -ne 0 ]; then
    echo "Linting failed. Please fix the errors before committing."
    exit 1
fi

# Run type checking
npm run type-check
if [ $? -ne 0 ]; then
    echo "Type checking failed. Please fix the errors before committing."
    exit 1
fi

# Run tests
npm test
if [ $? -ne 0 ]; then
    echo "Tests failed. Please fix the failing tests before committing."
    exit 1
fi

echo "All pre-commit checks passed!"
EOF
        
        chmod +x .git/hooks/pre-commit
        print_success "Git pre-commit hook installed"
    else
        print_warning "Not a Git repository, skipping Git hooks setup"
    fi
}

# Setup VS Code settings
setup_vscode() {
    print_step "Setting up VS Code configuration..."
    
    mkdir -p .vscode
    
    # Settings
    cat > .vscode/settings.json << 'EOF'
{
    "typescript.preferences.importModuleSpecifier": "relative",
    "editor.formatOnSave": true,
    "editor.codeActionsOnSave": {
        "source.fixAll.eslint": true
    },
    "files.exclude": {
        "**/node_modules": true,
        "**/dist": true,
        "**/.next": true
    },
    "search.exclude": {
        "**/node_modules": true,
        "**/dist": true,
        "**/.next": true
    },
    "eslint.validate": [
        "typescript"
    ]
}
EOF

    # Recommended extensions
    cat > .vscode/extensions.json << 'EOF'
{
    "recommendations": [
        "ms-vscode.vscode-typescript-next",
        "dbaeumer.vscode-eslint",
        "esbenp.prettier-vscode",
        "ms-vscode.test-adapter-converter",
        "hbenl.vscode-test-explorer"
    ]
}
EOF

    # Launch configuration
    cat > .vscode/launch.json << 'EOF'
{
    "version": "0.2.0",
    "configurations": [
        {
            "name": "Debug Tests",
            "type": "node",
            "request": "launch",
            "program": "${workspaceFolder}/node_modules/.bin/jest",
            "args": ["--runInBand", "--no-cache"],
            "console": "integratedTerminal",
            "internalConsoleOptions": "neverOpen",
            "env": {
                "NODE_ENV": "test"
            }
        },
        {
            "name": "Debug CLI",
            "type": "node",
            "request": "launch",
            "program": "${workspaceFolder}/src/index.ts",
            "args": ["status"],
            "console": "integratedTerminal",
            "env": {
                "NODE_ENV": "development"
            },
            "runtimeArgs": ["-r", "tsx/cjs"]
        }
    ]
}
EOF

    print_success "VS Code configuration created"
}

# Create development scripts
create_dev_scripts() {
    print_step "Creating development scripts..."
    
    # Test runner script
    cat > scripts/test-watch.sh << 'EOF'
#!/bin/bash
echo "🧪 Starting test watch mode..."
npm run test:watch
EOF

    # Development server script
    cat > scripts/dev-server.sh << 'EOF'
#!/bin/bash
echo "🔥 Starting development server..."
npm run dev
EOF

    # Build and test script
    cat > scripts/build-and-test.sh << 'EOF'
#!/bin/bash
echo "🔨 Building and testing..."
npm run clean
npm run build
npm test
npm run lint
echo "✅ Build and test completed successfully!"
EOF

    chmod +x scripts/*.sh
    print_success "Development scripts created"
}

# Setup environment files
setup_env_files() {
    print_step "Setting up environment files..."
    
    # Development environment
    cat > .env.development << 'EOF'
# Development Environment Configuration
NODE_ENV=development
LOG_LEVEL=debug
AUTO_ACCEPT_ENABLED=false
SESSION_TIMEOUT=60
MAX_AUTO_ACCEPTS=100
ALLOWED_OPERATIONS=git_operations,file_operations
SAFETY_CHECKS_ENABLED=true
HOOK_MODE=passive
AUDIT_LOG_PATH=./logs/dev-audit.log
CLAUDE_SETTINGS_DIR=./.claude
EOF

    # Test environment
    cat > .env.test << 'EOF'
# Test Environment Configuration
NODE_ENV=test
LOG_LEVEL=error
AUTO_ACCEPT_ENABLED=false
SESSION_TIMEOUT=30
MAX_AUTO_ACCEPTS=10
ALLOWED_OPERATIONS=git_operations,file_operations
SAFETY_CHECKS_ENABLED=true
HOOK_MODE=passive
AUDIT_LOG_PATH=./test-logs/test-audit.log
CLAUDE_SETTINGS_DIR=./test-claude
EOF

    print_success "Environment files created"
}

# Create useful aliases
create_aliases() {
    print_step "Creating development aliases..."
    
    cat > scripts/aliases.sh << 'EOF'
#!/bin/bash
# Development aliases for Claude Auto-Accept System

# Add these to your shell profile (.bashrc, .zshrc, etc.)
echo "Add these aliases to your shell profile:"
echo ""
echo "# Claude Auto-Accept Development Aliases"
echo "alias caa-dev='npm run dev'"
echo "alias caa-test='npm test'"
echo "alias caa-build='npm run build'"
echo "alias caa-lint='npm run lint:fix'"
echo "alias caa-status='node dist/index.js status'"
echo "alias caa-logs='node dist/index.js logs'"
echo ""
EOF

    chmod +x scripts/aliases.sh
    print_success "Development aliases created"
}

# Main setup process
main() {
    echo -e "${BLUE}"
    echo "╔══════════════════════════════════════════╗"
    echo "║         Development Setup                ║"
    echo "║     Claude Auto-Accept System            ║"
    echo "╚══════════════════════════════════════════╝"
    echo -e "${NC}"
    
    install_dev_deps
    setup_git_hooks
    setup_vscode
    create_dev_scripts
    setup_env_files
    create_aliases
    
    echo ""
    print_success "Development environment setup completed!"
    echo ""
    echo -e "${BLUE}Development Commands:${NC}"
    echo "• npm run dev        - Start development server"
    echo "• npm test           - Run tests"
    echo "• npm run test:watch - Run tests in watch mode"
    echo "• npm run lint       - Check code style"
    echo "• npm run lint:fix   - Fix code style issues"
    echo "• npm run build      - Build for production"
    echo ""
    echo -e "${YELLOW}Useful Scripts:${NC}"
    echo "• ./scripts/test-watch.sh    - Test watch mode"
    echo "• ./scripts/dev-server.sh    - Development server"
    echo "• ./scripts/build-and-test.sh - Full build and test"
    echo "• ./scripts/aliases.sh       - Show useful aliases"
    echo ""
    echo -e "${YELLOW}Next Steps:${NC}"
    echo "1. Run 'source scripts/aliases.sh' to see useful aliases"
    echo "2. Open project in VS Code for optimal development experience"
    echo "3. Run 'npm run dev' to start development"
}

# Run setup
main "$@"
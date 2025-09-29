#!/bin/bash

# Claude Auto-Accept System Installation Script
set -e

echo "🚀 Installing Claude Auto-Accept System..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Helper functions
print_step() {
    echo -e "${BLUE}➜${NC} $1"
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

# Check if Node.js is installed
check_nodejs() {
    print_step "Checking Node.js installation..."
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 18+ from https://nodejs.org/"
        exit 1
    fi
    
    NODE_VERSION=$(node -v | cut -d'v' -f2)
    MAJOR_VERSION=$(echo $NODE_VERSION | cut -d'.' -f1)
    
    if [ "$MAJOR_VERSION" -lt 18 ]; then
        print_error "Node.js version 18 or higher is required. Current version: $NODE_VERSION"
        exit 1
    fi
    
    print_success "Node.js $NODE_VERSION found"
}

# Check if npm is installed
check_npm() {
    print_step "Checking npm installation..."
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install npm"
        exit 1
    fi
    
    NPM_VERSION=$(npm -v)
    print_success "npm $NPM_VERSION found"
}

# Install dependencies
install_dependencies() {
    print_step "Installing dependencies..."
    
    if [ ! -f "package.json" ]; then
        print_error "package.json not found. Make sure you're in the correct directory."
        exit 1
    fi
    
    npm install
    print_success "Dependencies installed"
}

# Build the project
build_project() {
    print_step "Building project..."
    npm run build
    print_success "Project built successfully"
}

# Create necessary directories
create_directories() {
    print_step "Creating necessary directories..."
    mkdir -p logs
    mkdir -p .claude
    print_success "Directories created"
}

# Copy example configuration
setup_config() {
    print_step "Setting up configuration..."
    
    if [ ! -f ".env" ]; then
        if [ -f ".env.example" ]; then
            cp .env.example .env
            print_success "Configuration file created from example"
            print_warning "Please review and update .env file with your settings"
        else
            print_warning ".env.example not found, skipping configuration setup"
        fi
    else
        print_warning ".env file already exists, skipping"
    fi
}

# Create global command link
setup_global_command() {
    print_step "Setting up global command..."
    
    # Make the CLI executable
    chmod +x dist/index.js
    
    # Create a global symlink (optional)
    if command -v npm &> /dev/null; then
        npm link 2>/dev/null || {
            print_warning "Could not create global npm link. You can run the CLI with: node dist/index.js"
        }
        
        if [ $? -eq 0 ]; then
            print_success "Global 'auto-accept' command available"
        fi
    fi
}

# Run tests
run_tests() {
    print_step "Running tests..."
    npm test
    print_success "All tests passed"
}

# Main installation process
main() {
    echo -e "${BLUE}"
    echo "╔══════════════════════════════════════════╗"
    echo "║        Claude Auto-Accept System         ║"
    echo "║             Installation                 ║"
    echo "╚══════════════════════════════════════════╝"
    echo -e "${NC}"
    
    check_nodejs
    check_npm
    install_dependencies
    create_directories
    setup_config
    build_project
    run_tests
    setup_global_command
    
    echo ""
    print_success "Installation completed successfully!"
    echo ""
    echo -e "${BLUE}Next steps:${NC}"
    echo "1. Review and update the .env configuration file"
    echo "2. Run 'npm run dev' to start in development mode"
    echo "3. Run 'auto-accept --help' to see available commands"
    echo "4. Run 'auto-accept status' to check system status"
    echo ""
    echo -e "${YELLOW}Documentation:${NC} See README.md for detailed usage instructions"
    echo -e "${YELLOW}Support:${NC} Check the logs/ directory for troubleshooting"
}

# Run installation
main "$@"
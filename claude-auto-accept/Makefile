# Claude Auto-Accept System Makefile

.PHONY: help install dev build test lint clean setup-dev docker-build docker-run

# Default target
help: ## Show this help message
	@echo "Claude Auto-Accept System - Available Commands:"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}'

# Installation and setup
install: ## Install dependencies and build project
	@echo "🚀 Installing Claude Auto-Accept System..."
	chmod +x scripts/install.sh
	./scripts/install.sh

setup-dev: ## Setup development environment
	@echo "🔧 Setting up development environment..."
	chmod +x scripts/setup-dev.sh
	./scripts/setup-dev.sh

# Development
dev: ## Start development server
	@echo "🔥 Starting development server..."
	npm run dev

# Building
build: ## Build the project for production
	@echo "🔨 Building project..."
	npm run build

# Testing
test: ## Run all tests
	@echo "🧪 Running tests..."
	npm test

test-watch: ## Run tests in watch mode
	@echo "🧪 Running tests in watch mode..."
	npm run test:watch

test-coverage: ## Run tests with coverage report
	@echo "🧪 Running tests with coverage..."
	npm test -- --coverage

# Code quality
lint: ## Run linter
	@echo "🔍 Running linter..."
	npm run lint

lint-fix: ## Fix linting issues
	@echo "🔧 Fixing linting issues..."
	npm run lint:fix

type-check: ## Run TypeScript type checking
	@echo "🔍 Running type checking..."
	npm run type-check

# Utilities
clean: ## Clean build artifacts
	@echo "🧹 Cleaning build artifacts..."
	npm run clean
	rm -rf coverage/
	rm -rf logs/*.log
	rm -rf test-logs/

logs: ## Show recent logs
	@echo "📝 Recent logs:"
	@if [ -f "logs/auto-accept.log" ]; then tail -n 20 logs/auto-accept.log; else echo "No logs found"; fi

audit-logs: ## Show audit logs
	@echo "📋 Audit logs:"
	@if [ -f "logs/auto-accept-audit.log" ]; then tail -n 10 logs/auto-accept-audit.log | jq -r '.timestamp + " " + .decision + " " + .operation'; else echo "No audit logs found"; fi

# Auto-accept commands
status: ## Show auto-accept status
	@node dist/index.js status

enable: ## Enable auto-accept mode
	@node dist/index.js on

disable: ## Disable auto-accept mode
	@node dist/index.js off

config: ## Show configuration
	@node dist/index.js config --show

# Full workflow
ci: clean install build test lint ## Run complete CI pipeline
	@echo "✅ CI pipeline completed successfully!"

release: clean build test lint ## Prepare for release
	@echo "📦 Release preparation completed!"

# Docker support
docker-build: ## Build Docker image
	@echo "🐳 Building Docker image..."
	docker build -t claude-auto-accept .

docker-run: ## Run in Docker container
	@echo "🐳 Running in Docker..."
	docker run -it --rm claude-auto-accept

# Quick commands
quick-test: ## Quick test run (no coverage)
	@npm test -- --passWithNoTests --silent

quick-build: ## Quick build without cleanup
	@npm run build

# Development workflow helpers
fix-all: lint-fix build test ## Fix linting, build, and test
	@echo "🔧 All fixes applied and tests passed!"

pre-commit: lint type-check test ## Run pre-commit checks
	@echo "✅ Pre-commit checks passed!"

# Documentation
docs: ## Generate documentation
	@echo "📚 Generating documentation..."
	@echo "Documentation available in README.md and claude.md"

# Show project info
info: ## Show project information
	@echo "📊 Project Information:"
	@echo "Name: Claude Auto-Accept System"
	@echo "Version: $(shell npm run --silent version)"
	@echo "Node: $(shell node --version)"
	@echo "NPM: $(shell npm --version)"
	@echo "Location: $(shell pwd)"
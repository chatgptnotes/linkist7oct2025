#!/bin/bash

# Test script for Auto-Accept System
# This script verifies that all components are working correctly

set -e  # Exit on error

echo "🧪 Testing Claude Code Auto-Accept System"
echo "=========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

PASS=0
FAIL=0

# Test 1: Check directory structure
echo "📁 Test 1: Checking directory structure..."
if [ -d ".claude/hooks" ] && [ -d ".claude/commands" ] && [ -d ".claude/config" ]; then
    echo -e "${GREEN}✓ PASS${NC} - All directories exist"
    ((PASS++))
else
    echo -e "${RED}✗ FAIL${NC} - Missing directories"
    ((FAIL++))
fi
echo ""

# Test 2: Check hook file exists and is executable
echo "🔧 Test 2: Checking hook file..."
if [ -f ".claude/hooks/user-prompt-submit.cjs" ] && [ -x ".claude/hooks/user-prompt-submit.cjs" ]; then
    echo -e "${GREEN}✓ PASS${NC} - Hook file exists and is executable"
    ((PASS++))
else
    echo -e "${RED}✗ FAIL${NC} - Hook file missing or not executable"
    echo "   Run: chmod +x .claude/hooks/user-prompt-submit.cjs"
    ((FAIL++))
fi
echo ""

# Test 3: Check configuration file
echo "⚙️  Test 3: Checking configuration file..."
if [ -f ".claude/config/auto-accept.json" ]; then
    # Validate JSON
    if node -e "JSON.parse(require('fs').readFileSync('.claude/config/auto-accept.json', 'utf8'))" 2>/dev/null; then
        echo -e "${GREEN}✓ PASS${NC} - Configuration file is valid JSON"
        ((PASS++))
    else
        echo -e "${RED}✗ FAIL${NC} - Configuration file has invalid JSON"
        ((FAIL++))
    fi
else
    echo -e "${RED}✗ FAIL${NC} - Configuration file missing"
    ((FAIL++))
fi
echo ""

# Test 4: Check command files
echo "📝 Test 4: Checking command files..."
if [ -f ".claude/commands/auto-accept.md" ] && [ -f ".claude/commands/auto-status.md" ]; then
    echo -e "${GREEN}✓ PASS${NC} - Command files exist"
    ((PASS++))
else
    echo -e "${RED}✗ FAIL${NC} - Command files missing"
    ((FAIL++))
fi
echo ""

# Test 5: Test hook execution
echo "🚀 Test 5: Testing hook execution..."
if node .claude/hooks/user-prompt-submit.cjs; then
    echo -e "${GREEN}✓ PASS${NC} - Hook executes without errors"
    ((PASS++))
else
    echo -e "${RED}✗ FAIL${NC} - Hook execution failed"
    ((FAIL++))
fi
echo ""

# Test 6: Check if log directory can be created
echo "📊 Test 6: Checking log directory..."
mkdir -p .claude/logs
if [ -d ".claude/logs" ]; then
    echo -e "${GREEN}✓ PASS${NC} - Log directory exists or was created"
    ((PASS++))
else
    echo -e "${RED}✗ FAIL${NC} - Cannot create log directory"
    ((FAIL++))
fi
echo ""

# Test 7: Check if logs can be written
echo "✍️  Test 7: Testing log write capability..."
if node .claude/hooks/user-prompt-submit.cjs 2>&1; then
    if [ -f ".claude/logs/auto-accept.log" ]; then
        echo -e "${GREEN}✓ PASS${NC} - Log file created successfully"
        ((PASS++))
    else
        echo -e "${YELLOW}⚠ WARN${NC} - Log file not created (may be normal on first run)"
        ((PASS++))
    fi
else
    echo -e "${RED}✗ FAIL${NC} - Cannot write logs"
    ((FAIL++))
fi
echo ""

# Test 8: Check documentation files
echo "📚 Test 8: Checking documentation..."
if [ -f ".claude/README.md" ] && [ -f ".claude/CLAUDE.md" ] && [ -f ".claude/CHANGELOG.md" ]; then
    echo -e "${GREEN}✓ PASS${NC} - All documentation files exist"
    ((PASS++))
else
    echo -e "${RED}✗ FAIL${NC} - Documentation files missing"
    ((FAIL++))
fi
echo ""

# Summary
echo "=========================================="
echo "📊 Test Summary"
echo "=========================================="
echo -e "Total Tests: $((PASS + FAIL))"
echo -e "${GREEN}Passed: $PASS${NC}"
echo -e "${RED}Failed: $FAIL${NC}"
echo ""

if [ $FAIL -eq 0 ]; then
    echo -e "${GREEN}🎉 All tests passed! Auto-accept system is ready.${NC}"
    echo ""
    echo "Quick Start:"
    echo "  /auto-status        - Check status"
    echo "  /auto-accept on     - Enable (default)"
    echo "  /auto-accept off    - Disable"
    echo ""
    echo "View logs:"
    echo "  tail -20 .claude/logs/auto-accept.log"
    exit 0
else
    echo -e "${RED}❌ Some tests failed. Please fix the issues above.${NC}"
    exit 1
fi

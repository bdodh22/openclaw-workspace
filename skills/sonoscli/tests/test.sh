#!/bin/bash
# Sonos CLI Skill - Test Suite

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SKILL_DIR="$(dirname "$SCRIPT_DIR")"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

TESTS_RUN=0
TESTS_PASSED=0
TESTS_FAILED=0

run_test() {
  local test_name="$1"
  local test_command="$2"
  
  TESTS_RUN=$((TESTS_RUN + 1))
  
  if eval "$test_command" > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} $test_name"
    TESTS_PASSED=$((TESTS_PASSED + 1))
  else
    echo -e "${RED}✗${NC} $test_name"
    TESTS_FAILED=$((TESTS_FAILED + 1))
  fi
}

echo -e "${YELLOW}Sonos CLI - Test Suite${NC}\n"

# Test SKILL.md
run_test "SKILL.md exists" "test -f '$SKILL_DIR/SKILL.md'"
run_test "SKILL.md has name" "grep -q '^name:' '$SKILL_DIR/SKILL.md'"
run_test "SKILL.md has metadata" "grep -q '^metadata:' '$SKILL_DIR/SKILL.md'"

# Test _meta.json
run_test "_meta.json exists" "test -f '$SKILL_DIR/_meta.json'"
run_test "_meta.json is valid JSON" "python3 -c \"import json; json.load(open('$SKILL_DIR/_meta.json'))\""

# Test .clawhub directory
run_test ".clawhub directory exists" "test -d '$SKILL_DIR/.clawhub'"

echo -e "\n${GREEN}Tests: $TESTS_PASSED/$TESTS_RUN passed${NC}"

[ "$TESTS_FAILED" -gt 0 ] && exit 1
exit 0

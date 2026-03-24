#!/bin/bash
# Memory Manager - Test Suite

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
MEMORY_MANAGER_DIR="$SCRIPT_DIR/.."
TEST_MEMORY_DIR="$SCRIPT_DIR/test-memory"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test counters
TESTS_RUN=0
TESTS_PASSED=0
TESTS_FAILED=0

# Setup test environment
setup() {
  echo -e "${YELLOW}Setting up test environment...${NC}"
  mkdir -p "$TEST_MEMORY_DIR"/{episodic,semantic,procedural,snapshots}
  
  # Create test files
  echo "# Test episodic entry" > "$TEST_MEMORY_DIR/episodic/2026-03-22.md"
  echo "# Test semantic knowledge" > "$TEST_MEMORY_DIR/semantic/test.md"
  echo "# Test procedure" > "$TEST_MEMORY_DIR/procedural/test.md"
  
  export OPENCLAW_WORKSPACE="$SCRIPT_DIR"
}

# Cleanup test environment
cleanup() {
  echo -e "${YELLOW}Cleaning up test environment...${NC}"
  rm -rf "$TEST_MEMORY_DIR"
  unset OPENCLAW_WORKSPACE
}

# Test helper
run_test() {
  local test_name="$1"
  local test_command="$2"
  local expected_exit="${3:-0}"
  
  TESTS_RUN=$((TESTS_RUN + 1))
  
  if eval "$test_command" > /dev/null 2>&1; then
    actual_exit=0
  else
    actual_exit=$?
  fi
  
  if [ "$actual_exit" -eq "$expected_exit" ]; then
    echo -e "${GREEN}✓${NC} $test_name"
    TESTS_PASSED=$((TESTS_PASSED + 1))
  else
    echo -e "${RED}✗${NC} $test_name (expected exit $expected_exit, got $actual_exit)"
    TESTS_FAILED=$((TESTS_FAILED + 1))
  fi
}

# Tests for detect.sh
test_detect() {
  echo -e "\n${YELLOW}Testing detect.sh...${NC}"
  
  run_test "detect.sh runs without errors" \
    "$MEMORY_MANAGER_DIR/detect.sh"
  
  run_test "detect.sh returns exit 0 for safe usage" \
    "$MEMORY_MANAGER_DIR/detect.sh" 0
}

# Tests for stats.sh
test_stats() {
  echo -e "\n${YELLOW}Testing stats.sh...${NC}"
  
  run_test "stats.sh runs without errors" \
    "$MEMORY_MANAGER_DIR/stats.sh"
  
  run_test "stats.sh outputs file counts" \
    "$MEMORY_MANAGER_DIR/stats.sh | grep -q 'Files:'"
  
  run_test "stats.sh outputs memory breakdown" \
    "$MEMORY_MANAGER_DIR/stats.sh | grep -q 'Episodic Memory'"
}

# Tests for init.sh
test_init() {
  echo -e "\n${YELLOW}Testing init.sh...${NC}"
  
  run_test "init.sh creates directory structure" \
    "$MEMORY_MANAGER_DIR/init.sh"
  
  run_test "init.sh creates episodic directory" \
    "test -d '$TEST_MEMORY_DIR/episodic'"
  
  run_test "init.sh creates semantic directory" \
    "test -d '$TEST_MEMORY_DIR/semantic'"
  
  run_test "init.sh creates procedural directory" \
    "test -d '$TEST_MEMORY_DIR/procedural'"
}

# Tests for search.sh
test_search() {
  echo -e "\n${YELLOW}Testing search.sh...${NC}"
  
  run_test "search.sh runs with 'all' type" \
    "$MEMORY_MANAGER_DIR/search.sh all 'test'"
  
  run_test "search.sh runs with 'episodic' type" \
    "$MEMORY_MANAGER_DIR/search.sh episodic 'test'"
  
  run_test "search.sh runs with 'semantic' type" \
    "$MEMORY_MANAGER_DIR/search.sh semantic 'test'"
  
  run_test "search.sh runs with 'procedural' type" \
    "$MEMORY_MANAGER_DIR/search.sh procedural 'test'"
}

# Main test runner
main() {
  echo -e "${YELLOW}================================${NC}"
  echo -e "${YELLOW}Memory Manager - Test Suite${NC}"
  echo -e "${YELLOW}================================${NC}\n"
  
  setup
  
  test_init
  test_detect
  test_stats
  test_search
  
  cleanup
  
  echo -e "\n${YELLOW}================================${NC}"
  echo -e "Tests run: $TESTS_RUN"
  echo -e "${GREEN}Passed: $TESTS_PASSED${NC}"
  echo -e "${RED}Failed: $TESTS_FAILED${NC}"
  echo -e "${YELLOW}================================${NC}\n"
  
  if [ "$TESTS_FAILED" -gt 0 ]; then
    exit 1
  fi
  
  exit 0
}

main "$@"

# GitHub Skill Tests

## Run Tests

```bash
cd skills/github
chmod +x tests/test.sh
./tests/test.sh
```

## Test Coverage

- ✅ SKILL.md structure and content
- ✅ _meta.json validation
- ✅ .clawhub directory structure

## Requirements

Requires `gh` CLI installed:
```bash
# macOS
brew install gh

# Linux
sudo apt install gh

# Or download from https://cli.github.com/
```

## Manual Testing

```bash
# Test gh CLI is available
gh --version

# Test repo access (if in git directory)
gh repo view

# Test PR checks
gh pr checks --limit 5
```

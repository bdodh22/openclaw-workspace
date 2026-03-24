# Sonos CLI Tests

## Run Tests

```bash
cd skills/sonoscli
chmod +x tests/test.sh
./tests/test.sh
```

## Test Coverage

- ✅ SKILL.md structure validation
- ✅ _meta.json validation
- ✅ .clawhub directory structure

## Requirements

Requires `sonos` binary installed via:
```bash
go install github.com/steipete/sonoscli/cmd/sonos@latest
```

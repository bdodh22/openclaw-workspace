# SearXNG Tests

## Run Tests

```bash
cd skills/searxng
pytest tests/ -v
```

## Coverage

```bash
pytest tests/ --cov=scripts/searxng.py --cov-report=term-missing
```

## Test Requirements

```bash
pip install pytest pytest-cov httpx rich
```

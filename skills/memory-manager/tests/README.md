# Memory Manager Tests

## Run Tests

```bash
cd skills/memory-manager
chmod +x tests/test.sh
./tests/test.sh
```

## Test Coverage

The test suite covers:
- ✅ `init.sh` - Directory structure creation
- ✅ `detect.sh` - Compression detection
- ✅ `stats.sh` - Statistics output
- ✅ `search.sh` - Search functionality

## Manual Testing

### Test init.sh
```bash
./init.sh
ls -la memory/
# Should see: episodic/, semantic/, procedural/, snapshots/
```

### Test detect.sh
```bash
./detect.sh
# Should output memory usage percentage and status
```

### Test stats.sh
```bash
./stats.sh
# Should output detailed statistics
```

### Test search.sh
```bash
./search.sh all "test query"
./search.sh episodic "test query"
./search.sh semantic "test query"
./search.sh procedural "test query"
```

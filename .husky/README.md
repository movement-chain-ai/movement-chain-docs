# Git Hooks Configuration

This directory contains Git hooks managed by [Husky](https://typicode.github.io/husky/).

## Available Hooks

### commit-msg
- **Purpose**: Validates commit message format
- **Runs**: When you create a commit
- **Checks**: Enforces Conventional Commits format
- **Speed**: Very fast (< 1 second)

### pre-commit
- **Purpose**: Validates code quality before committing
- **Runs**: Before creating a commit
- **Checks**:
  - Markdown linting (auto-fix enabled)
  - Link validation on changed files only
  - TODO/FIXME detection (warning only)
- **Speed**: Fast (< 10 seconds) - only checks changed files

### pre-push
- **Purpose**: Ensures documentation builds and all links work
- **Runs**: Before pushing to remote
- **Checks**:
  - MkDocs build with strict mode
  - Comprehensive link check on all documentation
- **Speed**: Slower (30-60 seconds) - checks entire documentation

## Setup

After cloning the repository, run:

```bash
npm install
```

This will automatically set up all Git hooks via the `prepare` script.

## Bypassing Hooks (Use Sparingly)

If you absolutely need to bypass hooks (not recommended):

```bash
# Skip pre-commit and commit-msg hooks
git commit --no-verify -m "emergency fix"

# Skip pre-push hook
git push --no-verify
```

## Troubleshooting

### Hooks not running
```bash
# Reinstall Husky
npm run prepare
```

### Permission denied
```bash
# Make hooks executable
chmod +x .husky/*
```

### Disable hooks temporarily
```bash
# Set environment variable
export HUSKY=0

# Your git operations...

# Re-enable
unset HUSKY
```

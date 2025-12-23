# Git Hooks Setup Guide

## Quick Start

Install dependencies and activate Git hooks:

```bash
npm install
```

That's it! The hooks are now active and will run automatically on commits and pushes.

## What Got Installed?

### Dependencies

- **Husky v9**: Modern Git hooks manager
- **Commitlint**: Enforces Conventional Commits format
- **lint-staged**: Runs linters on staged files only
- **markdownlint-cli**: Markdown linting and formatting
- **markdown-link-check**: Validates links in markdown files

### Git Hooks Created

1. **commit-msg** - Validates commit message format
2. **pre-commit** - Fast checks on staged files only
3. **pre-push** - Comprehensive validation before pushing

## Commit Message Format

Your commits must follow the Conventional Commits format:

```text
<type>(<scope>): <subject>

[optional body]

[optional footer]
```

### Valid Types

| Type | Description | Example |
|------|-------------|---------|
| `docs` | Documentation changes | `docs: add API reference` |
| `feat` | New features | `feat(auth): add OAuth support` |
| `fix` | Bug fixes | `fix: correct broken link in README` |
| `chore` | Maintenance tasks | `chore: update dependencies` |
| `style` | Formatting changes | `style: fix markdown formatting` |
| `refactor` | Code restructuring | `refactor: reorganize docs structure` |

### Examples

```bash
# Good commit messages
git commit -m "docs: add deployment guide"
git commit -m "feat(api): add user management section"
git commit -m "fix: correct broken links in architecture docs"
git commit -m "chore: update mkdocs configuration"

# Bad commit messages (will be rejected)
git commit -m "updated docs"           # Missing type
git commit -m "Docs: add guide"        # Type must be lowercase
git commit -m "docs add guide"         # Missing colon
git commit -m "documentation changes"  # Invalid type
```

## Hook Behavior

### commit-msg Hook

- **Triggers**: On every commit
- **Duration**: < 1 second
- **Blocks commit**: YES (if message format is invalid)
- **Can bypass**: `git commit --no-verify`

### pre-commit Hook

- **Triggers**: Before creating commit
- **Duration**: < 10 seconds (only checks changed files)
- **Checks**:
  - Markdown linting with auto-fix
  - Link validation on changed files
  - TODO/FIXME detection (warning only)
- **Blocks commit**: YES (if markdown lint fails)
- **Can bypass**: `git commit --no-verify`

### pre-push Hook

- **Triggers**: Before pushing to remote
- **Duration**: 30-60 seconds (checks all documentation)
- **Checks**:
  - MkDocs build with `--strict` mode
  - Comprehensive link check on all docs
- **Blocks push**: YES (if build fails)
- **Can bypass**: `git push --no-verify`

## Running Checks Manually

```bash
# Lint all markdown files
npm run lint:md

# Check all links
npm run lint:links

# Test documentation build
npm run test:build

# Run lint-staged manually
npx lint-staged
```

## Troubleshooting

### Hooks not running after npm install

```bash
# Manually trigger Husky setup
npm run prepare

# Verify hooks are executable
chmod +x .husky/*
```

### "command not found" errors in hooks

Make sure all dependencies are installed:

```bash
npm install
```

### Temporarily disable hooks

```bash
# For one commit
git commit --no-verify -m "docs: emergency fix"

# For one push
git push --no-verify

# Disable for entire session
export HUSKY=0
# ... do your git operations ...
unset HUSKY
```

### Permission denied errors

```bash
# Make all hooks executable
chmod +x .husky/commit-msg .husky/pre-commit .husky/pre-push .husky/_/husky.sh
```

## Configuration Files

### commitlint.config.js

Configures commit message rules and valid types.

### .markdownlint.json

Configures markdown linting rules (relaxed for documentation).

### package.json

- `prepare` script: Automatically runs `husky` to set up hooks
- `lint-staged`: Configures which linters run on which files

## Best Practices

1. **Never bypass hooks** unless absolutely necessary (production hotfix, etc.)
2. **Fix issues locally** rather than bypassing - hooks catch problems early
3. **Use descriptive commit messages** - they become your project history
4. **Test before pushing** - pre-push hook ensures quality but takes time
5. **Keep commits focused** - one logical change per commit

## Advanced Usage

### Skip specific hooks

```bash
# Skip only pre-commit
HUSKY_SKIP_HOOKS=1 git commit -m "docs: skip pre-commit"

# Skip only pre-push
HUSKY_SKIP_HOOKS=1 git push
```

### Debug hook execution

```bash
# Enable debug mode
export HUSKY_DEBUG=1
git commit -m "docs: test with debug"
```

### Customize hook behavior

Edit the hook files in `.husky/` directory to modify behavior.

## Additional Resources

- [Husky Documentation](https://typicode.github.io/husky/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Commitlint](https://commitlint.js.org/)
- [MkDocs](https://www.mkdocs.org/)

# GitHub Actions Workflows for Movement Chain AI Docs

This directory contains automated workflows for the Movement Chain AI documentation site.

---

## Workflows

### 1. PR Validation (`pr-validation.yml`)

**Purpose:** Validates pull requests before they can be merged to main, ensuring documentation quality, correctness, and consistency.

#### Trigger Conditions

The workflow runs automatically when:

1. **Pull request opened** against `main` branch
2. **Pull request synchronized** (new commits pushed)
3. **Pull request reopened**

#### Concurrency Control

```yaml
concurrency:
  group: pr-validation-${{ github.event.pull_request.number }}
  cancel-in-progress: true
```

**What this means:**
- Only one validation runs per PR at a time
- When new commits are pushed, the old validation is cancelled
- Saves CI/CD resources and provides faster feedback

#### Validation Checks

The workflow performs five comprehensive checks:

##### 1. Markdown Linting
- **Tool:** `markdownlint-cli`
- **Config:** `.markdownlint.json`
- **What it checks:**
  - Consistent heading styles
  - Proper list formatting
  - Code block syntax
  - Trailing whitespace
  - Line length (configurable)

##### 2. Link Validation
- **Tool:** `markdown-link-check`
- **Config:** `.markdown-link-check.json`
- **What it checks:**
  - Broken external links (HTTP status codes)
  - Broken internal links (file references)
  - Anchor links validity
  - Retries failed links with exponential backoff

##### 3. YAML Configuration Validation
- **Tool:** Python PyYAML
- **What it checks:**
  - `mkdocs.yml` syntax is valid
  - No YAML parsing errors
  - Configuration structure is correct

##### 4. Documentation Build Test
- **Tool:** `mkdocs build --strict --verbose`
- **What it checks:**
  - All referenced files exist
  - No build warnings or errors
  - Theme and plugins load correctly
  - Navigation structure is valid
  - Generates complete site successfully

##### 5. Internal Reference Validation
- **Tool:** Custom Python script
- **What it checks:**
  - All files referenced in `nav:` section exist
  - No orphaned documentation files
  - Navigation paths are correct

#### Workflow Jobs

##### Job 1: validate-docs
1. **Checkout code** - Full PR branch with history
2. **Setup Python 3.11** - With pip cache enabled
3. **Install Python dependencies** - MkDocs and plugins
4. **Setup Node.js 20** - For markdown tools
5. **Install markdown tools** - markdownlint-cli and markdown-link-check
6. **Run all validation checks** - With detailed error reporting
7. **Upload build artifacts** - Generated site/ directory (1 day retention)

##### Job 2: validation-summary
1. **Generate comprehensive summary** - With check results
2. **Create step summary** - Visible in GitHub UI
3. **Fail workflow if checks failed** - Blocks PR merge

#### Build Artifacts

The workflow uploads the built documentation as an artifact:
- **Name:** `documentation-build-pr-<number>`
- **Contents:** Complete `site/` directory
- **Retention:** 1 day
- **Use case:** Preview the built site before merge

To download:
1. Go to workflow run in Actions tab
2. Scroll to "Artifacts" section
3. Download `documentation-build-pr-<number>`
4. Extract and open `index.html` in browser

#### GitHub Step Summary

The workflow creates a detailed summary visible in the PR:
- Overall validation status
- Individual check results
- Links to full logs
- Links to PR and changed files
- Troubleshooting hints for common issues

#### Configuration Files

##### `.markdownlint.json`
Controls markdown linting rules:
```json
{
  "default": true,
  "MD013": false,  // Disable line length check
  "MD033": false,  // Allow HTML in markdown
  "MD041": false   // Allow non-heading first line
}
```

##### `.markdown-link-check.json`
Controls link validation:
```json
{
  "ignorePatterns": [
    { "pattern": "^http://localhost" }
  ],
  "timeout": "20s",
  "retryOn429": true,
  "retryCount": 3
}
```

---

### 2. Deploy MkDocs to GitHub Pages (`deploy-docs.yml`)

**Purpose:** Automatically builds and deploys the MkDocs documentation site to GitHub Pages whenever changes are pushed to the main branch.

#### Trigger Conditions

The workflow runs automatically when:

1. **Push to `main` branch** with changes to:
   - `docs/**` - Any documentation content files
   - `mkdocs.yml` - MkDocs configuration file
   - `.github/workflows/deploy-docs.yml` - The workflow file itself

2. **Manual trigger** via GitHub UI (workflow_dispatch)

#### Path Filtering Logic

The workflow uses **path filters** to avoid unnecessary builds:

```yaml
paths:
  - 'docs/**'           # Documentation content
  - 'mkdocs.yml'        # Site configuration
  - '.github/workflows/deploy-docs.yml'  # Workflow changes
```

**What this means:**
- Changes to README.md, source code, or other files **will NOT trigger** a deployment
- Only documentation-related changes trigger the workflow
- This saves CI/CD resources and reduces deployment frequency

#### Workflow Steps

##### Build Job
1. **Checkout repository** - Fetches all code with full git history
2. **Set up Python 3.11** - Installs Python with pip caching enabled
3. **Cache dependencies** - Caches pip packages for faster builds
4. **Install dependencies** - Installs MkDocs and plugins from `requirements.txt`
5. **Verify configuration** - Checks MkDocs and Material theme versions
6. **Build site** - Runs `mkdocs build --strict --verbose`
   - `--strict`: Fails on warnings (ensures documentation quality)
   - `--verbose`: Provides detailed build output for debugging
7. **Upload artifact** - Stores the built `site/` directory

##### Deploy Job
1. **Deploy to GitHub Pages** - Publishes the built site to gh-pages branch
2. **Set environment URL** - Provides the live site URL in workflow output

#### Caching Strategy

The workflow implements a **two-layer caching strategy**:

1. **Python cache** (via `setup-python`)
   - Caches pip packages based on Python version
   - Automatic cache key management

2. **Pip cache** (via `actions/cache`)
   - Key: `${{ runner.os }}-pip-${{ hashFiles('requirements.txt') }}`
   - Invalidates when `requirements.txt` changes
   - Fallback to previous cache if exact match not found

**Benefits:**
- Faster builds (dependencies only download on first run or when requirements change)
- Reduced GitHub Actions minutes usage
- More reliable builds with consistent dependency versions

#### Permissions

The workflow requires specific GitHub token permissions:

```yaml
permissions:
  contents: read      # Read repository contents
  pages: write        # Write to GitHub Pages
  id-token: write     # Required for OIDC authentication
```

These permissions follow the **principle of least privilege** - only what's needed for deployment.

#### Concurrency Control

```yaml
concurrency:
  group: "pages"
  cancel-in-progress: true
```

**What this does:**
- Only one deployment runs at a time
- If a new deployment starts while one is running, the old one is cancelled
- Prevents race conditions and conflicting deployments

---

## Testing the Workflow

### Local Testing (Before Push)

Test the build locally to catch issues early:

```bash
# 1. Install dependencies
pip install -r requirements.txt

# 2. Build the site (strict mode like CI)
mkdocs build --strict --verbose

# 3. Serve locally to preview
mkdocs serve
```

Visit `http://127.0.0.1:8000` to preview your changes.

### Testing Path Filters

To verify path filtering works:

1. **Should trigger deployment:**
   ```bash
   # Make a change to documentation
   echo "Test change" >> docs/index.md
   git add docs/index.md
   git commit -m "Test docs change"
   git push origin main
   ```

2. **Should NOT trigger deployment:**
   ```bash
   # Make a change to non-docs files
   echo "Test change" >> README.md
   git add README.md
   git commit -m "Update README"
   git push origin main
   ```

### Manual Workflow Trigger

You can manually trigger the workflow:

1. Go to **Actions** tab in GitHub repository
2. Select **Deploy MkDocs to GitHub Pages** workflow
3. Click **Run workflow** button
4. Select branch (usually `main`)
5. Click **Run workflow**

---

## Testing Workflows

### Testing PR Validation (Before Creating PR)

Test all validation checks locally before creating a PR:

```bash
# 1. Install Node.js dependencies for linting
npm install -g markdownlint-cli markdown-link-check

# 2. Install Python dependencies
pip install -r requirements.txt

# 3. Run markdown linting
markdownlint 'docs/**/*.md' --config .markdownlint.json

# 4. Check for broken links
find docs -name "*.md" -exec markdown-link-check {} \;

# 5. Validate mkdocs.yml
python -c "import yaml; yaml.safe_load(open('mkdocs.yml'))"

# 6. Build documentation (strict mode)
mkdocs build --strict --verbose

# 7. Preview the site
mkdocs serve
```

If all commands succeed, your PR will likely pass validation.

### Testing PR Validation Workflow Changes

When modifying the workflow itself:

1. **Validate YAML syntax:**
   ```bash
   # Use GitHub's action-validator or yamllint
   yamllint .github/workflows/pr-validation.yml
   ```

2. **Test on a draft PR:**
   - Create a draft PR to test workflow changes
   - Review workflow logs carefully
   - Make adjustments as needed

3. **Use act for local testing** (optional):
   ```bash
   # Install act: https://github.com/nektos/act
   brew install act

   # Run PR validation locally
   act pull_request -W .github/workflows/pr-validation.yml
   ```

---

## Troubleshooting

### PR Validation Issues

#### Issue: "Markdown linting failed"

**Cause:** Markdown files don't follow style guidelines

**Solution:**
1. Run `markdownlint 'docs/**/*.md'` locally to see specific errors
2. Common fixes:
   - Use ATX-style headers (# ## ###)
   - Ensure consistent list markers (- or *)
   - Add blank lines around code blocks
   - Remove trailing whitespace
3. Auto-fix many issues: `markdownlint 'docs/**/*.md' --fix`
4. Adjust `.markdownlint.json` if rules are too strict

#### Issue: "Link validation failed"

**Cause:** Broken or unreachable links in documentation

**Solution:**
1. Run `markdown-link-check` locally on specific files
2. Common issues:
   - Typos in URLs
   - Links to localhost or private resources
   - External sites temporarily down (retry later)
   - Incorrect relative paths
3. Add problematic URLs to ignore list in `.markdown-link-check.json`:
   ```json
   {
     "ignorePatterns": [
       { "pattern": "^http://example.com/flaky-endpoint" }
     ]
   }
   ```

#### Issue: "YAML validation failed"

**Cause:** Invalid syntax in `mkdocs.yml`

**Solution:**
1. Check for:
   - Missing colons or incorrect indentation
   - Unquoted special characters
   - Invalid YAML structure
2. Test locally: `python -c "import yaml; yaml.safe_load(open('mkdocs.yml'))"`
3. Use a YAML validator or IDE with YAML support
4. Common issues:
   - Tabs instead of spaces (use 2 spaces)
   - Special characters in strings (use quotes)
   - Incorrect nesting levels

#### Issue: "Build test failed"

**Cause:** MkDocs cannot build the site

**Solution:**
1. Run `mkdocs build --strict --verbose` locally
2. Common causes:
   - Missing files referenced in `nav:` section
   - Invalid markdown syntax
   - Missing or incompatible plugins
   - Broken internal links
3. Check error messages for specific files/lines
4. Verify all files in navigation exist:
   ```bash
   # List all files in nav
   grep -E '\.md$' mkdocs.yml

   # Check if they exist
   grep -E '\.md$' mkdocs.yml | awk '{print $NF}' | while read f; do
     [ -f "docs/$f" ] || echo "Missing: $f"
   done
   ```

#### Issue: "Internal reference validation failed"

**Cause:** Navigation references non-existent files

**Solution:**
1. Review the workflow logs for specific missing files
2. Check that all files in `mkdocs.yml` nav section exist in `docs/`
3. Verify file paths are correct (case-sensitive)
4. Ensure files have the correct extension (`.md`)

#### Issue: "Workflow not running on PR"

**Cause:** PR not targeting `main` branch or workflow disabled

**Solution:**
1. Verify PR targets `main` branch
2. Check workflow file exists in `.github/workflows/`
3. Ensure workflows are enabled in repository settings
4. Check for YAML syntax errors in workflow file

---

### Deployment Issues

### Build Failures

#### Issue: "Configuration error" or "File not found"

**Cause:** MkDocs can't find files referenced in `mkdocs.yml`

**Solution:**
1. Check that all files in `nav:` section exist
2. Verify file paths are relative to `docs/` directory
3. Run `mkdocs build --strict` locally to reproduce

#### Issue: "Theme not found" or "Plugin not found"

**Cause:** Missing dependencies in `requirements.txt`

**Solution:**
1. Check `requirements.txt` includes all required packages
2. Update version constraints if needed
3. Test locally: `pip install -r requirements.txt`

#### Issue: "Strict mode: warnings detected"

**Cause:** MkDocs found warnings (broken links, invalid markdown, etc.)

**Solution:**
1. Run `mkdocs build --strict --verbose` locally
2. Fix warnings shown in output
3. Common issues:
   - Broken internal links
   - Missing images
   - Invalid markdown syntax

### Deployment Failures

#### Issue: "deployment failed" or "pages build failed"

**Cause:** GitHub Pages deployment error

**Solution:**
1. Check **Settings → Pages** in repository
2. Ensure source is set to **GitHub Actions**
3. Verify repository has Pages enabled
4. Check workflow permissions are correct

#### Issue: "Permission denied" errors

**Cause:** Insufficient GitHub token permissions

**Solution:**
1. Verify workflow has correct permissions block
2. Check repository settings don't restrict Actions permissions
3. Ensure GITHUB_TOKEN has necessary scopes

### Cache Issues

#### Issue: "Old dependencies being used"

**Cause:** Stale cache

**Solution:**
1. Update `requirements.txt` (this invalidates cache)
2. Or manually clear cache:
   - Go to **Actions → Caches**
   - Delete relevant cache entries

#### Issue: "Cache restore failed"

**Cause:** Cache corruption or size limits

**Solution:**
- This is usually harmless - workflow will rebuild cache
- If persistent, delete all caches and let them rebuild

### Path Filter Issues

#### Issue: "Workflow didn't run when it should have"

**Cause:** Changes not in filtered paths

**Solution:**
1. Check which files changed: `git diff --name-only HEAD~1`
2. Verify paths match filters in workflow
3. Use manual trigger if needed

#### Issue: "Workflow runs on every push"

**Cause:** Path filters not working

**Solution:**
1. Verify path filters use correct syntax
2. Check for typos in path patterns
3. Ensure files aren't in filtered paths unintentionally

---

## Workflow Maintenance

### Updating Dependencies

To update MkDocs or plugins:

1. Edit `requirements.txt`:
   ```
   mkdocs>=1.6.0           # Update version
   mkdocs-material>=9.6.0  # Update version
   ```

2. Test locally:
   ```bash
   pip install -r requirements.txt --upgrade
   mkdocs build --strict
   ```

3. Commit and push:
   ```bash
   git add requirements.txt
   git commit -m "Update MkDocs dependencies"
   git push origin main
   ```

### Monitoring Workflow Performance

Track workflow efficiency:

1. **Build time:** Check Actions logs for duration
2. **Cache hit rate:** Look for "Cache restored" messages
3. **Failure rate:** Monitor failed workflow runs

**Optimization tips:**
- Keep dependencies minimal
- Use caching effectively
- Consider path filters to reduce runs

---

## Security Best Practices

1. **Minimal permissions:** Workflow only requests needed permissions
2. **Pinned actions:** Use specific version tags (e.g., `@v4`) not `@main`
3. **No secrets in docs:** Never commit API keys or credentials
4. **Branch protection:** Protect `main` and `gh-pages` branches
5. **Review changes:** Check workflow changes in PRs carefully

---

## Additional Resources

- [MkDocs Documentation](https://www.mkdocs.org/)
- [Material for MkDocs](https://squidfunk.github.io/mkdocs-material/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)

---

## Support

For issues or questions:

1. Check this troubleshooting guide
2. Review GitHub Actions logs
3. Test locally first
4. Check MkDocs/Material documentation
5. Open an issue in the repository

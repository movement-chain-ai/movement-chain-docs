# GitHub Actions Workflows for Movement Chain AI Docs

This directory contains automated workflows for the Movement Chain AI documentation site.

---

## Workflows

### 1. Deploy MkDocs to GitHub Pages (`deploy-docs.yml`)

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

## Troubleshooting

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

# Manual GitHub Pages Deployment Guide

## Overview

The manual deployment workflow (`deploy-frontend-manual.yml`) allows you to deploy any branch to GitHub Pages for preview and review purposes.

## When to Use

- **Feature Branch Preview**: Test your changes on GitHub Pages before merging
- **Quick Demo**: Show stakeholders a feature branch without merging to main
- **Review Process**: Deploy PR branches for easier review
- **Hotfix Testing**: Verify fixes in a live environment before merge

## How to Deploy

### Step 1: Navigate to Actions
1. Go to your GitHub repository
2. Click on the **Actions** tab
3. In the left sidebar, find **"Deploy Frontend to GitHub Pages (Manual)"**

### Step 2: Start Workflow
1. Click the workflow name
2. Click the **"Run workflow"** button (top right)

### Step 3: Configure Deployment
You'll see a dropdown with options:

**Branch Selection:**
- **Leave empty** (default): Deploys the currently selected branch in the dropdown
- **Enter branch name**: Deploys the specified branch (e.g., `feature/new-ui`, `fix/bug-123`)

### Step 4: Execute
1. Select the base branch from the "Use workflow from" dropdown (if different from main)
2. Enter a branch name in the "Branch to deploy from" field (optional)
3. Click **"Run workflow"** button

### Step 5: Monitor Progress
1. The workflow will appear in the runs list
2. Click on the run to see live progress
3. Wait for both "Build" and "Deploy" jobs to complete (usually 2-3 minutes)

### Step 6: Access Deployment
Once complete, your branch is live at:
```
https://<username>.github.io/<repository>/
```

**Note**: This URL is shared with the automatic deployment. Each manual deployment overwrites the previous deployment.

## Examples

### Example 1: Deploy Current Branch
```
Use workflow from: feature/new-dashboard
Branch to deploy from: [leave empty]
```
Result: Deploys `feature/new-dashboard`

### Example 2: Deploy Specific Branch
```
Use workflow from: main
Branch to deploy from: feature/experimental-ui
```
Result: Deploys `feature/experimental-ui`

### Example 3: Deploy PR Branch
```
Use workflow from: main
Branch to deploy from: fix/responsive-layout
```
Result: Deploys `fix/responsive-layout` for review

## Important Notes

### Deployment Behavior
- ✅ Deploys to the **same URL** as automatic deployment
- ✅ **Overwrites** current GitHub Pages content
- ✅ Uses **standalone mode** with mock data (no backend)
- ✅ Same configuration as automatic deployment

### Concurrency
- Only **one deployment at a time** (uses "pages" concurrency group)
- If another deployment is running, this one will wait
- In-progress deployments are **not cancelled**

### Branch Requirements
- Branch must exist in the repository
- Branch must have a properly structured `frontend/` directory with:
  - Valid `package.json` with required dependencies
  - `package-lock.json` for reproducible builds
  - Source files in standard structure (src/, public/, etc.)

### Reverting
To revert to main branch deployment:
1. Manually trigger this workflow
2. Leave branch input empty or enter `main`
3. Or wait for the next push to main (automatic deployment)

## Troubleshooting

### Workflow Not Appearing
- Ensure you're on the correct repository
- Check that you have appropriate permissions
- Verify workflow file exists in `.github/workflows/`

### Build Fails
- Check if branch name is correct
- Verify frontend dependencies are up to date
- Review workflow logs for specific errors

### Deployment Doesn't Update
- Clear browser cache
- Wait 1-2 minutes for CDN propagation
- Check workflow completed successfully

### Wrong Branch Deployed
- Double-check branch name spelling
- Verify branch exists with: `git branch -r | grep "your-branch-name"`
- Re-run workflow with correct branch name

## Comparison with Automatic Deployment

| Feature | Automatic | Manual |
|---------|-----------|--------|
| Trigger | Push to main/master | Manual dispatch |
| Branch | main/master only | Any branch |
| When | On frontend changes | On demand |
| Use Case | Production demo | Feature preview |
| URL | Same GitHub Pages URL | Same GitHub Pages URL |

## Best Practices

1. **Communicate**: Let team know when deploying manually to avoid confusion
2. **Document**: Add comment in PR when deploying for review
3. **Clean Up**: Redeploy main after reviewing feature branch
4. **Test Locally**: Always test locally before deploying to Pages
5. **Monitor**: Watch workflow logs for any issues

## GitHub Pages Configuration

The deployment uses:
- **Mode**: Standalone (no backend)
- **Base Path**: `/BuildFlow/`
- **Mock Data**: Enabled
- **Mock Auth**: Enabled
- **Environment**: Development profile

For details, see `frontend/.env.github-pages` and `frontend/GITHUB_PAGES.md`.

---

**Need Help?** Check the workflow logs in the Actions tab or review the main README in this directory.

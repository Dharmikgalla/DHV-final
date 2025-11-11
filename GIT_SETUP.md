# Git Repository Setup Guide

This guide will help you push your code to a Git repository.

## Prerequisites

- Git installed on your system
- A GitHub/GitLab/Bitbucket account (or any Git hosting service)
- Repository URL from your hosting service

## Step 1: Initialize Git Repository (if not already initialized)

```bash
cd "C:\Users\SANJAY\Downloads\Dharmik\DHV\DHV-project-2"
git init
```

## Step 2: Add All Files

```bash
# Add all files to staging
git add .

# Check what will be committed
git status
```

## Step 3: Create Initial Commit

```bash
git commit -m "Initial commit: Interactive Hierarchical Clustering Visualization

- Complete Next.js application with clustering visualizations
- Support for multiple datasets (Medical, Crime, Customer)
- Interactive dendrogram and scatter plot visualizations
- Educational video and real-life examples
- Comprehensive documentation and README"
```

## Step 4: Add Remote Repository

Add the remote repository:

```bash
# For GitHub (HTTPS)
git remote add origin https://github.com/Dharmikgalla/DHV-final.git

# Or if you prefer SSH:
# git remote add origin git@github.com:Dharmikgalla/DHV-final.git
```

## Step 5: Push to Repository

```bash
# Push to main branch (or master if that's your default)
git branch -M main
git push -u origin main

# If you encounter authentication issues, you may need to:
# - Set up SSH keys for GitHub
# - Or use GitHub CLI: gh auth login
# - Or use personal access token for HTTPS
```

## Step 6: Verify Push

Check your repository on GitHub/GitLab to ensure all files are uploaded.

## Important Notes

### Files Included
- All source code in `app/` directory
- Configuration files (package.json, tsconfig.json, etc.)
- Documentation (README.md, LICENSE)
- Dataset CSV files in `attached_assets/`
- Video file in `public/`

### Files Excluded (via .gitignore)
- `node_modules/` - Dependencies (install with `npm install`)
- `.next/` - Build output (generated with `npm run build`)
- Environment files (`.env*`)
- IDE configuration files
- OS-specific files

### After Pushing

1. **Add Screenshots**: Take screenshots of your application and add them to the `screenshots/` directory, then commit and push:
   ```bash
   git add screenshots/
   git commit -m "Add UI screenshots"
   git push
   ```

2. **Update README**: If you add screenshots, the README already references them, so they'll automatically appear.

3. **Set Repository Description**: On GitHub, add a description like:
   "Interactive web application for visualizing hierarchical clustering algorithms with real-time dendrograms and scatter plots"

## Troubleshooting

### Authentication Issues

**For HTTPS:**
- Use a Personal Access Token instead of password
- GitHub: Settings → Developer settings → Personal access tokens

**For SSH:**
- Generate SSH key: `ssh-keygen -t ed25519 -C "your_email@example.com"`
- Add to GitHub: Settings → SSH and GPG keys

### Large Files

If you encounter issues with the video file:
- Consider using Git LFS: `git lfs track "*.mp4"`
- Or host the video externally and update the path

### Branch Protection

If your repository has branch protection:
- Create a pull request instead of pushing directly
- Or request branch protection to be temporarily disabled

## Next Steps

1. ✅ Code is pushed to repository
2. ⏳ Add screenshots to `screenshots/` directory
3. ⏳ Update repository description and topics on GitHub
4. ⏳ Add repository to your portfolio/profile

---

**Need Help?** Check Git documentation or your hosting service's help pages.


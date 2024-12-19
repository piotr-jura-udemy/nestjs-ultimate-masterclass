## Prerequisites

### Git

- **Windows**: Download and run installer from [git-scm.com](https://git-scm.com)
- **Mac**: Run `brew install git` or download from [git-scm.com](https://git-scm.com)
- **Linux**: Run `sudo apt install git` (Ubuntu/Debian) or `sudo dnf install git` (Fedora)

After installing, set up Git:

```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

No, let me revise to make it work everywhere:

### Setting up GitHub SSH Key

#### Windows

In Git Bash:

```bash
# Generate key
ssh-keygen -t ed25519 -C "your.email@example.com"
# Press Enter for default location and no passphrase

# Start SSH agent
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519

# Display key to copy
cat ~/.ssh/id_ed25519.pub
```

#### Mac/Linux

In Terminal:

```bash
# Generate key
ssh-keygen -t ed25519 -C "your.email@example.com"
# Press Enter for default location and no passphrase

# Start SSH agent
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519

# Mac: Copy key to clipboard
pbcopy < ~/.ssh/id_ed25519.pub

# Linux: Display key to copy
cat ~/.ssh/id_ed25519.pub
```

Then:

1. Go to GitHub.com → Settings → SSH Keys → New SSH Key
2. Paste your key and save
3. Test with: `ssh -T git@github.com`

### Connecting Local Repository to GitHub

#### HTTPS method (username + token):

```bash
git remote add origin https://github.com/username/repository.git
git push -u origin main
```

You'll need to enter your GitHub username and Personal Access Token as password.

#### SSH method (if you set up SSH key):

```bash
git remote add origin git@github.com:username/repository.git
git push -u origin main
```

#### Check your remote:

```bash
git remote -v
```

After this, you can just use `git push` and `git pull`.

Note: Replace `username/repository` with your actual GitHub username and repository name.

## Deployment

### Configuration Files

#### Dockerfile

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "start:prod"]
```

Creates a lightweight container with your app, installing only production dependencies.

#### .dockerignore

```
node_modules
dist
.git
.env
```

Excludes unnecessary files from the container to keep it small and secure.

### Health Check

```typescript
@Get('/health')
check() {
  return true;
}
```

Endpoint that DigitalOcean uses to verify your app is running.

### Deploy to DigitalOcean App Platform

1. Log in to DigitalOcean
2. Create New App → Choose GitHub repo
3. Select "Dockerfile" as build method
4. Add environment variables:
   - Database URL (if using managed database)
   - Any other environment variables your app needs
5. Click Deploy

Your app will automatically deploy when you push to the main branch. DigitalOcean handles SSL, scaling, and container management for you.

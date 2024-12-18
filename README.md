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

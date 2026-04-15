# 🤝 Contributing to TitanChart

Thank you for taking the time to contribute! This document explains how to get involved.

---

## 🐛 Reporting Bugs

1. Check [existing issues](../../issues) first — it may already be reported
2. Click **New Issue** → **Bug Report**
3. Fill in the template completely — especially:
   - Steps to reproduce
   - Expected vs actual behavior
   - Your environment (OS, Node version, etc.)

---

## 💡 Requesting Features

1. Check [existing issues](../../issues) for similar requests
2. Click **New Issue** → **Feature Request**
3. Explain the use case — why is this useful?

---

## 🔧 Submitting a Pull Request

### Setup

```bash
git clone https://github.com/AKIB473/titanchart.git
cd titanchart
npm install
```

### Workflow

```bash
# Create a branch
git checkout -b fix/your-fix-name

# Make changes
# ...

# Test your changes
npm run lint
npm run test

# Commit (follow conventional commits)
git commit -m "fix: describe what you fixed"

# Push
git push origin fix/your-fix-name

# Open a Pull Request on GitHub
```

### Commit Message Format

Use [Conventional Commits](https://www.conventionalcommits.org/):

| Type | When to use |
|------|-------------|
| `feat:` | New feature |
| `fix:` | Bug fix |
| `docs:` | Documentation only |
| `style:` | Formatting, no logic change |
| `refactor:` | Code refactor, no feature/fix |
| `test:` | Adding or updating tests |
| `chore:` | Build system, CI changes |
| `ci:` | GitHub Actions changes |

### PR Checklist

Before opening a PR, make sure:
- [ ] `npm run lint` passes
- [ ] `npm run test` passes
- [ ] Changes are described clearly in the PR description
- [ ] If it's a new feature — it works end to end

---

## 📝 Code Style

- Use **2 spaces** for indentation
- Use **single quotes** for strings
- Keep functions small and focused
- Comment complex logic

---

## ❓ Questions?

Open an [issue](../../issues) with the `question` label or start a [discussion](../../discussions).

Thank you! 🙏

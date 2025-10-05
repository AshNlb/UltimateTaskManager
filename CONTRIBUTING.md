# Contributing to TaskFlow

First off, thank you for considering contributing to TaskFlow! It's people like you that make TaskFlow such a great tool.

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

* **Use a clear and descriptive title**
* **Describe the exact steps which reproduce the problem**
* **Provide specific examples to demonstrate the steps**
* **Describe the behavior you observed after following the steps**
* **Explain which behavior you expected to see instead and why**
* **Include screenshots if possible**

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

* **Use a clear and descriptive title**
* **Provide a step-by-step description of the suggested enhancement**
* **Provide specific examples to demonstrate the steps**
* **Describe the current behavior and explain which behavior you expected to see instead**
* **Explain why this enhancement would be useful**

### Pull Requests

* Fill in the required template
* Follow the TypeScript style guide
* Include screenshots in your pull request whenever possible
* End all files with a newline
* Avoid platform-dependent code

## Development Setup

### Prerequisites

* Node.js 18+
* npm or yarn
* Git

### Setup Steps

1. Fork the repo
2. Clone your fork
```bash
git clone https://github.com/your-username/ultimate-task-manager.git
cd ultimate-task-manager
```

3. Install dependencies
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

4. Create a new branch
```bash
git checkout -b feature/my-new-feature
```

5. Make your changes

6. Test your changes
```bash
# Run backend tests
cd backend
npm test

# Run frontend tests
cd frontend
npm test
```

7. Commit your changes
```bash
git commit -m "Add some feature"
```

8. Push to your fork
```bash
git push origin feature/my-new-feature
```

9. Create a Pull Request

## Style Guides

### Git Commit Messages

* Use the present tense ("Add feature" not "Added feature")
* Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
* Limit the first line to 72 characters or less
* Reference issues and pull requests liberally after the first line

### TypeScript Style Guide

* Use TypeScript for all new code
* Use meaningful variable names
* Add types to all function parameters and return values
* Use interfaces for object shapes
* Prefer `const` over `let`
* Use template literals over string concatenation

### React Style Guide

* Use functional components with hooks
* Keep components small and focused
* Use descriptive prop names
* Extract reusable logic into custom hooks
* Use TypeScript interfaces for props

## Project Structure

```
UltimateTaskManager/
├── backend/           # Express API server
│   ├── prisma/       # Database schema
│   └── src/          # Source code
├── frontend/         # React web app
│   └── src/         # Source code
└── mobile/          # React Native app (future)
```

## Questions?

Feel free to open an issue with your question or contact the maintainers directly.

Thank you for contributing! 🎉

# Contributing to DC x Milo

Thank you for your interest in contributing to the DC x Milo project! This document provides guidelines for contributing to ensure a smooth collaboration process.

## Table of Contents
- [Code of Conduct](#code-of-conduct)
- [Jira Workflow](#jira-workflow)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Pull Request Guidelines](#pull-request-guidelines)

## Code of Conduct

By participating in this project, you agree to abide by the [Adobe Code of Conduct](CODE_OF_CONDUCT.md).

## Jira Workflow

### Branch Naming Convention
**Important:** When working on a Jira issue, you must create and checkout a branch named after the Jira issue.

#### Format
- **Format:** `MWPW-{issue-number}
- **Example:** `MWPW-12345`
- **Example:** `MWPW-67890`

#### Steps
1. **Before starting work on any Jira issue:**
   ```bash
   git checkout -b MWPW-12345
   ```

2. **Make your changes on the feature branch**

3. **Push your branch:**
   ```bash
   git push origin MWPW-12345
   ```

4. **Create a pull request from your branch to `main`**

### Jira Issue Linking
- Always link your pull request to the corresponding Jira issue
- Use the format: `Resolves: [MWPW-XXXXXX](https://jira.corp.adobe.com/browse/MWPW-XXXXXX)`
- Update the Jira issue status as you progress through development

## Development Workflow

### Setup
1. Install the [AEM CLI](https://github.com/adobe/helix-cli): `sudo npm install -g @adobe/aem-cli`
2. Clone the repository and navigate to the project folder
3. Run `aem up` to start the development server (opens browser at `http://localhost:3000`)
4. Start coding in your favorite editor

### Branch Management
- `main` branch is the stable branch
- All development work should be done on feature branches
- Feature branches should be created from the latest `main`
- Branch names must follow the Jira naming convention (see above)

### Commit Messages
- Write clear, concise commit messages
- Reference the Jira issue in your commits: `MWPW-12345: Fix accessibility issues in prompt card`
- Use present tense: "Add feature" not "Added feature"

## Coding Standards

### JavaScript/ES6+
- Follow the existing ESLint configuration (`.eslintrc.js`)
- Use ES6+ features where appropriate
- Prefer `const` and `let` over `var`
- Use template literals for string interpolation

### CSS
- Follow the Stylelint configuration (`.stylelintrc.json`)
- Use meaningful class names
- Follow BEM methodology where applicable

### Accessibility
- Ensure all interactive elements are keyboard accessible
- Provide appropriate ARIA labels and roles
- Test with screen readers when possible
- Follow WCAG 2.1 AA guidelines

### File Organization
- Keep files small and focused
- Use descriptive file and folder names
- Follow the existing project structure

## Testing

### Running Tests
```bash
# Run all tests
npm run test

# Run Web Test Runner unit tests
npm run wtr

# Run Jest unit tests
npm run jest

# Debug Web Test Runner tests
npm run wtr:watch

# Debug Jest unit tests
npm run jest:watch
```

### Test Requirements
- Write unit tests for new functionality
- Ensure existing tests pass
- Maintain or improve code coverage
- Test accessibility features

### E2E Testing
For E2E tests, see [README](./test/e2e/README.md) in `/test/e2e`

## Pull Request Guidelines

### Before Creating a PR
1. ✅ Ensure you're working on a properly named Jira branch
2. ✅ All tests pass locally
3. ✅ Code follows the project's coding standards
4. ✅ Changes are properly tested
5. ✅ Documentation is updated if needed

### PR Requirements
- **Title:** Should clearly describe what the PR does
- **Description:** Use the provided PR template
- **Jira Link:** Always link to the corresponding Jira issue
- **Test URLs:** Provide URLs where changes can be tested
- **Reviewers:** Request review from appropriate team members

### PR Template
Make sure to fill out all sections of the PR template:
- Description of changes
- Related Jira issue link
- Test URLs (both main and feature branch)

### Review Process
- All PRs require at least one review
- Address reviewer feedback promptly
- Keep PR discussions focused and constructive
- Ensure CI/CD checks pass

## Getting Help

- **Jira Issues:** For questions about specific Jira tickets, comment on the ticket
- **Technical Questions:** Reach out to the development team
- **Process Questions:** Contact the project maintainers

---

## Summary of Key Rules

🚨 **CRITICAL:** Always create a branch named after your Jira issue before starting work:
```bash
git checkout -b MWPW-{issue-number}-{brief-description}
```

✅ **Remember to:**
- Link PRs to Jira issues
- Follow coding standards
- Write/update tests
- Provide test URLs
- Use meaningful commit messages

Thank you for contributing to DC x Milo! 🎉

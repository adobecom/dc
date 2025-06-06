# Jira Issue Workflow

## Branch Management for Jira Issues

When working on Jira issues, follow this workflow:

### 1. Before Starting Work
- **Always checkout a new branch** with the same name as the Jira issue
- Branch name should match the Jira ticket identifier

### 2. Before Opening Pull Requests
- **Check that branch name matches** the Jira issue name
- If branch name doesn't match, checkout a new branch using the Jira ticket name
- Ensure consistency between Jira ticket and Git branch naming

## Benefits
- Maintains clear traceability between issues and code changes
- Easier to track work progress
- Consistent organization between issue tracking and version control

## Example
```bash
# For Jira issue: PROJ-123
git checkout -b PROJ-123

# Work on the issue...

# Before PR, verify branch name matches issue
git branch --show-current  # Should show: PROJ-123
``` 
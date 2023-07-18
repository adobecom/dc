# CSP update script
## About
A Node script for automating the CSP update process.

## How to use it
### Step 1:

To cspUpdate directory add token.json file:
```json
{
  "GITHUB_TOKEN":"TOKEN VALUE"
}

```
### Step 2:
Download the csv file from Slack message in #lana-logging-dc channel.

### Step 3:
Create **csp-update-branch** if doesn't exist.

### Step 4:
Run the script with the command: 
```sh
npm run update-csp PATH_TO_THE_DOWNLOADED_FILE
```

### Token value and additional informations can be found on [Wiki page](https://wiki.corp.adobe.com/display/acomDay/CSP+update+script).


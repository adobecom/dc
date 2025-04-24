## Scenario Test

E2E tests that simulate an end user's journey and ensure that UI elements exist as expected. 

```
npx run test/e2e -t "@smoke and @gnav"
```

## Visual Test

Scenario tests fall short of detecting layout and rendering issues. Visual tests fill the gaps. 

Visual tests leverage the existing user steps. and verify the screenshots of selected elements. 

```
npx run test/e2e -t "@visual and @gnav"
```

For example, a feature file `test/e2e/features/visual/gnav.feature`

```
  Scenario: Navigate Gnav Menus
    Given I go to the compress-pdf page
     Then I screenshot the submenu of the 1st and 3rd menu items
     Then I should see the same screenshots as baseline
```

The baseline screenshots are stored in the folder `test/e2e/features/visual/gnav`. Each OS platform and browser has its own baseline. When the test is running, the current screenshots are stored in `reports/screenshot/visual/gnav`. The final step compares screenshots just taken with the baseline. The differences are stored under `reports` with the file name format `${platform}_${browser}_${image-name}.png`

It can also compare the rendering of two different browers. For exmaple, the following command will run the test with the Webkit browser and compare to Firefox's baseline. 

```
npx run test/e2e -t "@visual and @gnav" -b webkit --baseBrowser firefox
```

## Anaytics Test

An analytics test captures network post data to the service endpoints and verifies the events are as expected.

For example, the feature file `test/e2e/features/smoke/analytics.feature` should have an analytics spec file `test/e2e/features/smoke/analytics/analytics_spec.yml`

The command line should have the argument `--enableAnalytics` to turn on network logging

Chromium-based and Firefox browsers are supported. Currently Chromium has [the bug](https://bugs.chromium.org/p/chromium/issues/detail?id=1058404), which causes some post data not captured. The workaround is to bypess Playwright and use a CDP session to retrieve post data. 

```
npx run test/e2e -t "@smoke and @analytics" --enableAnalytics
```

To debug analytics logs, add the argument `--printAnalyticsLogs` to dump collected logs.

```
npx run test/e2e -t "@smoke and @analytics" --enableAnalytics --printAnalyticsLogs
```
## Scenario Test

E2E tests that simulate an end user's journey and ensure that UI elements exist as expected. 

```
npx run test/e2e/frictionless -t "@smoke and @gnav"
```

## Visual Test

Scenario tests fall short of detecting layout and rendering issues. Visual tests fill the gaps. 

Visual tests leverage the existing user steps. and verify the screenshots of selected elements. 

```
npx run test/e2e/frictionless -t "@visual and @gnav"
```

For example, a feature file `test/e2e/frictionless/features/visual/gnav.feature`

```
  Scenario: Navigate Gnav Menus
    Given I go to the compress-pdf page
     Then I screenshot the submenu of the 1st and 3rd menu items
     Then I should see the same screenshots as baseline
```

The baseline screenshots are stored in the folder `test/e2e/frictionless/features/visual/gnav`. Each OS platform and browser has its own baseline. When the test is running, the current screenshots are stored in `reports/screenshot/visual/gnav`. The final step compares screenshots just taken with the baseline. The differences are stored under `reports` with the file name format `${platform}_${browser}_${image-name}.png`

It can also compare the rendering of two different browers. For exmaple, the following command will run the test with the Webkit browser and compare to Firefox's baseline. 

```
npx run test/e2e/frictionless -t "@visual and @gnav" -b webkit --baseBrowser firefox
```
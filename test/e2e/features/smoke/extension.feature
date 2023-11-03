Feature: Frictionless Browser Extension Modal

  @MWPW-130086 @smoke @extension-installed @headed
  Scenario Outline: Acrobat extension is already installed
    Given I go to the <Verb> page
     Then I resize the browser window to 1366x768
     Then I upload the file "<File>"
     Then I wait for the conversion
     Then I should not see a modal promoting the browser extension

     When I go to the <Verb> page
     Then I upload the file "<File>"
     Then I wait for the conversion
     Then I should not see a modal promoting the browser extension

     When I go to the <Verb> page
     Then I should see upsell
     Then I should not see a modal promoting the browser extension

  Examples:
      | Verb       | File                |
      | pdf-to-ppt | test-files/test.pdf |
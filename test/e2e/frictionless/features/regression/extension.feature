Feature: Frictionless Browser Extension Modal

  @MWPW-130086 @regression @extension-installed @headed
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

  @MWPW-130086 @regression @extension @headed
  Scenario Outline: Display the modal if Acrobat extension is not already installed
    Given I have a new browser context
    Given I go to the <Verb> page
     Then I resize the browser window to 1366x768
     Then I upload the file "<File>"
     Then I wait for the conversion
     Then I should see a modal promoting the browser extension

     When I go to the <Verb> page
     Then I upload the file "<File>"
     Then I wait for the conversion
     Then I should see a modal promoting the browser extension

     When I go to the <Verb> page
     Then I should see upsell
     Then I should not see a modal promoting the browser extension

  Examples:
      | Verb         | File                 |
      | excel-to-pdf | test-files/test.xlsx |

  @MWPW-130086 @regression @extension @headed
  Scenario Outline: User dismisses the Acrobat extension modal
    Given I have a new browser context
    Given I go to the <Verb> page
     Then I resize the browser window to 1366x768
     Then I upload the file "<File>"
     Then I wait for the conversion
     Then I should see a modal promoting the browser extension
     Then I dismiss the extension modal

     When I go to the <Verb> page
     Then I upload the file "<File>"
     Then I wait for the conversion
     Then I should not see a modal promoting the browser extension

  Examples:
      | Verb              | File                |
      | request-signature | test-files/test.pdf |

  @MWPW-130086 @regression @extension @headed
  Scenario Outline: Mobile and tablets should not display the modal
    Given I have a new browser context
    Given I go to the <Verb> page
     Then I resize the browser window to 768x1024
     Then I upload the file "<File>"
     Then I wait for the conversion
     Then I should not see a modal promoting the browser extension

     When I go to the <Verb> page
     Then I resize the browser window to 390x844
     Then I upload the file "<File>"
     Then I wait for the conversion
     Then I should not see a modal promoting the browser extension

  Examples:
      | Verb              | File                |
      | request-signature | test-files/test.pdf |
Feature: Analytics - Frictionless Pages

  Background:
    Given I have a new browser context

  @MWPW-130640 @regression @analytics
  Scenario Outline: Analytics - Frictionless page load and download
    Given I go to the <Verb> page
     Then I upload the file "<File>"
     Then I wait for the conversion
     Then I download the converted file
     Then I wait for 3 seconds
     Then I read expected analytics data with replacements "<Replacements>"
      And I should see analytics data posted within all logs matched with "Page load"
      And I should see analytics data posted within all logs matched with "Download"

  Examples:
      | Verb         | Replacements              | File                 |
      | pdf-to-ppt   | verb-id=verb-pdf-to-ppt   | test-files/test.pdf  |
      | word-to-pdf  | verb-id=verb-word-to-pdf  | test-files/test.docx |
      | excel-to-pdf | verb-id=verb-excel-to-pdf | test-files/test.xlsx |
      | ppt-to-pdf   | verb-id=verb-ppt-to-pdf   | test-files/test.pptx |

  @MWPW-130084 @regression @analytics @extension
  Scenario Outline: Display the modal if Acrobat extension is not already installed
    Given I go to the <Verb> page
      And I resize the browser window to 1366x768
     When I upload the file "<File>"
      And I wait for the conversion
     Then I should see a modal promoting the browser extension
     When I dismiss the extension modal
      And I wait for 3 seconds     
      And I read expected analytics data with replacements "browser"  
     Then I should see analytics data posted within all logs matched with "Extension modal"     
  #  Then I should see analytics data posted within all logs matched with "Close the extension modal"     

  Examples:
      | Verb         | File                 |
      | ppt-to-pdf | test-files/test.pptx   |

  @MWPW-130085 @regression @analytics
  Scenario Outline: Analytics - Review block
    Given I go to the <Verb> page
     Then I upload the file "<File>"
     Then I wait for the conversion
     Then I download the converted file
     Then I should see the review stats
     When I submit review feedback
     Then I should see the review submit response
     Then I read expected analytics data with replacements "<Replacements>"
      And I should see analytics data posted within all logs matched with "Leave a review"

  Examples:
      | Verb        | Replacements          | File                 |
      | word-to-pdf | comment=Test,rating=5 | test-files/test.docx |

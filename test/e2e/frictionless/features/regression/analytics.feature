Feature: Analytics - Frictionless Pages

  Background:
    Given I have a new browser context

  @MWPW-130640 @regression-analytics
  Scenario Outline: Analytics - Frictionless page load and download
    Given I go to the <Verb> page
     Then I load expected analytics data from wiki page "2871483205" with replacements "<Replacements>"
     Then I upload the file "<File>"
     Then I download the converted file
     Then I wait for 3 seconds
      And I should see analytics data posted within all logs matched with "Page load"
      And I should see analytics data posted within all logs matched with "Download"

  Examples:
      | Verb         | Replacements              | File                 |
      | pdf-to-ppt   | verb-id=verb-pdf-to-ppt   | test-files/test.pdf  |
      | word-to-pdf  | verb-id=verb-word-to-pdf  | test-files/test.docx |
      | excel-to-pdf | verb-id=verb-excel-to-pdf | test-files/test.xlsx |
      | ppt-to-pdf   | verb-id=verb-ppt-to-pdf   | test-files/test.pptx |
Feature: Analytics - Frictionless Pages

  Background:
    Given I have a new browser context

  @MWPW-130083 @smoke-analytics
  Scenario Outline: Analytics - Frictionless page load
    Given I go to the <Verb> page
     Then I load expected analytics data from wiki page "2871483205" with replacements "<Replacements>"
     Then I upload the file "test-files/test.pdf"
     Then I download the converted file
     Then I wait for 3 seconds
      And I should see analytics data posted within all logs matched with "Page load"

  Examples:
      | Verb       | Replacements            |
      | pdf-to-ppt | verb-id=verb-pdf-to-ppt |
Feature: Analytics - Frictionless Pages

  Background:
    Given I have a new browser context

  @MWPW-130083 @smoke @analytics
  Scenario Outline: Analytics - Frictionless page load
    Given I go to the <Verb> page
     Then I wait for 3 seconds
     Then I read expected analytics data with replacements "<Replacements>"
      And I should see analytics data posted within all logs matched with "Page load"

  Examples:
      | Verb       | Replacements            |
      | pdf-to-ppt | verb-id=verb-pdf-to-ppt |

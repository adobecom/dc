Feature: Frictionless Review Block

  Background:
    Given I have a new browser context

  @MWPW-127204 @regression @review
  Scenario Outline: Review rating and stats
    Given I go to the <Verb> page
     Then I should see the review stats
     When I submit review feedback
     Then I should see the review submit response

  Examples:
      | Verb        |
      | pdf-to-ppt  |
      | convert-pdf |
      | pdf-editor  |

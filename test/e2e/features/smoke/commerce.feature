Feature: Commerce

  Background:
    Given I have a new browser context

  @MWPW-136736 @smoke @commerce
  Scenario Outline: Prices match on checkout
    Given I go to the DC page '<urlPath>'
     When I scroll to the bottom of the page
     Then I should see that the prices match on checkout from the '<acrobat-standard>' and '<acrobat-pro>' merch cards

  Examples:
      | urlPath                         | acrobat-standard | acrobat-pro         |
      | acrobat/how-to/share-pdf-online | Buy now          | Free trial, Buy now |
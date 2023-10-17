Feature: Commerce

  Background:
    Given I have a new browser context

 @MWPW-137510 @regression @commerce
  Scenario Outline: Checkout flow for logged-in visitors
    Given I go to the DC page '<Path>'
    Then I sign in AdobeID
    Then I click a "Commerce" Button
    Then I should see the address bar contains "commerce.adobe.com"
    Then I should see "Signed in as" text

  Examples:
      | Path                                          |
      | /acrobat/how-to/convert-excel-to-pdf          |
      | /acrobat/resources/how-to-create-fillable-pdf |

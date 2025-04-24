Feature: Commerce

  Background:
    Given I have a new browser context

 @MWPW-137510 @regression @commerce @signedin
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

  @MWPW-136737 @regression @commerce
  Scenario Outline: Prices match on checkout
    Given I go to the DC page '<urlPath>'
     Then I should see that the prices match on checkout from the '<acrobat-standard>' and '<acrobat-pro>' merch cards

  Examples:
      | urlPath                             | acrobat-standard | acrobat-pro         |
      | acrobat/how-to/convert-excel-to-pdf | Buy now          | Free trial, Buy now |
      | acrobat/how-to/pdf-editor-pdf-files | Buy now          | Free trial, Buy now |

Feature: DC FedPub

  Background:
    Given I have a new browser context

  @MWPW-130867 @regression @fedpub
  Scenario Outline: Promotions fragment
    Given I go to the DC page '<urlPath>'
     Then I should see the footer promo elements

  Examples:
      | urlPath                                        |
      | acrobat/hub/how-to/how-to-convert-pdf-to-image |

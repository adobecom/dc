Feature: CaaS Block

  Background:
    Given I have a new browser context

  @MWPW-138468 @smoke @caas
  Scenario Outline: CaaS block
    Given I go to the DC page '<Path>'
     When I scroll to the bottom of the page
     Then I should see the CaaS block
     Then I should see the CaaS block cards
     Then I click the "Read now" button inside the CaaS card
     Then I should not see the address bar contains "<Path>.html"
  Examples:
      | Path                                          |
      | acrobat/resources/how-to-add-hyperlink-to-pdf |
      | acrobat/resources/how-to-create-fillable-pdf  |

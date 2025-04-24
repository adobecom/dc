Feature: Frictionless Gnav Tests

  Background:
    Given I have a new browser context

  @MWPW-136087 @smoke @gnav
  Scenario Outline: L1 Verb - Navigate Gnav Menus
    Given I go to the <Verb> page
     Then I should be able to open the submenu of the 1st, 3rd, 4th and 5th menu items
     Then I select the last item of the submenu of the 4th menu item
     Then I should not see the address bar contains "<Verb>"
     Then I go back
     Then I should see the address bar contains "<Verb>"
     When I click 7th nav item in the header
     Then I should see the address bar contains "/acrobat/pricing.html"
     Then I go back
     Then I should see the address bar contains "<Verb>"
     When I click "Free trial" button in the header
     #When I switch to the new page after clicking "Buy now" button in the header
     Then I should see the address bar contains "/acrobat/free-trial-download.html"

  Examples:
      | Verb         |
      | compress-pdf |

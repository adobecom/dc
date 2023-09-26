Feature: Frictionless Gnav Visual Tests

  Background:
    Given I have a new browser context

  @MWPW-136087 @visual @gnav
  Scenario: Navigate Gnav Menus
    Given I go to the compress-pdf page
     When I resize the browser window to 1920x1080
      And I screenshot the submenu of the 1st and 3rd menu items
     Then I should see the same screenshots as baseline


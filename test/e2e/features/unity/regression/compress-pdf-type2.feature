Feature: Compress PDF

  Background:
    Given I have a new browser context
      And I sign in as a type2 user

  @regression @unity @compress-pdf @signed-in-type2
  Scenario: Signed in a type2 user
    Given I go to the compress-pdf page
     Then I wait for 5 seconds
     Then I should see the address bar contains "acrobat.adobe.com"
     Then I should see "Compress PDF" in the dropzone

   

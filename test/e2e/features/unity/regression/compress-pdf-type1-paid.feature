Feature: Compress PDF

  Background:
    Given I have a new browser context
      And I sign in as a type1paid user   

  @regression @unity @compress-pdf @multi-files-type1paid
  Scenario: Type1paid user upload of multiple files
    Given I go to the compress-pdf page
     When I choose the file "test-files/test.pdf,test-files/test2.pdf" to upload
     Then I wait for 5 seconds
     Then I should see the address bar contains "acrobat.adobe.com"
     Then I click the "Compress" button on the feedback
     Then I should see "test-compressed.pdf" in the page content
     Then I should see "test2-compressed.pdf" in the page content

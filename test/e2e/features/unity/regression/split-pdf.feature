Feature: Split PDF

  Background:
    Given I have a new browser context

  @regression @unity @split-pdf @signed-out-1page
  Scenario: Signed out - Upload 1-page PDF
    Given I go to the split-pdf page   
     Then I choose the file "test-files/test.pdf" to upload
     Then I should see "This file has only 1 page so it can't be split.  Please try another file." in the error message


  @regression @unity @split-pdf @signed-out-2pages
  Scenario: Signed out - Upload 2-page PDF
    Given I go to the split-pdf page   
     Then I choose the file "test-files/test-2pages.pdf" to upload
     Then I should see the address bar contains "acrobat.adobe.com"
     Then I continue with Adobe as a type1paid user
     Then I select the split divider
     Then I click the "Continue" button on the top
     Then I click the "Save" button
     Then I should see the "Your Documents" folder
     


Feature: Compress PDF

  Background:
    Given I have a new browser context

  @regression @unity @compress-pdf @signed-out-3rd-attempt
  Scenario: Signed out 1st, 2nd, 3rd attempts
    Given I go to the compress-pdf page
     When I choose the file "test-files/test.pdf" to upload
     Then I wait for 5 seconds
     Then I should see the address bar contains "acrobat.adobe.com"
     Then I wait for 5 seconds
     When I go to the compress-pdf page
     Then I wait for 5 seconds     
     Then I choose the file "test-files/test.pdf" to upload
     Then I wait for 5 seconds
     Then I should see the address bar contains "acrobat.adobe.com"
     Then I wait for 5 seconds
     Then I go to the compress-pdf page
     Then I should see "Compress a PDF with a free account" in the page content
     Then I should see "Continue with email" in the page content
   
  @regression @unity @compress-pdf @susi-sign-in-type1
  Scenario: Sign in at 3rd attempt
    Given I go to the compress-pdf page
      And I have tried "compress-pdf" twice
     When I sign in as a type1free user using SUSI Light
     Then I should see "Compress PDF" in the dropzone

  @regression @unity @compress-pdf @susi-sign-in-type2
  Scenario: Sign in at 3rd attempt
    Given I go to the compress-pdf page
      And I have tried "compress-pdf" twice
     When I sign in as a type2 user using SUSI Light
     Then I should see "Compress PDF" in the dropzone

  @regression @unity @compress-pdf @empty-file
  Scenario: Upload empty file
    Given I go to the compress-pdf page
     When I try to choose the file "test-files/empty.pdf" to upload
     Then I should see "This file is empty." in the error message

  @regression @unity @compress-pdf @bad-file
  Scenario: Upload bad file
    Given I go to the compress-pdf page
     When I choose the file "test-files/bad.pdf" to upload
     Then I should see the address bar contains "acrobat.adobe.com"
     Then I click the "Compress" button on the feedback
     Then I should see "The file appears to be corrupted." in the widget error toast

  @regression @unity @compress-pdf @multi-files
  Scenario: Signed out upload of multiple files
    Given I go to the compress-pdf page
     When I choose the file "test-files/test.pdf,test-files/test2.pdf" to upload
     Then I wait for 5 seconds
     Then I should see the address bar contains "acrobat.adobe.com"
     Then I should see "Compress multiple files with Acrobat Pro" in the widget upsell heading
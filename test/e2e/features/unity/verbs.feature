Feature: Frictionless Converter Block

  Background:
    Given I have a new browser context

  @smoke @unity @sign-pdf @choosefile
  Scenario: L1 Verb - Choose file and upload
    Given I go to the sign-pdf page
     Then I choose the file "test-files/test.pdf" to upload
     Then I wait for 5 seconds
     Then I should see the address bar contains "acrobat.adobe.com"
     Then I should see the complete heading
     Then I should not see an error raincloud

  @smoke @unity @sign-pdf @dragndrop
  Scenario: L1 Verb - Drag and drop file and upload
    Given I go to the sign-pdf page
     Then I drag-and-drop the file "test-files/test.pdf" to upload
     Then I wait for 5 seconds
     Then I should see the address bar contains "acrobat.adobe.com"

  @smoke @unity @sign-pdf @emptyfile
  Scenario: L1 Verb - Upload an empty file
    Given I go to the sign-pdf page
     Then I try to upload the file "test-files/empty.pdf"
     Then I should see the error "This file is empty."

  @smoke @unity @compress-pdf @choosefile
  Scenario: L2 Verb - Choose file and upload
    Given I go to the DC page '/acrobat/online/test/compress-pdf.html'
     Then I choose the file "test-files/test.pdf" to upload
     Then I wait for 5 seconds
     Then I should see the address bar contains "acrobat.adobe.com"
     Then I should see the complete heading
     Then I should not see an error raincloud
    
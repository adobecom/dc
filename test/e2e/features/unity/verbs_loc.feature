Feature: Frictionless Converter Block

  Background:
    Given I have a new browser context

  @row @unity @sign-pdf
  Scenario Outline: L1 Verb - Choose file and upload
    Given I go to the DC page '/<Locale>/acrobat/online/test/sign-pdf.html'
     Then I choose the file "test-files/test.pdf" to upload
     Then I wait for 5 seconds
     Then I should see the address bar contains "acrobat.adobe.com"
     Then I should see the complete heading
     Then I should not see an error raincloud     

  Examples:
      | Locale      | 
      | jp          | 

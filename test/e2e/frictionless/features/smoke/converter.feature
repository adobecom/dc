Feature: Frictionless Converter Block

  Background:
    Given I have a new browser context

  @MWPW-130446 @smoke @converter
  Scenario Outline: L1 Verb - Upload and sign-in
    Given I go to the <Verb> page
     Then I upload the file "<File>"
     Then I wait for the conversion
     Then I continue with AdobeID
     Then I wait for 5 seconds
     Then I should see the address bar contains ".services.adobe.com"

  Examples:
      | Verb              | File                |
      | request-signature | test-files/test.pdf |

  @MWPW-130447 @smoke @converter
  Scenario Outline: L2 Verb - Upload and download
    Given I go to the <Verb> page
     Then I upload the file "<File>"
     Then I download the converted file

  Examples:
      | Verb       | File                |
      | pdf-to-ppt | test-files/test.pdf |
Feature: Frictionless Converter Block

  Background:
    Given I have a new browser context

  @MWPW-127201 @regression-converter
  Scenario Outline: L1 Verbs - Upload and sign-in
    Given I go to the <Verb> page
     Then I upload the file "<File>"
     Then I wait for the conversion
     Then I continue with AdobeID
     Then I wait for 5 seconds
     Then I should see the address bar contains ".services.adobe.com"

  Examples:
      | Verb              | File                 |
      | sign-pdf          | test-files/test.pdf  |
      | request-signature | test-files/test.pdf  |
      | crop-pdf          | test-files/test.pdf  |
      | delete-pdf-pages  | test-files/test2.pdf |
    # | rotate-pdf        | test-files/test.pdf  |
      | rearrange-pdf     | test-files/test.pdf  |
      | split-pdf         | test-files/test2.pdf |
      | add-pages-to-pdf  | test-files/test.pdf  |
      | extract-pdf-pages | test-files/test2.pdf |
      | pdf-editor        | test-files/test.pdf  |

  @MWPW-124781 @regression-converter
  Scenario Outline: L2 Verbs - Upload and download
    Given I go to the <Verb> page
     Then I upload the file "<File>"
     Then I download the converted file

  Examples:
      | Verb         | File                 |
      | pdf-to-ppt   | test-files/test.pdf  |
      | pdf-to-word  | test-files/test.pdf  |
      | pdf-to-excel | test-files/test.pdf  |
      | convert-pdf  | test-files/test.jpg  |
      | ppt-to-pdf   | test-files/test.pptx |
      | jpg-to-pdf   | test-files/test.jpg  |
      | word-to-pdf  | test-files/test.docx |
      | excel-to-pdf | test-files/test.xlsx |

  @MWPW-124781 @regression-converter
  Scenario Outline: L2 Verbs - Upload and download
    Given I go to the <Verb> page
     Then I upload the file "<File>"
     Then I choose "JPG (*.jpg, *.jpeg)" as the output format
     Then I download the converted file

  Examples:
      | Verb       | File                |
      | pdf-to-jpg | test-files/test.pdf |

  @MWPW-127201 @regression-converter
  Scenario Outline: L2 Verbs - Upload and download
    Given I go to the <Verb> page
     Then I upload the files "<Files>"
     Then I merge the uploaded files
     Then I download the converted file

  Examples:
      | Verb      | Files                                    |
      | merge-pdf | test-files/test.pdf,test-files/test2.pdf |

  @MWPW-129135 @regression-converter-headed-skip
  Scenario Outline: L1 Verbs - Upload and sign-in with Google YOLO
    Given I go to "https://www.google.com"
     Then I click the element "text='Sign in'"
     Then I wait for 2 seconds
     Then I login to Google

     When I go to the <Verb> page
     Then I upload the file "<File>"
     Then I wait for the conversion
     Then I should see the Google credential picker
     Then I wait for 2 seconds
     Then I click the Continue button inside the Google iFrame
     Then I should see the file in DC Web
     Then I delete the file in DC Web

  Examples:
      | Verb     | File                |
      | sign-pdf | test-files/test.pdf |
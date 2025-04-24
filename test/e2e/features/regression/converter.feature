Feature: Frictionless Converter Block

  Background:
    Given I have a new browser context

  @MWPW-127201 @regression @converter
  Scenario Outline: L1 Verbs - Upload and sign-in
    Given I go to the <Verb> page
     Then I upload the file "<File>"
     Then I wait for the conversion
     Then I continue with AdobeID
     Then I wait for 5 seconds
     Then I should see the address bar contains ".services.adobe.com"

  Examples:
      | Verb              | File                 |
      | request-signature | test-files/test.pdf  |
      | crop-pdf          | test-files/test.pdf  |
      | delete-pdf-pages  | test-files/test2.pdf |
      | rearrange-pdf     | test-files/test.pdf  |
      | split-pdf         | test-files/test2.pdf |
      | add-pages-to-pdf  | test-files/test.pdf  |
      | extract-pdf-pages | test-files/test2.pdf |
      | pdf-editor        | test-files/test.pdf  |
      | sign-pdf          | test-files/test.pdf  |
      | convert-pdf       | test-files/test.jpg  |

  @MWPW-124781 @regression @converter
  Scenario Outline: L2 Verbs - Upload and download
    Given I go to the <Verb> page
     Then I upload the file "<File>"
     Then I wait for the conversion
     Then I download the converted file

  Examples:
      | Verb         | File                 |
      | pdf-to-ppt   | test-files/test.pdf  |
      | pdf-to-word  | test-files/test.pdf  |
      | pdf-to-excel | test-files/test.pdf  |
      | ppt-to-pdf   | test-files/test.pptx |
      | jpg-to-pdf   | test-files/test.jpg  |
      | word-to-pdf  | test-files/test.docx |
      | excel-to-pdf | test-files/test.xlsx |

  @MWPW-124781 @regression @converter
  Scenario Outline: L2 Verbs - Upload and download
    Given I go to the <Verb> page
     Then I upload the file "<File>"
     Then I choose "JPG (*.jpg, *.jpeg)" as the output format
     Then I download the converted file

  Examples:
      | Verb       | File                |
      | pdf-to-jpg | test-files/test.pdf |

  @MWPW-127201 @regression @converter
  Scenario Outline: L1 Verbs - Upload and sign-in
    Given I go to the <Verb> page
     Then I upload the files "<Files>"
     Then I merge the uploaded files
     Then I continue with AdobeID
     Then I wait for 5 seconds
     Then I should see the address bar contains ".services.adobe.com"

  Examples:
      | Verb      | Files                                    |
      | merge-pdf | test-files/test.pdf,test-files/test2.pdf |

  @MWPW-129135 @regression-skip @converter @headed
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

  @MWPW-137180 @regression @converter
  Scenario Outline: L2 Verbs - Upload, rotate and download
    Given I go to the <Verb> page
     Then I upload the files "<Files>"
     Then I rotate right the uploaded files
     Then I rotate left first uploaded file
     Then I wait for 2 seconds
     Then I save rotated files
     Then I download the converted file

  Examples:
      | Verb       | Files                                    |
      | rotate-pdf | test-files/test.pdf,test-files/test2.pdf |

  @MWPW-127633 @regression @converter @signedin
  Scenario Outline: L1 Verbs - Redirects for signed-in visitors
    Given I go to the <Verb> page
     Then I sign in AdobeID
     Then I wait for 2 seconds
     Then I should see the address bar contains "<RedirectLink>"

     Then I go to the <Verb> page
     Then I wait for 2 seconds
     Then I should see the address bar contains "<RedirectLink>"

  Examples:
      | Verb              | RedirectLink                   |
      | request-signature | /link/acrobat/sendforsignature |
      | crop-pdf          | /link/acrobat/crop             |
      | delete-pdf-pages  | /link/acrobat/delete-pages     |
      | rearrange-pdf     | /link/acrobat/reorder-pages    |
      | split-pdf         | /link/acrobat/split            |
      | add-pages-to-pdf  | /link/acrobat/insert           |
      | extract-pdf-pages | /link/acrobat/extract          |

  @MWPW-127634 @regression @converter @signedin
  Scenario Outline: L2 Verbs - Redirects for signed-in visitors
    Given I go to the <Verb> page
     Then I sign in AdobeID
     Then I wait for 2 seconds
     Then I should see the address bar contains "<RedirectLink>"

     Then I go to the <Verb> page
     Then I wait for 2 seconds
     Then I should see the address bar contains "<RedirectLink>"

  Examples:
      | Verb                 | RedirectLink               |
      | pdf-to-ppt           | /link/acrobat/pdf-to-ppt   |
      | pdf-to-jpg           | /link/acrobat/pdf-to-image |
      | pdf-to-word          | /link/acrobat/pdf-to-word  |
      | pdf-to-excel         | /link/acrobat/pdf-to-excel |
      | convert-pdf          | /link/acrobat/createpdf    |
      | ppt-to-pdf           | /link/acrobat/ppt-to-pdf   |
      | jpg-to-pdf           | /link/acrobat/jpg-to-pdf   |
      | word-to-pdf          | /link/acrobat/word-to-pdf  |
      | excel-to-pdf         | /link/acrobat/excel-to-pdf |
      | merge-pdf            | /link/acrobat/combine-pdf  |
      | password-protect-pdf | /link/acrobat/protect-pdf  |
      | compress-pdf         | /link/acrobat/compress-pdf |
      | sign-pdf             | /link/acrobat/fillsign     |
      | rotate-pdf           | /link/acrobat/rotate-pages |

  @MWPW-137197 @regression @converter
  Scenario Outline: L2 Verbs - Password protect pdf
     Given I go to the <Verb> page
      Then I upload the file "<File>"
      Then I wait for 2 seconds
      Then I fill up password input
      Then I fill up confirm password input
      Then I click 'Set password'
      Then I wait for the conversion
      Then I should see preview description
      Then I download the converted file

  Examples:
      |Verb                  | File                |
      | password-protect-pdf | test-files/test.pdf |

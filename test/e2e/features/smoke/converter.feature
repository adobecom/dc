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
     Then I wait for the conversion
     Then I download the converted file

  Examples:
      | Verb       | File                |
      | pdf-to-ppt | test-files/test.pdf |

  @MWPW-127633 @smoke-skip-MWPW-137700 @converter
  Scenario Outline: L1 Verb - Redirects for signed-in visitors
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

  @MWPW-139420 @ing
  Scenario: sign.ing and edit.ing sites
  Given I go to the .ing site
   Then I scroll to the "More resources" header
   Then I should see the CaaS block cards
   Then I should see the review vote count
   Then I choose the file "test-files/test.pdf" to upload
   Then I wait for 5 seconds
   Then I should see the address bar contains "acrobat.adobe.com"
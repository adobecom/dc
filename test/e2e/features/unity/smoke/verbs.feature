Feature: Frictionless Converter Block

  Background:
    Given I have a new browser context

  @smoke @unity @sign-pdf @choosefile
  Scenario Outline: L1 Verb - Upload and sign-in
    Given I go to the <Verb> page
     Then I choose the file "<File>" to upload
     Then I wait for 5 seconds
     Then I should see the address bar contains "acrobat.adobe.com"

  Examples:
      | Verb              | File                |
      | sign-pdf          | test-files/test.pdf |

  @smoke @unity @sign-pdf @dragndrop
  Scenario Outline: L1 Verb - Upload and sign-in
    Given I go to the <Verb> page
     Then I drag-and-drop the file "<File>" to upload
     Then I wait for 5 seconds
     Then I should see the address bar contains "acrobat.adobe.com"

  Examples:
      | Verb              | File                |
      | sign-pdf          | test-files/test.pdf |

  @smoke @unity @compress-pdf @choosefile
  Scenario Outline: L1 Verb - Upload and sign-in
    Given I go to the <Verb> page
     Then I choose the file "<File>" to upload
     Then I wait for 5 seconds
     Then I should see the address bar contains "acrobat.adobe.com"

  Examples:
      | Verb              | File                |
      | compress-pdf      | test-files/test.pdf |      
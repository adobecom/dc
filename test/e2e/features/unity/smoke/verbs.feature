Feature: Frictionless Converter Block

  Background:
    Given I have a new browser context

  @smoke @unity @sign-pdf @choosefile
  Scenario Outline: L1 Verb - Upload
    Given I go to the <Verb> page
     Then I choose the file "<File>" to upload
     Then I wait for 5 seconds
     Then I should see the address bar contains "acrobat.adobe.com"

  Examples:
      | Verb              | File                |
      | sign-pdf          | test-files/test.pdf |

  @smoke @unity @sign-pdf @dragndrop
  Scenario Outline: L1 Verb - Upload
    Given I go to the <Verb> page
     Then I drag-and-drop the file "<File>" to upload
     Then I wait for 5 seconds
     Then I should see the address bar contains "acrobat.adobe.com"

  Examples:
      | Verb              | File                |
      | sign-pdf          | test-files/test.pdf |

  @smoke @unity @compress-pdf @choosefile
  Scenario Outline: L1 Verb - Upload
    Given I go to the <Verb> page
     Then I choose the file "<File>" to upload
     Then I wait for 5 seconds
     Then I should see the address bar contains "acrobat.adobe.com"

  Examples:
      | Verb              | File                |
      | compress-pdf      | test-files/test.pdf |

  @smoke @unity @crop-pdf @choosefile
  Scenario: L1a Verb - Upload
    Given I go to the crop-pdf page
     Then I choose the file "test-files/test.pdf" to upload
     Then I wait for 5 seconds
     Then I should see the address bar contains "acrobat.adobe.com"

  @smoke @unity @pdf-editor @choosefile
  Scenario: L1a Verb - Upload
    Given I go to the pdf-editor page
     Then I choose the file "test-files/test.pdf" to upload
     Then I wait for 5 seconds
     Then I should see the address bar contains "acrobat.adobe.com"

  @smoke @unity @split-pdf @choosefile
  Scenario: L1a Verb - Upload
    Given I go to the split-pdf page
     Then I choose the file "test-files/test-2pages.pdf" to upload
     Then I wait for 5 seconds
     Then I should see the address bar contains "acrobat.adobe.com"

  @smoke @unity @add-pdf-page-numbers @choosefile
  Scenario: L1a Verb - Upload
    Given I go to the add-pdf-page-numbers page
     Then I choose the file "test-files/test.pdf" to upload
     Then I wait for 5 seconds
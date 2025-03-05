Feature: L1a Verbs

  Background:
    Given I have a new browser context

  @regression @unity @signed-out
  Scenario Outline: Signed out - Upload
    Given I go to the <Page> page   
     Then I choose the file "test-files/test-2pages.pdf" to upload
     Then I should see the address bar contains "acrobat.adobe.com"
     Then I continue with Adobe as a type1paid user
     Then I should see the download button

  @pdf-editor
  Examples:
    | Page       |
    | pdf-editor |

  @crop-pdf
  Examples:
    | Page     |
    | crop-pdf |

  @add-pdf-page-numbers
  Examples:
    | Page                 |
    | add-pdf-page-numbers |
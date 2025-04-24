Feature: L1b Verbs

  Background:
    Given I have a new browser context

  @regression @unity @signed-out
  Scenario Outline: Signed out - Upload
    Given I go to the <Page> page   
     Then I choose the file "test-files/test-2pages.pdf" to upload
     Then I should see the address bar contains "acrobat.adobe.com"
     Then I continue with Adobe as a type1paid user
     Then I should see the save button

  @delete-pdf-pages
  Examples:
    | Page       |
    | delete-pdf-pages |

  @add-pages-to-pdf
  Examples:
    | Page       |
    | add-pages-to-pdf |

  @rearrange-pdf
  Examples:
    | Page       |
    | rearrange-pdf |

  @extract-pdf-pages
  Examples:
    | Page       |
    | extract-pdf-pages |
      


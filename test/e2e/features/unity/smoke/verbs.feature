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
     Then I should see the address bar contains "acrobat.adobe.com"


  @smoke @unity @l1b @choosefile
  Scenario Outline: L1b Verb - Upload
    Given I go to the <Verb> page
     Then I choose the file "<File>" to upload
     Then I wait for 5 seconds
     Then I should see the address bar contains "acrobat.adobe.com"

  @delete-pdf-pages
  Examples:
      | Verb              | File                       |
      | delete-pdf-pages  | test-files/test-2pages.pdf |

  @add-pages-to-pdf
  Examples:
      | Verb              | File                |
      | add-pages-to-pdf  | test-files/test.pdf |

  @rearrange-pdf
  Examples:
      | Verb              | File                       |
      | rearrange-pdf     | test-files/test-2pages.pdf |

  @extract-pdf-pages
  Examples:
      | Verb              | File                       |
      | extract-pdf-pages | test-files/test-2pages.pdf |

  @request-signature
  Examples:
      | Verb              | File                |
      | request-signature | test-files/test.pdf |

  @smoke @unity @l2a @choosefile
  Scenario Outline: L2a Verb - Upload
    Given I go to the <Verb> page
     Then I choose the file "<File>" to upload
     Then I wait for 5 seconds
     Then I should see the address bar contains "acrobat.adobe.com"

  @pdf-to-word
  Examples:
      | Verb              | File                |
      | pdf-to-word       | test-files/test.pdf |

  @pdf-to-jpg 
  Examples:
      | Verb              | File                |
      | pdf-to-jpg        | test-files/test.pdf |

  @pdf-to-excel
  Examples:
      | Verb              | File                |
      | pdf-to-excel      | test-files/test.pdf |

  @pdf-to-ppt
  Examples:
      | Verb              | File                |
      | pdf-to-ppt        | test-files/test.pdf |

  @convert-pdf
  Examples:
      | Verb              | File                 |
      | convert-pdf       | test-files/test.docx |

  @word-to-pdf
  Examples:
      | Verb              | File                 |
      | word-to-pdf       | test-files/test.docx |

  @jpg-to-pdf
  Examples:
      | Verb              | File                |
      | jpg-to-pdf        | test-files/test.jpg |

  @png-to-pdf
  Examples:
      | Verb              | File                |
      | png-to-pdf        | test-files/test.png |

  @excel-to-pdf
  Examples:
      | Verb              | File                 |
      | excel-to-pdf      | test-files/test.xlsx |

  @ppt-to-pdf
  Examples:
      | Verb              | File                 |
      | ppt-to-pdf        | test-files/test.pptx |

  @smoke @unity @l2c @choosefile
  Scenario Outline: L2a Verb - Upload
    Given I go to the <Verb> page
     Then I choose the file "<File>" to upload
     Then I wait for 5 seconds
     Then I should see the address bar contains "acrobat.adobe.com"

  @password-protect-pdf
  Examples:
      | Verb                 | File                |
      | password-protect-pdf | test-files/test.pdf |

  @rotate-pdf
  Examples:
      | Verb              | File                |
      | rotate-pdf        | test-files/test.pdf |

  @merge-pdf
  Examples:
      | Verb              | File                |
      | merge-pdf         | test-files/test.pdf |

  @ocr-pdf
  Examples:
      | Verb              | File                |
      | ocr-pdf           | test-files/test.pdf |

  @ai-chat-pdf
  Examples:
      | Verb              | File                |
      | ai-chat-pdf       | test-files/test.pdf |

  @ai-summary-generator
  Examples:
      | Verb                 | File                |
      | ai-summary-generator | test-files/test.pdf |      
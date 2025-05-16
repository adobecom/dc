Feature: L2a Verbs

  Background:
    Given I have a new browser context

  @regression @unity @limit
  Scenario Outline: Convert Limit
    Given I go to the <Verb> page   
     Then I choose the file "<File>" to upload
     Then I download the converted file in DC Web
     Then I wait for 3 seconds     
     Then I go back to the initial page
     Then I choose the file "<File>" to upload
     Then I should see the file is ready in DC Web
     Then I wait for 3 seconds
     Then I go back to the initial page  
     Then I should see "Convert a file with a free account" in the page content

  @pdf-to-word
  Examples:
      | Verb              | File                |
      | pdf-to-word       | test-files/test.pdf |

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

  @jpg-to-pdf
  Examples:
      | Verb              | File                |
      | jpg-to-pdf        | test-files/test.jpg |

  @png-to-pdf
  Examples:
      | Verb              | File                |
      | png-to-pdf        | test-files/test.png |

  @word-to-pdf
  Examples:
      | Verb              | File                 |
      | word-to-pdf       | test-files/test.docx |

  @excel-to-pdf
  Examples:
      | Verb              | File                 |
      | excel-to-pdf      | test-files/test.xlsx |

  @ppt-to-pdf
  Examples:
      | Verb              | File                 |
      | ppt-to-pdf        | test-files/test.pptx |


  @regression @unity @limit@pdf-to-jpg
  Scenario: Signed out - Upload
    Given I go to the pdf-to-jpg page   
     Then I choose the file "test-files/test.pdf" to upload
     Then I click the convert button in DC Web
     Then I download the converted file in DC Web
     Then I go back to the initial page
     Then I choose the file "test-files/test-2pages.pdf" to upload
     Then I click the convert button in DC Web
     Then I should see the file is ready in DC Web
     Then I wait for 5 seconds
     Then I go back to the initial page
     Then I should see "Convert a file with a free account" in the page content

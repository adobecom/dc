Feature: Frictionless Event Wrapper Block

  Background:
    Given I have a new browser context

  @MWPW-127202 @regression-eventwrapper
  Scenario Outline: L2 Verbs - Personalization events
    Given I go to the <Verb> page
     Then I should see the default how-to
     Then I upload the file "<File>"
     Then I download the converted file

     When I go to the <Verb> page
     Then I should see the 2nd conversion how-to
     Then I upload the file "<File>"
     Then I wait for the conversion

     When I go to the <Verb> page
     Then I should see upsell
     Then I should see the 2nd conversion how-to

  Examples:
      | Verb         | File                 |
      | pdf-to-ppt   | test-files/test.pdf  |
    # | pdf-to-word  | test-files/test.pdf  |
      | pdf-to-excel | test-files/test.pdf  |
      | convert-pdf  | test-files/test.docx |
      | ppt-to-pdf   | test-files/test.pptx |
      | jpg-to-pdf   | test-files/test.jpg  |
      | word-to-pdf  | test-files/test.docx |
      | excel-to-pdf | test-files/test.xlsx |

  @MWPW-127202 @regression-eventwrapper
  Scenario Outline: L2 Verbs - Personalization events
    Given I go to the <Verb> page
     Then I should see the default how-to
     Then I upload the file "<File>"
     Then I choose "JPG (*.jpg, *.jpeg)" as the output format
     Then I download the converted file

     When I go to the <Verb> page
     Then I should see the 2nd conversion how-to
     Then I upload the file "<File>"
     Then I choose "JPG (*.jpg, *.jpeg)" as the output format
     Then I wait for the conversion

     When I go to the <Verb> page
     Then I should see upsell
     Then I should see the 2nd conversion how-to

  Examples:
      | Verb       | File                |
      | pdf-to-jpg | test-files/test.pdf |
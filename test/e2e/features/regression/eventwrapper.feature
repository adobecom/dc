Feature: Frictionless Event Wrapper Block

  Background:
    Given I have a new browser context

  @MWPW-127202 @regression @eventwrapper
  Scenario Outline: L2 Verbs - Personalization events
    Given I go to the <Verb> page
     Then I upload the file "<File>"
     Then I wait for the conversion
     Then I download the converted file
     When I go to the <Verb> page
     Then I upload the file "<File>"
     Then I wait for the conversion
     When I go to the <Verb> page
     Then I should see upsell

  Examples:
      | Verb         | File                 |
      | pdf-to-excel | test-files/test.pdf  |    
      | pdf-to-ppt   | test-files/test.pdf  |
      | word-to-pdf  | test-files/test.docx |
      | excel-to-pdf | test-files/test.xlsx |
      | ppt-to-pdf   | test-files/test.pptx |
      | jpg-to-pdf   | test-files/test.jpg  |

  @MWPW-127202 @regression @eventwrapper
  Scenario Outline: L2 Verbs - Personalization events
    Given I go to the <Verb> page
     Then I upload the file "<File>"
     Then I choose "JPG (*.jpg, *.jpeg)" as the output format
     Then I download the converted file

     When I go to the <Verb> page
     Then I upload the file "<File>"
     Then I choose "JPG (*.jpg, *.jpeg)" as the output format
     Then I wait for the conversion

     When I go to the <Verb> page
     Then I should see upsell

  Examples:
      | Verb       | File                |
      | pdf-to-jpg | test-files/test.pdf |

  @MWPW-137378 @regression @eventwrapper
  Scenario Outline: L2 Verbs - Personalization events for rotate-pdf
      Given I go to the <Verb> page
      Then I should see the review component
      Then I should see the verb subfooter
      Then I upload the file "<File>"
      Then I should not see eventwrapper onload
      Then I save rotated files
      Then I wait for the conversion
      Then I should not see eventwrapper onload

      Then I go to the <Verb> page
      Then I should see the review component
      Then I should see the verb subfooter
      Then I upload the file "<File>"
      Then I should not see eventwrapper onload
      Then I save rotated files
      Then I wait for the conversion
      Then I should not see eventwrapper onload

      When I go to the <Verb> page
      Then I should see upsell

  Examples:
      | Verb       | File                |
      | rotate-pdf | test-files/test.pdf |

  @MWPW-138330 @regression @eventwrapper
  Scenario Outline: L2 Verbs - Personalization events for password-protect-pdf
     Given I go to the <Verb> page
      Then I should see eventwrapper onload
      Then I should see the review component
      Then I should see the verb subfooter
      Then I upload the file "<File>"
      Then I should not see eventwrapper onload
      Then I should not see the review component
      Then I should see the verb subfooter
      Then I fill up password input
      Then I fill up confirm password input
      Then I click 'Set password'
      Then I wait for the conversion
      Then I should not see eventwrapper onload
      Then I should see the review component
      Then I should see the verb subfooter

      When I go to the <Verb> page
      Then I should see eventwrapper onload
      Then I should see the review component
      Then I should see the verb subfooter
      Then I upload the file "<File>"
      Then I should not see eventwrapper onload
      Then I should not see the review component
      Then I should see the verb subfooter
      Then I fill up password input
      Then I fill up confirm password input
      Then I click 'Set password'
      Then I wait for the conversion
      Then I should not see eventwrapper onload
      Then I should see the review component
      Then I should see the verb subfooter

      When I go to the <Verb> page
      Then I should see upsell
      Then I should see eventwrapper onload
      Then I should not see the review component
      Then I should see the verb subfooter

  Examples:
      | Verb                 | File                |
      | password-protect-pdf | test-files/test.pdf |

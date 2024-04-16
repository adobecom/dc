Feature: Frictionless Event Wrapper Block

  Background:
    Given I have a new browser context

  @MWPW-127202 @regression @eventwrapper
  Scenario Outline: L2 Verbs - Personalization events
    Given I go to the <Verb> page
     Then I should see the default how-to
     Then I upload the file "<File>"
     Then I wait for the conversion
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
    # | convert-pdf  | test-files/test.docx |
      | ppt-to-pdf   | test-files/test.pptx |
      | jpg-to-pdf   | test-files/test.jpg  |
      | word-to-pdf  | test-files/test.docx |
      | excel-to-pdf | test-files/test.xlsx |

  @MWPW-127202 @regression @eventwrapper
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

  @MWPW-137378 @regression @eventwrapper
  Scenario Outline: L2 Verbs - Personalization events for rotate-pdf
      Given I go to the <Verb> page
      Then I should see eventwrapper onload
      Then I should see the review component
      Then I should see the verb subfooter
      Then I upload the file "<File>"
      Then I should not see eventwrapper onload
      Then I should not see the review component
      Then I should not see the verb subfooter
      Then I save rotated files
      Then I wait for the conversion
      Then I should not see eventwrapper onload
      Then I should see the review component
      Then I should see the verb subfooter

      Then I go to the <Verb> page
      Then I should see eventwrapper onload
      Then I should see the review component
      Then I should see the verb subfooter
      Then I upload the file "<File>"
      Then I should not see eventwrapper onload
      Then I should not see the review component
      Then I should not see the verb subfooter
      Then I save rotated files
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

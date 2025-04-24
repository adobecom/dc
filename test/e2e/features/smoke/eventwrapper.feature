Feature: Frictionless Event Wrapper Block

  Background:
    Given I have a new browser context

  @MWPW-130448 @smoke @eventwrapper
  Scenario Outline: L2 Verb - Personalization events
    Given I go to the <Verb> page
     Then I should see the verb subfooter
     Then I upload the file "<File>"
     Then I wait for the conversion
     Then I download the converted file

     When I go to the <Verb> page
     Then I should see the verb subfooter
     Then I upload the file "<File>"
     Then I wait for the conversion

     When I go to the <Verb> page
     Then I should see upsell
     Then I should see the verb subfooter     

  Examples:
      | Verb       | File                |
      | pdf-to-ppt | test-files/test.pdf |

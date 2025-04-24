Feature: CaaS Block

  Background:
    Given I have a new browser context

  @MWPW-132351 @regression @caas
  Scenario Outline: CaaS block on frictionless
    Given I go to the <Verb> page
     When I scroll to the bottom of the page
     Then I should see the CaaS block
     Then I should see the 'More resources' header
     Then I should see the CaaS block cards
     Then I click the "Read now" button inside the CaaS card
     Then I should not see the address bar contains "<Verb>.html"
  Examples:
      | Verb                 |
      # | add-pages-to-pdf     |
      # | compress-pdf         |
      # | convert-pdf          |
      # | delete-pdf-pages     |
      # | excel-to-pdf         |
      # | extract-pdf-pages    |
      # | merge-pdf            |
      # | password-protect-pdf |
      # | pdf-editor           |
      # | pdf-to-excel         |
      # | pdf-to-jpg           |
      # | request-signature    |
      # | rotate-pdf           |
      # | sign-pdf             |
      # | split-pdf            |
      # | word-to-pdf          |
      | jpg-to-pdf           |

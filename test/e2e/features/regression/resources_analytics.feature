Feature: Analytics - Resources Pages

  Background:
    Given I have a new browser context

  @MWPW-137347 @regression @analytics @resources
  Scenario Outline: Analytics - Resources page load
    Given I reload DocCloud "/acrobat/resources/<Page>"   
     When I wait for 3 seconds    
      And I read expected analytics data with replacements ""  
     Then I should see analytics data posted within all logs matched with "Page load"

  Examples:
      | Page                             |
      | how-to-create-fillable-pdf.html  |
      | tax-preparation.html             |
      | how-to-add-hyperlink-to-pdf.html | 
  
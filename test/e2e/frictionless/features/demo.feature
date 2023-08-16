Feature: Platform-UI Automation Demo

  @id-1
  Scenario: Convert PDF to PowerPoint
    Given I go to the pdf-to-ppt page
     Then I upload the PDF "test-files/test.pdf"
     Then I download the converted file

  @id-2
  Scenario: Verify Adobe App Launcher
    Given I go to the pdf-to-ppt page
     Then I should not see the app launcher
     When I sign in AdobeID
     Then I should see "Convert PDF to PowerPoint" in the page content 
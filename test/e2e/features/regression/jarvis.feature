Feature: Validate the Jarvis chat

  @MWPW-137198 @regression @jarvis
  Scenario Outline: Verifying the Jarvis chat functionality
    Given I go to "<page>"
     Then I should see a chat icon
     When I click the chat button
     Then I should see jarvis popup window
     Then I should see How can I help you in jarvis popup window


  Examples:
      | page                                               |
      | /acrobat/resources/how-to-convert-html-to-pdf.html |

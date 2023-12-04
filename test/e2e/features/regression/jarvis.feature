Feature: Validate the Jarvis chat

  @MWPW-137199 @jarvis-chat-validation
  Scenario Outline: Verifying the Jarvis chat functionality
    Given I go to "<page>"
    Then I close Onetrust pop up if present
    Then I should see a chat icon
    When I click the chat button
    Then I should see jarvis popup window
    Then I should see How can I help you in jarvis popup window

    Examples:
      |page                                                           |
      |/acrobat/resources/best-pdf-software.html |

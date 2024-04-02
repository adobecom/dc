Feature: Phone number test
  @MWPW-144460 @smoke @geo-phoneNumber
  Scenario Outline: Geo IP phone number
    Given I go to the DC page '<urlPath>'
    Then I record phone number on the page
    Then I go to the page "<urlPath>" with geo-ip spoof "<countryCode>"
    Then I confirm phone number is not changed


    Examples:
      | urlPath                                   |  countryCode |
      | acrobat/business/resources.html           |  fr          |

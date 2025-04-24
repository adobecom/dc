Feature: Phone number test
  @MWPW-144460 @geo-phoneNumber
  Scenario Outline: Geo IP phone number
    Given I go to the DC page '<urlPath>'
    Then I wait for 2 seconds
    Then I record phone number on the page
    Then I go to the page "<urlPath>" with geo-ip spoof "<countryCode>"
    Then I wait for 2 seconds
    Then I confirm phone number is different and has geo-ip value "<geoIpPhoneNumber>"


    Examples:
      | urlPath                                   |  countryCode  | geoIpPhoneNumber     |
      | acrobat/business/resources/it-tools.html  |  fr           | +33 (800) 12457-1241 |
      | acrobat/business/resources/it-tools.html  |  de           | +49 (800) 12457-1241 |

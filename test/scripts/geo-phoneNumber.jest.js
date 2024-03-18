/**
 * @jest-environment jsdom
 */
import geoPhoneNumber from '../../acrobat/scripts/geo-phoneNumber';

// Mocking fetch API
window.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ country: 'us' }),
    status: 200,
  }),
);

// Mocking sessionStorage
global.sessionStorage = {
  getItem: jest.fn(() => JSON.stringify({ country: 'us' })),
};

// Mocking window.location
delete window.location;
window.location = { search: '?akamaiLocale=de' };

// Mocking document.querySelector and document.querySelectorAll
// document.querySelector = jest.fn();
// document.querySelectorAll = jest.fn();
document.body.innerHTML = '<header><main><p class="geo-pn3" number-type="phone-enterprise"><a href="tel:800-915-9430" number-type="phone-enterprise">800-915-9430</a></p></main></header>';

describe('geoPhoneNumber', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  it('should call fetch with the correct URL', async () => {
    await geoPhoneNumber();
    expect(fetch).toHaveBeenCalledWith('https://geo2.adobe.com/json/');
  });

  it('should get the correct locale', async () => {
    await geoPhoneNumber();
  });

  it('should update phone numbers correctly', async () => {
    await geoPhoneNumber(document.body.innerHTML);
    expect(document.querySelector('.geo-pn3').innerHTML).toBe('<a href="tel:800-915-9430" number-type="phone-enterprise">800-915-9430</a>');
  });

  it('should dispatch a custom event when phone numbers are ready', async () => {
    const dispatchEventSpy = jest.spyOn(window, 'dispatchEvent');
    await geoPhoneNumber();
    expect(dispatchEventSpy).toHaveBeenCalled();
    expect(dispatchEventSpy.mock.calls[0][0] instanceof CustomEvent).toBe(true);
    expect(dispatchEventSpy.mock.calls[0][0].type).toBe('DCNumbers:Ready');
  });
});

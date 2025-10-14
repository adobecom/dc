/* eslint-disable camelcase */
/* eslint-disable compat/compat */
/** ***********************************************************************
* ADOBE CONFIDENTIAL
* ___________________
*
*  Copyright 2022 Adobe
*  All Rights Reserved.
*
* NOTICE:  All information contained herein is, and remains
* the property of Adobe and its suppliers, if any. The intellectual
* and technical concepts contained herein are proprietary to Adobe
* and its suppliers and are protected by all applicable intellectual
* property laws, including trade secret and copyright laws.
* Dissemination of this information or reproduction of this material
* is strictly forbidden unless prior written permission is obtained
* from Adobe.
************************************************************************* */

/* eslint no-underscore-dangle: 0, class-methods-use-this: 0, max-len: 0 */

// Utility functions
export const getCookie = (cookieName) => {
  const cookies = window.document.cookie ? window.document.cookie.split('; ') : [];
  const item = cookies.find((cookie) => cookie.trim().startsWith(`${cookieName}=`));
  if (!item) {
    return null;
  }
  const [, ...others] = item.split('=');
  const value = others.join('=');
  return value;
};

export const setCookie = (key, value, attrs = {}) => {
  let cookieString = `${key}=${value}`;
  if (attrs.domain) {
    cookieString += `; domain=${attrs.domain}`;
  }
  if (attrs.path) {
    cookieString += `; path=${attrs.path}`;
  }
  if (attrs.expires) {
    cookieString += `; expires=${attrs.expires}`;
  }
  if (attrs.maxAge) {
    cookieString += `; max-age=${attrs.maxAge}`;
  }
  if (attrs.secure) {
    cookieString += '; secure';
  }
  if (attrs.samesite) {
    cookieString += `; samesite=${attrs.samesite}`;
  }
  window.document.cookie = cookieString;
};

export const deleteCookie = (cookieName) => {
  setCookie(cookieName, '', {
    domain: window.location.host.endsWith('.adobe.com') ? '.adobe.com' : '',
    path: '/',
    maxAge: -86400,
  });
};

const getTrackingURL = (env) => {
  if (env && env !== 'prod') {
    return 'https://acroipm2.stage.adobe.com/acrobat-web';
  }
  return 'https://acroipm2.adobe.com/acrobat-web';
};

export const polynomialHash = (str, base = 31, mod = 2 ** 32) => {
  if (!str) {
    return str;
  }
  let hashValue = 0;
  for (let i = 0; i < str.length; i += 1) {
    hashValue = (hashValue * base + str.charCodeAt(i)) % mod;
  }
  return hashValue;
};

// Constants
const PING_TYPE = {
  MACHINE: 'machine',
  SIGNEDIN: 'signedin',
};

export const USER_TYPE = {
  PAID: 'paid',
  ANON: 'anon',
  FREE: 'free',
  SIGNEDIN: 'signedin',
};

// Configuration objects (interfaces removed - using plain objects)

// Default ping configuration
const DEFAULT_PING_SCHEMA = {
  appIdentifier: '',
  appVersion: '',
  appReferrer: '',
  userType: '',
  subscriptionType: '',
  locale: '',
};

export class PingService {
  constructor(options = {}) {
    this.locale = options.locale;
    this.config = options.config;
    this.userId = options.userId;
    this.isSignedIn = options.isSignedIn || false;
    this.userType = options.userType;
    this.subscriptionType = options.subscriptionType;
  }

  async getCountryFromGeoService() {
    try {
      const geoResponse = await fetch('https://geo2.adobe.com/json/');
      if (!geoResponse.ok) {
        return null;
      }
      const geoData = await geoResponse.json();
      return geoData?.country?.toLowerCase() || null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Deletes all mmac cookies
   */
  deleteAllMmacCookies() {
    const cookies = window.document.cookie ? window.document.cookie.split('; ') : [];
    const mmacCookies = cookies.filter((cookie) => cookie.trim().startsWith('mmac'));

    mmacCookies.forEach((cookie) => {
      const cookieName = cookie.split('=')[0];
      deleteCookie(cookieName);
    });
  }

  /**
   * Determines whether a month has passed since the last fetch date for MAU tracking.
   *
   * @param {string | Date} lastFetchDate - The date of the last fetch, either as a string or Date object.
   * @param {number} currentMonth - The current month as a number (0-11, where 0 is January and 11 is December).
   * @param {number} currentYear - The current year as a 4-digit number (e.g., 2024).
   * @returns {boolean} - Returns true if more than one month has passed since the last fetch date; otherwise, false.
   */
  isMonthPassedForMAUTracking(lastFetchDate, currentMonth, currentYear) {
    const lastFetch = new Date(lastFetchDate);
    const lastFetchMonth = lastFetch.getMonth();
    const lastFetchYear = lastFetch.getFullYear();

    // Check if current date is after the last fetch and a month has passed
    return currentYear > lastFetchYear || (currentYear === lastFetchYear && currentMonth > lastFetchMonth);
  }

  /**
   * Validates the app ping configuration object.
   *
   * @param {Object} pingConfig - The configuration object to be validated.
   * @param {string} pingConfig.appPath - The app path, expected to be a non-empty string.
   * @returns {boolean} - Returns true if the configuration is valid; otherwise, false.
   */
  isValidAppPingConfig(pingConfig) {
    // Check if pingConfig is provided
    if (!pingConfig) {
      return false;
    }

    // Check if 'appPath' is present and is a non-empty string
    if (!pingConfig.appPath || typeof pingConfig.appPath !== 'string' || pingConfig.appPath.trim() === '') {
      return false;
    }

    // If all checks pass, return true
    return true;
  }

  async getCookieKey(pingType, appPath) {
    let key = 'mmac';

    if (pingType === PING_TYPE.MACHINE) {
      key += '_machine';
    } else if (pingType === PING_TYPE.SIGNEDIN) {
      if (this.userId) {
        key += `_${await polynomialHash(this.userId)}`;
      }
    }

    if (appPath) {
      key += `_${appPath}`;
    }
    return key;
  }

  /**
   * Checks if the ping has been made for the current month based on ping Type & App.
   * @param {string} [pingType] - An string representing the ping Type for which the ping is being checked.
   * @param {string} [appPath] - An optional string representing the appPath for which the ping is being checked.
   * @returns {Promise<boolean>} - Returns a promise which will resolve true if no ping has been made for the current month, or if more than a month has passed since the last ping; otherwise, resolves false.
   */
  async isPingCurrentMonth(pingType, appPath) {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    const key = await this.getCookieKey(pingType, appPath);

    // Get the stored value from cookies
    const storedValue = getCookie(key);

    const isMonthPassedForMAUTracking = this.isMonthPassedForMAUTracking(storedValue || '', currentMonth, currentYear);

    const notPingCurrentMonth = !storedValue || isMonthPassedForMAUTracking;

    // Note: Ping tracking for dc_web - logging removed
    return !notPingCurrentMonth;
  }

  /**
   * Constructs a ping URL based on the provided configuration and a default schema.
   *
   * @param {Object} pingConfig - The configuration object for the ping.
   * @param {string} [pingConfig.appPath] - The app path for the ping. Defaults to 'overall' if not provided.
   * @param {Object} pingConfig.schema - An object containing additional properties to be appended to the URL path.
   * @returns {string} - The constructed URL as a string, with the ping configuration included as path segments.
   */
  createPingURL(pingConfig) {
    const baseURL = getTrackingURL(this.config?.serverEnv);

    const url = new URL(baseURL);

    if (pingConfig.pingType === PING_TYPE.MACHINE) {
      url.pathname += '/machine';
    } else if (pingConfig.pingType === PING_TYPE.SIGNEDIN) {
      url.pathname += '/signedin';
    }

    if (pingConfig.appPath) {
      url.pathname += `/${encodeURIComponent(pingConfig.appPath)}`;
    } else {
      url.pathname += '/overall';
    }

    const pingSchema = DEFAULT_PING_SCHEMA;

    // Iterate over the schema object
    const pathSegments = Object.keys(pingSchema).map((key) => {
      let value = pingConfig.schema[key] || pingSchema[key] || this.config?.[key];

      if (!value) {
        switch (key) {
          case 'appIdentifier':
            value = this.config?.appName || 'unspecified';
            break;
          case 'locale':
            value = this.locale || 'unspecified';
            break;
          case 'userType':
            value = this.userType || (!this.isSignedIn ? USER_TYPE.ANON : 'unspecified');
            break;
          case 'subscriptionType':
            value = this.subscriptionType || (!this.isSignedIn ? 'Free' : 'unspecified');
            break;
          default:
            value = 'unspecified';
        }
      }
      return `/${encodeURIComponent(value)}`;
    });

    url.pathname += pathSegments.join('');
    url.pathname += '/mmac.html';

    return url.toString();
  }

  /**
   * Calculates the expiration date in UTC based on the number of days provided.
   *
   * @param {number} days - The number of days from the current date to calculate the expiration date. Must be a positive number.
   * @returns {string|undefined} - Returns the expiration date as a UTC string if the input is valid; otherwise, returns undefined.
   */
  getExpirationInUTC = (days) => {
    if (typeof days !== 'number' || days < 0) return undefined;
    const expDateUTC = new Date(Date.now() + (days * 24 * 60 * 60 * 1000));
    return expDateUTC.toUTCString();
  };

  /**
   * Sends a ping request to the specified API and handles the response.
   *
   * @param {string} url - The URL to which the ping request is sent.
   * @param {string} pingType - The ping Type to which the ping request is sent.
   * @param {string} [appPath] - An optional app path used for tracking pings specific to a app.
   *
   * @returns {Promise<void>} - An asynchronous function that handles the API response and manages cookie settings for MAU tracking.
   */
  async pingAPICall(url, pingType, appPath) {
    const key = await this.getCookieKey(pingType, appPath);
    const currentDate = new Date();
    const dateString = currentDate.toISOString();

    try {
      setCookie(
        key,
        dateString,
        {
          domain: window.location.host.endsWith('.adobe.com') ? '.adobe.com' : '',
          path: '/',
          expires: this.getExpirationInUTC(31),
          samesite: 'None',
          secure: true,
        },
      );

      const res = await fetch(url, {
        method: 'GET',
        credentials: 'omit',
      });

      if (res?.status !== 200) {
        deleteCookie(key);
      }
    } catch (err) {
      deleteCookie(key);
    }
  }

  /**
   * Sends a ping event for the overall acrobat web if the ping for the current month has not yet been sent for different ping type.
   *
   * @param {Object} pingConfig - The configuration object used to generate the ping URL.
   */
  async sendOverallPingEvent(pingConfig) {
    if (!pingConfig) {
      return;
    }

    if (!await this.isPingCurrentMonth(PING_TYPE.MACHINE)) {
      const url = this.createPingURL({ ...pingConfig, appPath: undefined, pingType: PING_TYPE.MACHINE });
      await this.pingAPICall(url, PING_TYPE.MACHINE);
    }
    if (this.isSignedIn && this.userId && !await this.isPingCurrentMonth(PING_TYPE.SIGNEDIN)) {
      const url = this.createPingURL({ ...pingConfig, appPath: undefined, pingType: PING_TYPE.SIGNEDIN });
      await this.pingAPICall(url, PING_TYPE.SIGNEDIN);
    }
  }

  /**
   * Sends a ping event for both the overall application and a specific app, if applicable, to track Monthly Active Users (MAU).
   *
   * @param {Object} pingConfig - The configuration object used to generate the ping URL.
   * @param {string} [pingConfig.appPath] - The app path for the ping. If provided, a app-specific ping is sent in addition to the overall ping.
   */
  async sendPingEvent(pingConfig) {
    const country = await this.getCountryFromGeoService();

    if (['gb', 'uk', null].includes(country)) {
      this.deleteAllMmacCookies();
      return;
    }
    await this.sendOverallPingEvent(pingConfig);
    if (!this.isValidAppPingConfig(pingConfig)) {
      return;
    }
    if (!await this.isPingCurrentMonth(PING_TYPE.MACHINE, pingConfig.appPath)) {
      const url = this.createPingURL({ ...pingConfig, pingType: PING_TYPE.MACHINE });
      await this.pingAPICall(url, PING_TYPE.MACHINE, pingConfig.appPath);
    }
    if (this.isSignedIn && this.userId && !await this.isPingCurrentMonth(PING_TYPE.SIGNEDIN, pingConfig.appPath)) {
      const url = this.createPingURL({ ...pingConfig, pingType: PING_TYPE.SIGNEDIN });
      await this.pingAPICall(url, PING_TYPE.SIGNEDIN, pingConfig.appPath);
    }
  }
}

export default PingService;

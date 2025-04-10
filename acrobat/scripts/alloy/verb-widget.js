const params = new Proxy(
  // eslint-disable-next-line compat/compat
  new URLSearchParams(window.location.search),
  { get: (searchParams, prop) => searchParams.get(prop) },
);

let appReferrer = params.x_api_client_id || params['x-product'] || '';
if (params.x_api_client_location || params['x-product-location']) {
  appReferrer = `${appReferrer}:${params.x_api_client_location || params['x-product-location']}`;
}
let trackingId = params.trackingid || '';
if (params.mv) {
  trackingId = `${trackingId}:${params.mv}`;
}
if (params.mv2) {
  trackingId = `${trackingId}:${params.mv2}`;
}
const appTags = [];
if (params.workflow) {
  appTags.push(params.workflow);
}
if (params.dropzone2) {
  appTags.push('dropzone2');
}

function ensureSatelliteReady(callback) {
  // eslint-disable-next-line no-underscore-dangle
  if (window._satellite?.track instanceof Function) {
    callback();
  } else {
    setTimeout(() => ensureSatelliteReady(callback), 50);
  }
}

function eventData(metaData, { appReferrer: referrer, trackingId: tracking }) {
  function getSessionID() {
    const aToken = window.adobeIMS.getAccessToken();
    const arrayToken = aToken?.token.split('.');
    if (!arrayToken) return;
    const tokenPayload = JSON.parse(atob(arrayToken[1]));
    // eslint-disable-next-line consistent-return
    return tokenPayload.sub || tokenPayload.user_id;
  }
  const {
    verb, eventName, errorInfo = '', noOfFiles, uploadTime, type, size, count, userAttempts,
  } = metaData;

  return {
    event: {
      pagename: `acrobat:verb-${verb}:${eventName}${errorInfo ? ` ${errorInfo}` : ''}`,
      ...(noOfFiles ? { no_of_files: noOfFiles } : {}),
      ...(uploadTime ? { uploadTime } : {}),
    },
    content: { type, size, count, fileType: type, totalSize: size },
    source: {
      user_agent: navigator.userAgent,
      lang: document.documentElement.lang,
      app_name: `unity:${verb}`,
      url: window.location.href,
      referrer,
      tracking,
    },
    user: {
      locale: document.documentElement.lang.toLocaleLowerCase(),
      id: getSessionID(),
      is_authenticated: `${window.adobeIMS?.isSignedInUser() ? 'true' : 'false'}`,
      user_tags: [`${localStorage['unity.user'] ? 'frictionless_return_user' : 'frictionless_new_user'}`],
      ...(userAttempts && { return_user_type: userAttempts }),
    },
  };
}

export function createEventObject(eventName, verb, metaData, trackingParams, documentUnloading) {
  const verbEvent = `acrobat:verb-${verb}:${eventName}`;
  const eventDataPayload = eventData({ ...metaData, eventName, verb }, trackingParams);
  const redirectReady = new CustomEvent('DCUnity:RedirectReady');

  return {
    documentUnloading,
    // eslint-disable-next-line
    done: function (AJOPropositionResult, error) {
      if (!documentUnloading) {
        if (eventName === 'job:uploaded') {
          window.dispatchEvent(redirectReady);
        }
        const accountType = window?.adobeIMS?.getAccountType();
        if (error) {
          window.lana?.log(
            `Error Code: ${error}, Status: 'Unknown', Message: An error occurred while sending ${verbEvent}, Account Type: ${accountType}`,
            { sampleRate: 100, tags: 'DC_Milo,Project Unity (DC)' },
          );
        }
      }
    },
    data: {
      eventType: 'web.webinteraction.linkClicks',
      web: {
        webInteraction: {
          linkClicks: { value: 1 },
          type: 'other',
          name: verbEvent,
        },
      },
      _adobe_corpnew: {
        digitalData: {
          primaryEvent: {
            eventInfo: {
              eventName: `${verbEvent}${metaData.errorInfo ? ` ${metaData.errorInfo}` : ''}`,
              value: `${verb} - Frictionless to Acrobat Web`,
            },
          },
          dcweb: eventDataPayload,
          dcweb2: eventDataPayload,
        },
      },
    },
  };
}

export default function init(eventName, verb, metaData, documentUnloading = true) {
  const trackingParams = { appReferrer, trackingId };

  const trackEvent = () => {
    const event = createEventObject(eventName, verb, metaData, trackingParams, documentUnloading);
    // eslint-disable-next-line no-underscore-dangle
    window._satellite.track('event', event);
    window.alloy_getIdentity
      .then((value) => {
        window.ecid = value.identity.ECID;
      });
  };

  // eslint-disable-next-line no-underscore-dangle
  if (window._satellite?.track instanceof Function) {
    // If satellite is already ready, just track immediately
    trackEvent();
  } else {
    // Otherwise, keep waiting until _satellite is ready
    // This should be just a 50 milliseconds delay
    ensureSatelliteReady(trackEvent);
  }
}

export function reviewAnalytics(verb) {
  // eslint-disable-next-line no-underscore-dangle
  if (window._satellite?.track instanceof Function) {
    import('../frictionless.js').then((mod) => {
      mod.default(verb);
    });
  } else {
    ensureSatelliteReady(() => {
      import('../frictionless.js').then((mod) => {
        mod.default(verb);
      });
    });
  }
}

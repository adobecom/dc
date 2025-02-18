import frictionless from '../frictionless.js';

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
    setTimeout(() => ensureSatelliteReady(callback), 200);
  }
}

export default function init(eventName, verb, metaData, documentUnloading = true) {
  function getSessionID() {
    const aToken = window.adobeIMS.getAccessToken();
    const arrayToken = aToken?.token.split('.');
    if (!arrayToken) return;
    const tokenPayload = JSON.parse(atob(arrayToken[1]));
    // eslint-disable-next-line consistent-return
    return tokenPayload.sub || tokenPayload.user_id;
  }
  const event = {
    documentUnloading,
    // eslint-disable-next-line
    done: function (AJOPropositionResult, error) {
      if (!documentUnloading) {
        const accountType = window?.adobeIMS?.getAccountType();
        const verbEvent = `acrobat:verb-${verb}:${eventName}`;
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
          name: `acrobat:verb-${verb}:${eventName}`,
        },
      },
      _adobe_corpnew: {
        digitalData: {
          primaryEvent: {
            eventInfo: {
              eventName: `acrobat:verb-${verb}:${eventName}`,
              value: `${verb} - Frictionless to Acrobat Web`,
            },
          },
          dcweb: {
            event: {
              pagename: `acrobat:verb-${verb}:${eventName}`,
              ...(metaData?.noOfFiles ? { no_of_files: metaData.noOfFiles } : {}),
              ...(metaData?.uploadTime ? { uploadTime: metaData.uploadTime } : {}),
            },
            content: {
              type: metaData?.type,
              size: metaData?.size,
              count: metaData?.count,
              fileType: metaData?.type,
              totalSize: metaData?.size,
            },
            source: {
              user_agent: navigator.userAgent,
              lang: document.documentElement.lang,
              app_name: `unity:${verb}`,
              url: window.location.href,
              app_referrer: appReferrer,
              tracking_id: trackingId,
            },
            user: {
              locale: document.documentElement.lang.toLocaleLowerCase(),
              id: getSessionID(),
              is_authenticated: `${window.adobeIMS?.isSignedInUser() ? 'true' : 'false'}`,
              user_tags: [
                `${localStorage['unity.user'] ? 'frictionless_return_user' : 'frictionless_new_user'}`,
              ],
            },
          },
          dcweb2: {
            event: {
              pagename: `acrobat:verb-${verb}:${eventName}`,
              ...(metaData?.noOfFiles ? { no_of_files: metaData.noOfFiles } : {}),
              ...(metaData?.uploadTime ? { uploadTime: metaData.uploadTime } : {}),
            },
            content: {
              type: metaData?.type,
              size: metaData?.size,
              count: metaData?.count,
              fileType: metaData?.type,
              totalSize: metaData?.size,
              // extension: 'docx', may not be needed
            },
            source: {
              user_agent: navigator.userAgent,
              lang: document.documentElement.lang,
              app_name: `unity:${verb}`,
              url: window.location.href,
              app_referrer: appReferrer,
              tracking_id: trackingId,
            },
            user: {
              locale: document.documentElement.lang.toLocaleLowerCase(),
              id: getSessionID(),
              is_authenticated: `${window.adobeIMS?.isSignedInUser() ? 'true' : 'false'}`,
              user_tags: [
                `${localStorage['unity.user'] ? 'frictionless_return_user' : 'frictionless_new_user'}`,
              ],
            },
          },
        },
      },
    },
  };
  ensureSatelliteReady(() => {
    // eslint-disable-next-line no-underscore-dangle
    window._satellite.track('event', event);
  });
}

export function reviewAnalytics(verb) {
  ensureSatelliteReady(() => {
    frictionless(verb);
  });
}

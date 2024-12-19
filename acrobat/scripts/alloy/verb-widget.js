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
        } else {
          window.lana?.log(
            `Message: Event ${verbEvent} has been sent successfully, Account Type: ${accountType}`,
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
            event: { pagename: `acrobat:verb-${verb}:${eventName}` },
            content: {
              type: metaData?.type,
              size: metaData?.size,
              count: metaData?.count,
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
            event: { pagename: `acrobat:verb-${verb}:${eventName}` },
            content: {
              type: metaData?.type,
              size: metaData?.size,
              count: metaData?.count,
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
  // eslint-disable-next-line no-underscore-dangle
  window._satellite?.track?.('event', event);
}

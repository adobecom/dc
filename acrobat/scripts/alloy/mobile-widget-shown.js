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

export default function init(verb, type = 'landing:shown') {
  const eventName = `acrobat:verb-${verb}:${type}`;
  const event = {
    documentUnloading: true,
    data: {
      eventType: 'web.webinteraction.linkClicks',
      web: {
        webInteraction: {
          linkClicks: { value: 1 },
          type: 'other',
          name: eventName,
        },
      },
      _adobe_corpnew: {
        digitalData: {
          dcweb: { event: { pagename: eventName } },
          dcweb2: {
            event: { pagename: eventName },
            source: {
              user_agent: navigator.userAgent,
              lang: document.documentElement.lang,
              app_name: 'dc-hosted:adobe_com',
              url: window.location.href,
              app_referrer: appReferrer,
              tracking_id: trackingId,
              app_tags: appTags,
            },
            user: {
              locale: document.documentElement.lang.toLocaleLowerCase(),
              id: '',
              is_authenticated: false,
              user_tags: [
                `${localStorage['pdfnow.auth'] ? 'frictionless_return_user' : 'frictionless_new_user'}`,
                `${localStorage['frictionless.download'] === 'cannot_download' ? 'frictionless_cannot_download' : 'frictionless_can_download'}`,
              ],
            },
          },
        },
      },
    },
  };
  // Alloy Ready...
  const AlloyReady = setInterval(() => {
    // eslint-disable-next-line no-underscore-dangle
    if (window?._satellite?.track) {
      clearInterval(AlloyReady);
      // eslint-disable-next-line no-underscore-dangle
      window?._satellite?.track('event', event);
    }
  }, 1000);
}

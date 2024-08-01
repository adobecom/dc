const params = new Proxy(new URLSearchParams(window.location.search),{
  get: (searchParams, prop) => searchParams.get(prop),
});

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

export default function init(verb) {
  const event = {
    documentUnloading: true,
    data: {
      eventType: 'web.webinteraction.linkClicks',
      web: {
        webInteraction: {
          linkClicks: { value: 1 },
          type: 'other',
          name: `acrobat:verb-${verb}:landing:shown`,
        },
      },
      _adobe_corpnew: {
        digitalData: {
          dcweb: { event: { pagename: `acrobat:verb-${verb}:landing:shown` } },
          dcweb2: {
            event: { pagename: `acrobat:verb-${verb}:landing:shown` },
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
              ],
            },
          },
        },
      },
    },
  };
  // Alloy Ready...
  const AlloyReady = setInterval(() => {
    if (window?._satellite?.track) {
      clearInterval(AlloyReady);
      window?._satellite?.track('event', event);
    }
  }, 1000);
}

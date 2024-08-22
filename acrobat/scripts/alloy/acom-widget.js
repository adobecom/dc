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

export default function init(eventName, verb) {
  const event = {
    documentUnloading: true,
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
          dcweb: { event: { pagename: `acrobat:verb-${verb}:${eventName}` } },
          dcweb2: { event: { pagename: `acrobat:verb-${verb}:${eventName}` } },
        },
      },
    },
  };
  // eslint-disable-next-line no-underscore-dangle
  window?._satellite?.track('event', event);
}

export default function init() {
  // Figure out how to setp LH
  const lh = 'productRating';

  const event = {
    // always trigger the event using navigator.sendBeacon
    documentUnloading: true,
    data: {
      eventType: 'web.webinteraction.linkClicks',
      web: {
        webInteraction: {
          linkClicks: {
            value: 1,
          },
          type: 'other',
          name: lh,
        },
      },
      _adobe_corpnew: {
        digitalData: {
          primaryEvent: {
            eventInfo: {
              interaction: {
                click: lh,
                iclick: 'true',
              },
              eventName: lh,
            },
          },
        },
      },
    },
  };
  window._satellite.track('event', event);
}

export default function init(fragmentName, state, ctaNumber, text) {
  const customLink = [fragmentName.toUpperCase(), state, `${ctaNumber}-${text}`].join('|');
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
          name: customLink,
        },
      },
      _adobe_corpnew: {
        digitalData: {
          primaryEvent: {
            eventInfo: {
              interaction: {[state]: customLink},
              eventName: customLink,
            },
          },
        },
      },
    },
  };
  window._satellite.track('event', event);
}

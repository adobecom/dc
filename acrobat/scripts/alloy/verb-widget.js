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
  // Alloy Ready...
  const AlloyReady = setInterval(() => {
    // eslint-disable-next-line no-underscore-dangle
    if (window?._satellite?.track) {
      clearInterval(AlloyReady);
      // eslint-disable-next-line no-underscore-dangle
      window._satellite?.track('event', event);
    }
  }, 1000);
  // eslint-disable-next-line no-underscore-dangle
}

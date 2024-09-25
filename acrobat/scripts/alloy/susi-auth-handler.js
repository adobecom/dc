export default function init(ctaName, action, device) {
  const event = {
    // always trigger the event using navigator.sendBeacon
    documentUnloading: true,
    data: {
      eventType: 'web.webinteraction.linkClicks',
      web: {
        webInteraction: {
          linkClicks: { value: 1 },
          type: 'other',
          name: `${ctaName}|marquee-${action}|overview|${device}`,
        },
      },
    },
  };
  // eslint-disable-next-line no-underscore-dangle
  window?._satellite?.track('event', event);
}

export default function init(verb) {
  const event = {
    documentUnloading: true,
    data: {
      eventType: 'web.webinteraction.linkClicks',
      web: {
        webInteraction: {
          linkClicks: { value: 1 },
          type: 'other',
          name: `acrobat:verb-${verb}:goto-app:clicked:migration_testing`,
        },
      },
    },
  };
  window?._satellite?.track('event', event);
}

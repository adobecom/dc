export default function init(verb, rating, comment) {
  const alloyFeedbackEvent = {

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
          name: 'feedback',
        },
      },
      _adobe_corpnew: {
        digitalData: {
          primaryEvent: {
            eventInfo: {
              interaction: {
                click: 'productRating',
                iclick: 'true',
                rating: rating,
                comment: comment,
                verb: verb,
              },
              eventName: 'productRating',
            },
          },
          feedback: {
            feedbackInfo: {
              rating: rating,
              verb: verb,
            },
          },
        },
      },
    },
  };

  window._satellite.track('event', alloyFeedbackEvent);
  console.log('Alloy Review Feedback');

}

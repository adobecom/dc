export default function init(ev, brow, inter) {

  const names = {
    modalClosed : {
      Chrome: 'Get the extension-1|close-viewer-extension|Chrome-extension',
      'Microsoft Edge': 'Get the extension-1|close-viewer-extension|MSFT-Edge-extension',
    },
    modalExist : {
      Chrome: 'Get the extension-1|viewer-extension-exists|Chrome-extension',
      'Microsoft Edge': 'Get the extension-1|viewer-extension-exists|MSFT-Edge-extension',
    },
    modalAlready : {
      Chrome: 'Get the extension-1|already-closed-viewer-extension|Chrome-extension',
      'Microsoft Edge': 'Get the extension-1|already-closed-viewer-extension|MSFT-Edge-extension',
    },
    modalGetExtension : {
      Chrome: 'Get the extension-1|viewer-extension|Chrome-extension',
      'Microsoft Edge': 'Get the extension-1|viewer-extension|MSFT-Edge-extension',
    },
  };

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
                name: 'browserExtensionModal',
            },
        },
        _adobe_corpnew: {
            digitalData: {
                primaryEvent: {
                    eventInfo: {
                        interaction: inter ? { [inter]: names[ev][brow] } : {click: names[ev][brow], iclick: 'true'},
                        eventName: names[ev][brow],
                    },
                },
            },
        },
    },
  };

  window._satellite.track('event', event);
}

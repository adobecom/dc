export function pageRoutePlugin() {
  return {
    name: 'page-route-command',

    async executeCommand({ command, payload, session }) {
      if (command === 'page-route') {
        if (session.browser.type === 'playwright') {
          if (['Webkit', 'Firefox'].includes(session.browser.name)) {
            const page = session.browser.getPage(session.id);
            await page.route(payload.url, async (route) => {
              const response = await route.fetch();
              route.fulfill({ response });
            });
          }
          return true;
        }
        throw new Error(
          `Stopping a page route is not supported for browser type ${session.browser.type}.`,
        );
      } else if (command === 'page-unroute') {
        if (session.browser.type === 'playwright') {
          if (['Webkit', 'Firefox'].includes(session.browser.name)) {
            const page = session.browser.getPage(session.id);
            await page.unroute(payload.url);
          }
          return true;
        }
        throw new Error(
          `Stopping a page route is not supported for browser type ${session.browser.type}.`,
        );
      }
      return undefined;
    },
  };
}

export default pageRoutePlugin;

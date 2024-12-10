/* eslint-disable no-console */
import rollupReplace from '@rollup/plugin-replace';
import { fromRollup } from '@web/dev-server-rollup';

export function rollupReplacePlugin() {
  const replace = fromRollup(rollupReplace);

  let pluginArgs = {};
  if (process.env.MILOLIBS) {
    const miloLib = process.env.MILOLIBS;
    let miloLibFull = miloLib;
    if (miloLib === 'local') {
      miloLibFull = 'http://localhost:6456';
    } else if (miloLib.includes('--')) {
      miloLibFull = `https://${miloLib}.aem.page`;
    } else {
      miloLibFull = `https://${miloLib}--milo--adobecom.aem.page`;
    }
    pluginArgs = {
      "'main'": `'${miloLib}'`,
      'https://main--milo--adobecom.aem.page': `${miloLibFull}`,
      delimiters: ['', ''],
    };
    console.log(`Rollup replace:\n ${JSON.stringify(pluginArgs, null, 2)}`);
  }
  return replace(pluginArgs);
}

export default rollupReplacePlugin;

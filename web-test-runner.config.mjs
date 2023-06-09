import { importMapsPlugin } from '@web/dev-server-import-maps';
import { defaultReporter } from '@web/test-runner';

export default {
  coverageConfig: {
    exclude: ['**/mocks/**', '**/node_modules/**', '**/test/**'],
    reportDir: 'coverage/wtr'
  },
  reporters: [
    defaultReporter({ reportTestResults: true, reportTestProgress: true }),
  ],
  plugins: [importMapsPlugin({})],
};

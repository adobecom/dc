const fs = require('fs');

fs.rmSync(`${__dirname}/../Acrobat_DC_web_prod/utils/csp/prod.js`, { force: true });

fs.rmSync(`${__dirname}/../Acrobat_DC_web_prod/utils/csp/stage.js`, { force: true });

fs.cpSync(`${__dirname}/../../acrobat/scripts/contentSecurityPolicy/prod.js`, `${__dirname}/../Acrobat_DC_web_prod/utils/csp/prod.js`);

fs.cpSync(`${__dirname}/../../acrobat/scripts/contentSecurityPolicy/stage.js`, `${__dirname}/../Acrobat_DC_web_prod/utils/csp/stage.js`);

const fs = require('fs');

fs.rmSync(`${__dirname}/../Acrobat_DC_web_stg`, { recursive: true, force: true });

fs.cpSync(`${__dirname}/../Acrobat_DC_web_prod`, `${__dirname}/../Acrobat_DC_web_stg`, {recursive: true});

let mainjs = fs.readFileSync(`${__dirname}/../Acrobat_DC_web_stg/main.js`, 'utf8');

mainjs = mainjs.replace(/isProd = true/g, 'isProd = false');

fs.writeFileSync(`${__dirname}/../Acrobat_DC_web_stg/main.js`, mainjs);
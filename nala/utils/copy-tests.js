#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

// ✅ Usage: node nala/utils/copy-and-fix-imports.js <source-repo-path> block1 block2

const [,, sourceRepo, ...blocks] = process.argv;

if (!sourceRepo || blocks.length === 0) {
  console.error(chalk.red('\n❌ Usage: node nala/utils/copy-and-fix-imports.js <source-repo-path> <block1> <block2> ...\n'));
  process.exit(1);
}

console.log(chalk.cyan(`\n📁 Source repo: ${sourceRepo}`));
console.log(chalk.cyan(`📦 Blocks to copy: ${blocks.join(', ')}`));

blocks.forEach(blockName => {
  console.log(chalk.blue.bold(`\n🔄 Processing block: ${blockName}`));

  const sources = {
    page: path.join(sourceRepo, 'selectors/bacom', `${blockName}.page.js`),
    test: path.join(sourceRepo, 'tests/bacom/blocks', `${blockName}.test.js`),
    spec: path.join(sourceRepo, 'features/bacom/blocks', `${blockName}.spec.js`)
  };

  const destFolder = path.join(process.cwd(), 'nala', 'blocks', blockName);
  if (!fs.existsSync(destFolder)) {
    fs.mkdirSync(destFolder, { recursive: true });
    console.log(chalk.green(`📁 Created: ${destFolder}`));
  }

  for (const [type, src] of Object.entries(sources)) {
    const dest = path.join(destFolder, `${blockName}.${type}.js`);
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, dest);
      console.log(chalk.green(`✅ Copied ${type} → ${dest}`));
    } else {
      console.log(chalk.yellow(`⚠️  Missing ${type}: ${src}`));
    }
  }

  // ✅ Update import paths inside the test.js file
  const testFile = path.join(destFolder, `${blockName}.test.js`);
  if (fs.existsSync(testFile)) {
    let content = fs.readFileSync(testFile, 'utf8');
  // ✅ Regex replacements (handles variable depth & org folder)
    content = content
    // features/<org>/blocks/<blockName>.spec.js → ./<blockName>.spec.js
      .replace(
      /(\.\.\/)+features\/[^/]+\/blocks\/([a-zA-Z0-9_-]+)\.spec\.js/g,
      './$2.spec.js'
      )
    // selectors/<org>/<blockName>.page.js → ./<blockName>.page.js
      .replace(
      /(\.\.\/)+selectors\/[^/]+\/([a-zA-Z0-9_-]+)\.page\.js/g,
      './$2.page.js'
      )
    // Clean redundant .././ or ././ cases
    .replace(/\.\.\/\.\//g, './')
    .replace(/\.\/\.\//g, './');
    fs.writeFileSync(testFile, content);
    console.log(chalk.green(`✅ Fixed import paths in: ${testFile}`));
  }
});

console.log(chalk.green.bold('\n🎉 All blocks copied and imports fixed successfully!\n'));

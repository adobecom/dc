import { expect } from '@esm-bundle/chai';

describe('Test scripts.js configurable preloads', () => {
  it('has preload metadata', async () => {
    document.head.innerHTML = '<link rel="icon" href="data:,"><meta name="preloads" content="$MILOLIBS/blocks/marquee/marquee.js,$MILOLIBS/blocks/marquee/marquee.css,https://www.example.com/abc.js"/>';
    document.body.innerHTML = '<main><div class="marquee"></main>';
    await import('../../acrobat/scripts/scripts.js');
    const js = document.querySelector('link[rel="preload"][href="https://main--milo--adobecom.hlx.page/libs/blocks/marquee/marquee.js"]');
    const css = document.querySelector('link[rel="stylesheet"][href="https://main--milo--adobecom.hlx.page/libs/blocks/marquee/marquee.css"]');
    const other = document.querySelector('link[rel="preload"][href="https://www.example.com/abc.js"]');
    const acrobatcss = document.querySelector('link[rel="stylesheet"][href="/acrobat/styles/styles.css"]');
    const milocss = document.querySelector('link[rel="stylesheet"][href="https://main--milo--adobecom.hlx.page/libs/styles/styles.css"]');
    expect(js).not.to.be.null;
    expect(css).not.to.be.null;
    expect(other).not.to.be.null;
    expect(acrobatcss).not.to.be.null;
    expect(milocss).not.to.be.null;
  });
});

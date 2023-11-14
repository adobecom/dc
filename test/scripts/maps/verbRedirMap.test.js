import { expect } from '@esm-bundle/chai';

describe('verb redirection map', () => {
  let verbRedirMap;
  beforeEach(async () => {
    const verbRedirMapImport = await import('../../../acrobat/scripts/maps/verbRedirMap.js');
    verbRedirMap = verbRedirMapImport.default;
  });
  it('should return valid redirection for known verbs', () => {
    expect(verbRedirMap.createpdf).to.be.equal('createpdf');
    expect(verbRedirMap['crop-pages']).to.be.equal('crop');
    expect(verbRedirMap['delete-pages']).to.be.equal('deletepages');
    expect(verbRedirMap['extract-pages']).to.be.equal('extract');
    expect(verbRedirMap['combine-pdf']).to.be.equal('combine');
    expect(verbRedirMap['protect-pdf']).to.be.equal('protect');
    expect(verbRedirMap['add-comment']).to.be.equal('addcomment');
    expect(verbRedirMap['pdf-to-image']).to.be.equal('pdftoimage');
    expect(verbRedirMap['reorder-pages']).to.be.equal('reorderpages');
    expect(verbRedirMap.sendforsignature).to.be.equal('sendforsignature');
    expect(verbRedirMap['rotate-pages']).to.be.equal('rotatepages');
    expect(verbRedirMap.fillsign).to.be.equal('fillsign');
    expect(verbRedirMap['split-pdf']).to.be.equal('split');
    expect(verbRedirMap['insert-pdf']).to.be.equal('insert');
    expect(verbRedirMap['compress-pdf']).to.be.equal('compress');
  });
  it('should return undefined for unknown verbs', () => {
    expect(verbRedirMap['unknown-verb']).not.to.exist;
  });
});

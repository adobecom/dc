import { expect } from '@esm-bundle/chai';

describe('locale map', () => {
  let localeMap;
  beforeEach(async () => {
    const localeMapImport = await import('../../../acrobat/scripts/maps/localeMap.js');
    localeMap = localeMapImport.default;
  });
  it('should return valid locale for known keys', () => {
    expect(localeMap.ca_fr).to.be.equal('fr-FR');
    expect(localeMap.be_fr).to.be.equal('fr-FR');
    expect(localeMap.dk).to.be.equal('da-DK');
    expect(localeMap.de).to.be.equal('de-DE');
    expect(localeMap.lu_de).to.be.equal('de-DE');
    expect(localeMap.ch_de).to.be.equal('de-DE');
    expect(localeMap.at).to.be.equal('de-DE');
    expect(localeMap.es).to.be.equal('es-ES');
    expect(localeMap.ar).to.be.equal('es-ES');
    expect(localeMap.cl).to.be.equal('es-ES');
    expect(localeMap.co).to.be.equal('es-ES');
    expect(localeMap.cr).to.be.equal('es-ES');
    expect(localeMap.ec).to.be.equal('es-ES');
    expect(localeMap.gt).to.be.equal('es-ES');
    expect(localeMap.pe).to.be.equal('es-ES');
    expect(localeMap.pr).to.be.equal('es-ES');
    expect(localeMap.fi).to.be.equal('fi-FI');
    expect(localeMap.fr).to.be.equal('fr-FR');
    expect(localeMap.ch_fr).to.be.equal('fr-FR');
    expect(localeMap.lu_fr).to.be.equal('fr-FR');
    expect(localeMap.it).to.be.equal('it-IT');
    expect(localeMap.ch_it).to.be.equal('it-IT');
    expect(localeMap.jp).to.be.equal('ja-JP');
    expect(localeMap.nb).to.be.equal('nb-NO');
    expect(localeMap.no).to.be.equal('nb-NO');
    expect(localeMap.nl).to.be.equal('nl-NL');
    expect(localeMap.pt).to.be.equal('pt-BR');
    expect(localeMap.sv).to.be.equal('sv-SE');
    expect(localeMap.se).to.be.equal('sv-SE');
    expect(localeMap.zh_cn).to.be.equal('zh-CN');
    expect(localeMap.zh_hk).to.be.equal('zh-TW');
    expect(localeMap.hk_zh).to.be.equal('zh-hant-hk');
    expect(localeMap.tw).to.be.equal('zh-hant-tw');
    expect(localeMap.kr).to.be.equal('ko-KR');
    expect(localeMap.cz).to.be.equal('cs-CZ');
    expect(localeMap.pl).to.be.equal('pl-PL');
    expect(localeMap.ru).to.be.equal('ru-RU');
    expect(localeMap.tr).to.be.equal('tr-TR');
    expect(localeMap.br).to.be.equal('pt-BR');
    expect(localeMap.la).to.be.equal('es-ES');
    expect(localeMap.mx).to.be.equal('es-ES');
    expect(localeMap.be_nl).to.be.equal('nl-NL');
    expect(localeMap.bg).to.be.equal('bg-BG');
    expect(localeMap.ee).to.be.equal('et-EE');
    expect(localeMap.lt).to.be.equal('lt-LT');
    expect(localeMap.lv).to.be.equal('lv-LV');
    expect(localeMap.ua).to.be.equal('uk-UA');
    expect(localeMap.si).to.be.equal('sl-SI');
  });

  it('should return undefined for unknown keys', () => {
    expect(localeMap.unknown_locale).not.to.exist;
  });
});

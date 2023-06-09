/**
 * @jest-environment jsdom
 */
import { setLibs, getLibs } from '../../acrobat/scripts/utils';

describe('Test utils.js', () => {
  it('tests setLibs', async () => {
    const libs = setLibs('/libs');
    expect(libs).toBe('https://main--milo--adobecom.hlx.page/libs');
  });

  it('tests setLibs for prod', async () => {
    delete window.location;
    window.location = new URL(
      'https://www.adobe.com'
    );    
    const libs = setLibs('/libs');
    expect(libs).toBe('/libs');
    expect(getLibs()).toBe('/libs');
  });

  it('tests setLibs for stage', async () => {
    delete window.location;
    window.location = new URL(
      'https://www.stage.adobe.com'
    );    
    const libs = setLibs('/libs');
    expect(libs).toBe('https://www.adobe.com/libs');
  });  

  it('tests setLibs for milolibs local', async () => {
    delete window.location;
    window.location = new URL(
      'https://www.stage.adobe.com?milolibs=local'
    );    
    const libs = setLibs('/libs');
    expect(libs).toBe('http://localhost:6456/libs');
  });

  it('tests setLibs for milolibs repo', async () => {
    delete window.location;
    window.location = new URL(
      'https://www.stage.adobe.com?milolibs=main--milo--tsayadobe'
    );    
    const libs = setLibs('/libs');
    expect(libs).toBe('https://main--milo--tsayadobe.hlx.page/libs');
  });   
});

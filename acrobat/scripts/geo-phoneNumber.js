/* eslint-disable compat/compat */
const urlParams = new URLSearchParams(window.location.search);
let newLocale = `${urlParams.get('akamaiLocale')}/`
    || `${JSON.parse(sessionStorage.getItem('international'))?.country?.toLowerCase()}/`
    || `${JSON.parse(sessionStorage.getItem('feds_location'))?.country?.toLowerCase()}/`
    || '';
if (newLocale === 'us/') newLocale = '';

const replaceTypeOfNum = (numType, visNum, i) => {
  const cc = document.querySelector(`.${i}`);
  cc.querySelector('a').href = `tel:${visNum}`;
  cc.querySelector('a').innerText = visNum;
};

// This funct
export default async function fillerforPH() {
  const response = await fetch(`/${newLocale}dc-shared/placeholders.json`);
  const data = await response.text();
  if(data.ok) {
    console.log('good');
  } else {
    console.log('so');
  }
  const DATA = JSON.parse(data);

  document.querySelectorAll('p[class*="geo-pn"]').forEach((p) => {
    const numberType = p.getAttribute('number-type');
    const numberID = p.className;
    DATA.data.forEach((val) => {
      if (val.key === numberType) {
        replaceTypeOfNum(numberType, val.value, numberID);
      }
    });
  });
}


// Update Var names
// Unit Test 
// Test on real pages 
// Test w/ hyperlink
// Test when no geo is present
// dsg

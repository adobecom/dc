/* eslint-disable compat/compat */
const geoTwo = await fetch('https://geo2.adobe.com/json/');
const urlParams = new URLSearchParams(window.location.search);
const geoData = await geoTwo.json();
console.log(`gadgag      -    ${geoData?.country?.toLowerCase()}`);

let newLocale = urlParams.get('akamaiLocale')?.toLowerCase()
    || geoData?.country?.toLowerCase()
    || JSON.parse(sessionStorage.getItem('international'))?.country?.toLowerCase()
    || JSON.parse(sessionStorage.getItem('feds_location'))?.country?.toLowerCase()
    || '';

if (newLocale === 'us' || newLocale === '/' || newLocale === '//') {
  newLocale = '/';
} else {
  newLocale = `/${newLocale}/`;
}

const updatePhoneNumber = (visNum, i) => {
  const phoneNumberEle = document.querySelector(`.${i}`);
  phoneNumberEle.href = `tel:${visNum}`;
  phoneNumberEle.innerText = visNum;
};

// This funct
export default async function geoPhoneNumber() {
  // if (newLocale )
  const placeHolderJson = await fetch(`${newLocale}dc-shared/placeholders.json`);
  const placeHolderJsonData = await placeHolderJson.json();
  window.dcpns = placeHolderJsonData.data;
  const globalPhoneNumbers = new CustomEvent('DCNumbers:Ready');
  window.dispatchEvent(globalPhoneNumbers);

  document.querySelectorAll('a[class*="geo-pn"]').forEach((phoneNumber) => {
    const numberType = phoneNumber.getAttribute('number-type');
    const numberID = phoneNumber.classList[0];
    placeHolderJsonData.data.forEach((val) => {
      if (val.key === numberType) {
        updatePhoneNumber(val.value, numberID);
      }
    });
  });
}

// Catch the frags
const frags = document.querySelectorAll('.fragment [href*="tel"]');
window.addEventListener('DCNumbers:Ready', () => {
  frags.forEach((f) => {
    const fragPhoneType = `phone-${f.href.split(' ')[1]}`;
    window.dcpns.forEach((val) => {
      if (val.key === fragPhoneType) {
        f.innerText = val.value;
        f.href = `tel: ${val.value}`;
      }
    });
  });
});



// Unit Test 
// Test on real pages 
// check page local vs client 


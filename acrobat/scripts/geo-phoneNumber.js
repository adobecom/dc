/* eslint-disable compat/compat */
const urlParams = new URLSearchParams(window.location.search);
let newLocale = urlParams.get('akamaiLocale') || '';
// let newLocale = urlParams.get('akamaiLocale') || JSON.parse(sessionStorage.getItem('feds_location')).country.toLowerCase() || '';
if (newLocale === 'us') newLocale = '';
if (newLocale !== 'us') newLocale = `${newLocale}/`;
console.log(newLocale);

// This funct
export default async function fillerforPH() {
  const pattern = /{{phone-\S\w*\S\w*}}/g;
  const response = await fetch(`/${newLocale}dc-shared/placeholders.json`);
  const data = await response.text();
  const DATA = JSON.parse(data);
  // console.log(DATA.data);
  document.querySelectorAll('p').forEach((p) => {
    const matched = pattern.exec(p.innerHTML);
    if (matched) {
      let numberType = matched[0];
      numberType = numberType.replace('{{', '');
      numberType = numberType.replace('}}', '');
      const ipID = DATA.data.find((o) => o.key === numberType);
      console.log(numberType);
      console.log(ipID);
      window.dcdata = DATA.data;
      p.setAttribute('num-type', numberType);
    }
  });
}

// const response = await fetch(`/${newLocale}dc-shared/placeholders.json`);

// const data = await response.text();
// console.log(data);

// var myarr = ["I", "like", "turtles"];
// var arraycontainsturtles = (myarr.indexOf("turtles"));
// us_phone

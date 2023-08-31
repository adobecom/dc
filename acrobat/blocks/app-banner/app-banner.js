import { createTag } from "../../scripts/miloUtils.js";

var link = '';
var mobileOS = getMobileOperatingSystem();


export default async function init(el) {
  //Exit if not mobile/tablet 
  if (getMobileOperatingSystem() == 'unknown') {
    el.innerHTML = '';
    return;
  }
  const children = el.querySelectorAll(':scope > div');

  createTag.then((createTag) => {
    const appBannerLeft = getDecoratedBannerLeft(createTag, children);
    const appBannerRight = getDecoratedBannerRight(createTag, children);
    const appBannerContent = createTag('div', { class: 'app-banner-content' }, '');
    const appBanner = createTag('div', { class: 'app-banner' }, '');
    appBannerLeft.append(getDecoratedAppDetails(createTag, children));
    appBannerContent.append(appBannerRight, appBannerLeft);
    appBanner.append(appBannerContent);
  
    if (mobileOS === 'Android') {
      link = children[4].textContent.trim();
    } else if (mobileOS === 'iOS') {
      link = children[7].textContent.trim();
    }

    appBannerRight.addEventListener('click', openLink);

    el.innerHTML = '';
    //Insert before head element to show it on the top
    document.head.before(appBanner);
  });
}

function openLink(){
  window.open(link, "_blank");
  closeBanner();
}

function closeBanner(){
  let appBanner = document.querySelector('.app-banner');
  appBanner.remove();
}

function getDecoratedBannerRight(createTag, children) {
  const openText = children[3].textContent.trim();
  const appBannerRight = createTag('div', { class: 'app-banner-right' }, '');
  const openButton = createTag('div', { class: 'app-banner-button', role: 'text', 'aria-label': openText }, openText);
  appBannerRight.append(openButton);
  return appBannerRight;
}

function getDecoratedAppDetails(createTag, children) {
  let rating = 0;
  let reviews = 0;
  let link = '';
  let mobileOS = getMobileOperatingSystem();

  if (mobileOS === 'Android') {
    link = children[4].textContent.trim();
    rating = children[5].textContent.trim();
    reviews = children[6].textContent.trim();
  } else if (mobileOS === 'iOS') {
    link = children[7].textContent.trim();
    rating = children[8].textContent.trim();
    reviews = children[9].textContent.trim();
  }

  const appTitle = createTag('div', { class: 'app-banner-title' }, children[0].textContent.trim());
  const appDesc = createTag('div', { class: 'app-banner-description' }, children[2].textContent.trim());
  const appStars = createTag('div', { class: 'app-banner-stars', role: 'text', 'aria-label': `Average rating ${rating} stars` }, '');

  rating = rating > 5 ? 5 : rating;
  rating = rating < 0 ? 0 : rating;

  for (let i = 0; i < rating; i++) {
    appStars.append(createTag('span', {}, '★'));
  }

  const appBannerDetails = createTag('div', { class: 'app-banner-details' }, '');
  const appReviews = createTag('div', { class: 'app-banner-reviews', 'aria-label': '' }, `(${reviews})`);
  appBannerDetails.append(appTitle, appDesc, appStars, appReviews);
  appBannerDetails.addEventListener('click', openLink);
  return appBannerDetails;
}

function getDecoratedBannerLeft(createTag, children) {
  const appBannerLeft = createTag('div', { class: 'app-banner-left' }, '');
  //Close banner button on the left, also the icon
  const closeBtn = createTag('div', { class: 'app-banner-close', role: 'text', 'aria-label': 'Close banner' }, '×');
  closeBtn.addEventListener('click', closeBanner);

  appBannerLeft.append(closeBtn);
  const picture = children[1].querySelector('img');
  const iconSrc = picture ? picture.getAttribute('src') : '';
  const icon = createTag('div', { class: 'app-banner-icon' }, '');
  const appIcon = createTag('img', { src: `${iconSrc}` }, '');
  icon.append(appIcon);
  icon.addEventListener('click', openLink);
  appBannerLeft.append(icon);
  return appBannerLeft;
}

/**
 * Reusing from express codebase, 
 * can be replaced once Milo provides an implementation
 * @returns mobileOS
 */
function getMobileOperatingSystem() {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;

  // Windows Phone must come first because its UA also contains "Android"
  if (/windows phone/i.test(userAgent)) {
    return 'Windows Phone';
  }

  if (/android/i.test(userAgent)) {
    return 'Android';
  }

  if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
    return 'iOS';
  }

  return 'unknown';
}


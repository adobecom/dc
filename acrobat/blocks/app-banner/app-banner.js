import { setLibs } from '../../scripts/utils.js';

const miloLibs = setLibs('/libs');
/**
 * Reusing from express codebase,
 * can be replaced once Milo provides an implementation
 * @returns mobileOS
 */
export function getMobileOperatingSystem() {
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

let link = '';
let mobileOS = getMobileOperatingSystem();

function closeBanner() {
  const appBanner = document.querySelector('.app-banner');
  document.body.classList.remove('has-app-banner');
  appBanner.remove();
}

function openLink() {
  window.open(link, '_blank');
  closeBanner();
}

const { createTag } = await import(`${miloLibs}/utils/utils.js`);

function getDecoratedBannerRight(children) {
  const openText = children[3].textContent.trim();
  const appBannerRight = createTag('div', { class: 'app-banner-right' });
  const openButton = createTag('button', { class: 'app-banner-button', role: 'text', 'aria-label': openText }, openText);
  appBannerRight.addEventListener('click', openLink);
  appBannerRight.append(openButton);
  return appBannerRight;
}

function getDecoratedAppDetails(children) {
  let rating = 0;
  let reviews = 0;

  if (mobileOS === 'Android') {
    rating = children[5].textContent.trim();
    reviews = children[6].textContent.trim();
  } else if (mobileOS === 'iOS') {
    rating = children[8].textContent.trim();
    reviews = children[9].textContent.trim();
  }

  const appTitle = createTag('h5', { class: 'app-banner-title' }, children[0].textContent.trim());
  const appDesc = createTag('p', { class: 'app-banner-description' }, children[2].textContent.trim());
  const appStars = createTag('div', { class: 'app-banner-stars', role: 'text', 'aria-label': `Average rating ${rating} stars` });

  rating = rating > 5 ? 5 : rating;
  rating = rating < 0 ? 0 : rating;

  for (let i = 0; i < rating; i += 1) {
    appStars.append(createTag('span', {}, '★'));
  }

  const appBannerDetails = createTag('div', { class: 'app-banner-details' });
  const appReviews = createTag('div', { class: 'app-banner-reviews', 'aria-label': '' }, `(${reviews})`);
  appBannerDetails.append(appTitle, appDesc, appStars, appReviews);
  appBannerDetails.addEventListener('click', openLink);
  return appBannerDetails;
}

function getDecoratedBannerLeft(children) {
  const appBannerLeft = createTag('div', { class: 'app-banner-left' });
  const picture = children[1].querySelector('img');
  const iconSrc = picture ? picture.getAttribute('src') : '';
  const icon = createTag('div', { class: 'app-banner-icon' });
  const appIcon = createTag('img', { src: `${iconSrc}` });
  icon.append(appIcon);
  icon.addEventListener('click', openLink);
  appBannerLeft.append(icon);
  return appBannerLeft;
}

export default async function init(el) {
  if (mobileOS === 'unknown') {
    el.innerHTML = '';
    return;
  }
  await createTag();
  const bannerPlaceHolder = createTag('div', { class: 'placeholder-banner' });
  document.body.prepend(bannerPlaceHolder);
  const { children } = el;
  if (mobileOS === 'Android') {
    link = children[4].textContent.trim();
  } else if (mobileOS === 'iOS') {
    link = children[7].textContent.trim();
  }
  const appBanner = createTag('div', { class: 'app-banner' });
  // Close banner button on the left, also the icon
  const closeBtn = createTag('div', { class: 'app-banner-close', role: 'text', 'aria-label': 'Close banner' }, '×');
  closeBtn.addEventListener('click', closeBanner);
  const appBannerContent = createTag('div', { class: 'app-banner-content' });
  appBannerContent.append(
    closeBtn,
    getDecoratedBannerLeft(children),
    getDecoratedAppDetails(children),
    getDecoratedBannerRight(children),
  );
  appBanner.append(appBannerContent);
  el.innerHTML = '';
  appBanner.style.display = 'block';
  bannerPlaceHolder.remove();
  document.body.classList.add('has-app-banner');
  document.body.prepend(appBanner);
}

export function setMobileOS(testOS) {
  mobileOS = testOS;
}

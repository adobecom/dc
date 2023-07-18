export default function ccTranslations() {
  const pTags = document.documentElement.querySelectorAll('p[data-local="credit-cards"]');
  function checkIfImageExists(url) {
    const http = new XMLHttpRequest();
    http.open('HEAD', url, false);
    http.send();
    if (http.status !== 404) {
      return true;
    }
    return false;
  }
  function errorLogging() {
    window.lana?.log('No image available for credit-card placeholder');
  }

  pTags.forEach((tag) => {
    const ccimg = document.createElement('img');
    const ccName = tag.innerHTML.toLowerCase();
    const imgExt = '.jpg';
    const imgPrefix = 'credit-cards-';
    const imageName = imgPrefix + ccName + imgExt;
    const imagePath = `/acrobat/img/icons/${imageName}`;
    if (checkIfImageExists(imagePath)) {
      ccimg.setAttribute('src', imagePath);
      ccimg.setAttribute('loading', 'lazy');
      ccimg.setAttribute('data-local', 'credit-cards');
      tag.replaceWith(ccimg);
    } else {
      errorLogging();
      tag.remove();
    }
  });
}

const BASE_URL = 'https://www.adobe.com/';

export const getBackgroundImage = (element) => {
  let result = null;
  const styleTag = element.querySelector('style');
  const styleText = styleTag.textContent?.split(':');
  for(let i = 0; i < styleText.length; i++){
    if(styleText[i].includes('background-image') && styleText[i].includes('1200px')){
      result = styleText[i + 1];

      break;
    }
  }

  if(result) {
    result = result.split('\\2f').slice(1);
    result = result.map((word, index) => {
      if(index === result.length - 1){
        return word.split(')')[0].trim();
      }

      return word.trim();
    });

    return BASE_URL + result.join('/');
  }

  return result;
}

const getStyles = (element, style) => {
  let result = null;
  const styleTag = element.querySelector('style');
  const styleText = styleTag.textContent?.split(':');
  for(let i = 0; i < styleText.length; i++){
    if(styleText[i].includes(style)){
      result = styleText[i + 1].split(';')[0].trim();

      break;
    }
  }

  return result;
}

export default getStyles;

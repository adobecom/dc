
const FRAGMENTLINK = 'https://main--dc--adobecom.hlx.page/dc-shared/fragments/shared-fragments/frictionless/verb-footer/verb-footer-shell'

const createVerbFooter = (main, document) => {
  const fragments = main.querySelectorAll('.experiencefragment');
  if(!fragments.length) {
    return;
  }
  const verbFragmentLink = document.createElement('a');
  verbFragmentLink.textContent = FRAGMENTLINK;
  verbFragmentLink.href = FRAGMENTLINK;

  fragments.forEach((fragment) => {
    const dataPath1 = fragment.querySelector('.dc-dx-frag')?.getAttribute('data-path');
    if(dataPath1 && dataPath1.includes('shell')){
      fragment.before(document.createElement('hr'));
      fragment.after(document.createElement('hr'));
      fragment.replaceWith(verbFragmentLink);

      return;
    }

    const dataPath2 = fragment.querySelector('.dxf')?.getAttribute('data-lazy-load-path');
    if(dataPath2 && dataPath2.includes('verb-footer')){
      fragment.before(document.createElement('hr'));
      fragment.after(document.createElement('hr'));
      fragment.replaceWith(verbFragmentLink);

      return;
    }
  });

}

export default createVerbFooter;

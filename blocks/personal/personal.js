
export default function init(element) {
  const container = element;
  const frags = Array.from(container.children);


  setTimeout ( () => {
    const upsell = doccloudPersonalization.create_pdf.can_process

    frags.forEach( (ele) => {
      console.log(ele);
      const tag = ele.firstElementChild.textContent.trim()
      if (tag === 'upsell' && !upsell) {
        ele.dataset.tag = ele.firstElementChild.textContent;
      } 
      
      if ( tag === '' && upsell) {
        ele.dataset.tag = ele.firstElementChild.textContent;
      }

    })
  }, 300)
}

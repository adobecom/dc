const form = document.createElement('form');
form.id = 'theform';
let encodeFileName;
let percent = 0;
const createTag = function createTag(tag, attributes, html) {
  const el = document.createElement(tag);
  if (html) {
    if (html instanceof HTMLElement
        || html instanceof SVGElement
        || html instanceof DocumentFragment) {
      el.append(html);
    } else if (Array.isArray(html)) {
      el.append(...html);
    } else {
      el.insertAdjacentHTML('beforeend', html);
    }
  }
  if (attributes) {
    Object.entries(attributes).forEach(([key, val]) => {
      el.setAttribute(key, val);
    });
  }
  return el;
};

const handleDragOver = (e) => {
  e.preventDefault();
};

let loadDC;
if (!window.localStorage.limit) {
  window.localStorage.limit = 0;
}

const handleDrop = (e) => {
  // let datas;
  e.preventDefault();
  console.log(e.dataTransfer.files);
  if (e.dataTransfer.items) {
    [...e.dataTransfer.items].forEach((item, i) => {
      if (item.kind === 'file') {
        const file = item.getAsFile();
        if (file.type != 'application/pdf') {
          alert('Please try a PDF');
          // return;
        } else {
          loadDC = true;
        }
        console.log(`KIND = file, file[${i}].name = ${file.name}`);
      }
    });
  } else {
    [...e.dataTransfer.files].forEach((file, i) => {
      if (file.type != 'application/pdf') {
        alert('Please try a PDF');
        // return
      } else {
        loadDC = true;
      }
      console.log(`file[${i}].name = ${file.name}`);
    });
  }
};

const upload = (pbw, pb) => {
  const file = document.getElementById('file-upload');
  const filename = file.value.split('\\').slice(-1)[0];
  const extension = filename.split('.').slice(-1)[0].toLocaleLowerCase();
  let contentType = null;

  // Progress Bar... fake
  document.querySelector('.widget-button').insertAdjacentElement('afterend', pbw);
  document.querySelector('.widget-button').remove();
  pbw.appendChild(pb);
  const movepb = document.querySelector('.pBar');
  const pBarInt = setInterval(() => {
    percent = percent + 10;
    movepb.style.width = `${percent}%`;
    if (percent === 100) {
      clearInterval(pBarInt);
    }
  }, 305);

  // Detect Content Type, right now only images 
  if (extension === 'png') {
    contentType = 'image/png';
  } else if (extension === 'jpg' || extension === 'jpeg') {
    contentType = 'image/jpeg';
  } else if (extension === 'svg') {
    contentType = 'image/svg+xml';
  } else if (extension === 'mpeg') {
    contentType = 'video/mpeg';
  } else if (extension === 'webm') {
    contentType = 'video/webm';
  } else {
    alert('This file is invalid?');
  }

  // do something with upload
};

export default function init(element) {
  // Create Fake Widget
  const content = element.querySelectorAll(':scope > div');

  Array.from(content).forEach((con) => {
    con.classList.add('hide');
  });
  element.classList.add('ready');
  const wrappernew = createTag('div', { id: 'CIDTWO', class: 'fsw widget-wrapper facade' });
  const wrapper = createTag('div', { id: 'CID', class: 'fsw widget-wrapper' });
  const heading = createTag('h1', { class: 'widget-heading' }, `${content[1].textContent}`);
  const dropZone = createTag('div', { id: 'dZone', class: 'widget-center' });
  const copy = createTag('p', { class: 'widget-copy' }, `${content[2].textContent}`);
  const button = createTag('input', { type: 'file', id: 'file-upload', class: 'hide' }, `${content[3].textContent}`);
  const buttonLabel = createTag('label', { for: 'file-upload', class: 'widget-button' }, `${content[3].textContent}`);
  const legal = createTag('p', { class: 'widget-legal' }, `${content[4].textContent}`);
  const subTitle = createTag('p', { class: 'widget-sub' }, 'Adobe Acrobat');
  const iconLogo = createTag('div', { class: 'widget-icon'});
  const iconSecurity = createTag('div', { class: 'security-icon' });
  const icon = createTag('div', { class: 'widget-big-icon' });
  const footer = createTag('div', { class: 'widget-footer' });
  const progressBarWrapper = createTag('div', { class: 'pBar-wrapper' });
  const progressBar = createTag('div', { class: 'pBar' });
  wrapper.append(subTitle);
  subTitle.prepend(iconLogo);
  wrapper.append(icon);

  wrapper.append(heading);
  wrapper.append(copy);
  wrapper.append(button);
  wrapper.append(buttonLabel);
  footer.append(iconSecurity);
  footer.append(legal);
  element.append(wrapper);
  element.append(footer);
  element.append(wrappernew);

  // if (Number(window.localStorage.limit) === 1) {
  //   const secondConversion = createTag('p', { class: 'demo-text' }, 'Returning Visitor');
  //   heading.prepend(secondConversion);
  // }

  dropZone.addEventListener('dragover', (file) => {
    handleDragOver(file);
    dropZone.classList.add('dragging');
  });
  dropZone.addEventListener('dragleave', (file) => {
    dropZone.classList.remove('dragging');
  });

  dropZone.addEventListener('drop', (file) => {
    handleDrop(file);
    dropZone.classList.remove('dragging');
    // make call to dc web and pass over file
    if (loadDC) { window.localStorage.limit = 1 + Number(window.localStorage.limit); }
    upload();
  });

  button.addEventListener('click', (e) => {
    // upload();
  });

  button.addEventListener('change', (e) => {
    upload(progressBarWrapper, progressBar);
    // after upload the user should be sebt to acrobat.adobe.com page
  });

}

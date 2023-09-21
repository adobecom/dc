// import {createTag} from "../../scripts/miloUtils.js";
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
}

let loadDC;
if (!window.localStorage.limit) {
  window.localStorage.limit = 0
}

const handleDragOver = (e) => {
  e.preventDefault();
}

const handleDrop = (e) => {
  // let datas;
  e.preventDefault();
  console.log(e.dataTransfer.files);
  if (e.dataTransfer.items) {
    [...e.dataTransfer.items].forEach((item, i) => {
      if (item.kind === "file") {
        const file = item.getAsFile();
        if (file.type != 'application/pdf') {
          alert('Please try a PDF');
          return
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
        return
      } else {
        loadDC = true;
      }
      console.log(`file[${i}].name = ${file.name}`);
    });
  }
}



export default function init(element) {
  console.log(element.querySelectorAll(':scope > div'));
        //Create Fake Widget
        // createTag.then((tag) => {
          const content = element.querySelectorAll(':scope > div');

          Array.from(content).forEach( (con) => {
            con.classList.add('hide')
          })

          element.classList.add('ready');
          // element.setAttribute('ready', '')


          const wrapper = createTag('div', {id: 'CID', class: `fsw widget-wrapper ` });
          const heading = createTag('h1', { class: 'widget-heading' }, `${content[1].textContent}`);
          const dropZone = createTag('div', { id: 'dZone', class: 'widget-center' });
          const copy = createTag('p', { class: 'widget-copy' }, `${content[2].textContent}`);
          const button = createTag('input', { type: 'file', id: 'file-upload', class: 'hide' }, `${content[3].textContent}`);
          const buttonLabel = createTag('label', { for: 'file-upload', class: 'widget-button' }, `${content[3].textContent}`);
          const legal = createTag('p', { class: 'widget-legal' }, `${content[4].textContent}`);
          const icon = createTag('p',{ class: 'widget-sub' } , 'Adobe Acrobat');
          const upsell = createTag('p',{ class: 'demo-text' } , content[5].textContent);

          const iconLogo = createTag('svg',{ xmlns: "http://www.w3.org/2000/svg", width: '25', height: '25' } );
          // const iconLogoOne = createTag('path',{ fill: '#FA0F00', d: 'M45.257 0h165.485C235.886 0 256 20.114 256 45.257v165.486C256 235.886 235.886 256 210.742 256H45.257C20.114 256 0 235.886 0 210.743V45.257C0 20.114 20.114 0 45.257 0z' } );
          // const iconLogoTwo = createTag('path',{  fill: '#FFF', d: 'M204.144 147.657c-11.887-12.343-44.344-7.314-52.115-6.4-11.428-10.972-19.199-24.229-21.942-28.8 4.114-12.343 6.856-24.686 7.314-37.942 0-11.429-4.571-23.771-17.372-23.771-4.571 0-8.686 2.742-10.972 6.399-5.485 9.601-3.2 28.801 5.486 48.458-5.028 14.171-9.6 27.885-22.4 52.114-13.257 5.484-41.143 18.285-43.429 32-.914 4.113.457 8.229 3.657 11.428 3.2 2.743 7.314 4.114 11.429 4.114 16.914 0 33.371-23.313 44.8-42.972 9.6-3.199 24.686-7.771 39.772-10.514 17.828 15.543 33.371 17.828 41.6 17.828 10.971 0 15.086-4.571 16.457-8.686 2.285-4.57.914-9.599-2.285-13.256zm-11.43 7.772c-.457 3.2-4.57 6.399-11.885 4.571-8.686-2.285-16.457-6.4-23.314-11.886 5.943-.915 19.199-2.286 28.8-.457 3.657.914 7.314 3.2 6.399 7.772zm-76.342-94.172c.914-1.371 2.286-2.285 3.657-2.285 4.114 0 5.028 5.028 5.028 9.143-.457 9.601-2.286 19.2-5.485 28.343-6.858-18.286-5.486-31.087-3.2-35.201zm-.914 88.686c3.657-7.314 8.686-20.115 10.514-25.601 4.114 6.856 10.971 15.086 14.629 18.743 0 .458-14.172 3.2-25.143 6.858zm-26.972 18.286C77.972 185.6 67 196.571 61.057 196.571c-.914 0-1.829-.457-2.743-.914-1.372-.915-1.829-2.286-1.372-4.114 1.372-6.4 13.258-15.086 31.544-23.314z' } );



          // iconLogo.append(iconLogoOne)
          // iconLogo.append(iconLogoTwo)

          if (Number(window.localStorage.limit) > 1) {
            upsell.classList.remove('hide')
            wrapper.append(upsell);
            element.append(wrapper);
          } else {
            wrapper.append(iconLogo);
            iconLogo.append(icon)
            wrapper.append(heading);
            wrapper.append(dropZone)
            dropZone.append(copy);
            dropZone.append(button);
            dropZone.append(buttonLabel);
            wrapper.append(legal);
            element.append(wrapper);
          }

          if (Number(window.localStorage.limit) === 1 ) {
            const secondConversion = createTag('p',{ class: 'demo-text' } , 'Returning Visitor');
            heading.prepend(secondConversion);
          }

          const dcWidgetScript = createTag('script', {
            id: 'adobe_dc_sdk_launcher',
            src: 'https://stage.acrobat.adobe.com/dc-hosted/3.8.0_2.15.2/dc-app-launcher.js',
            'data-dropzone_id': 'CID',
            'data-locale': 'us-en',
            'data-server_env': 'prod',
            'data-verb': 'pdf-to-ppt',
            'data-load_typekit': 'false',
            'data-load_imslib': 'false',
            'data-enable_unload_prompt': 'true',
          });

          dropZone.addEventListener('dragover', (file) => {
            handleDragOver(file);
            dropZone.classList.add('dragging');
          });
          dropZone.addEventListener('dragleave', (file) => {
            dropZone.classList.remove('dragging');
          })

          dropZone.addEventListener('drop', (file) => {
            handleDrop(file);
            dropZone.classList.remove('dragging');
            //make call to dc web and pass over file 
            if (loadDC) {element.append(dcWidgetScript) }
            if (loadDC) {window.localStorage.limit = 1 + Number(window.localStorage.limit) }
            // loadScript('https://stage.acrobat.adobe.com/dc-hosted/3.10.0_2.16.2/dc-app-launcher.js');
          })

          button.addEventListener('change', (e) => {
            // const selectedFile = document.getElementById("file-upload").files[0];
            console.log(selectedFile);
            if (loadDC) {element.append(dcWidgetScript) }
            if (loadDC) {window.localStorage.limit = 1 + Number(window.localStorage.limit) }
          })
        // })

}

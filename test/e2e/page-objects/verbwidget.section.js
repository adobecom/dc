import fs from 'fs';
import path from 'path';
import { Section } from '@amwp/platform-ui-automation/lib/common/page-objects/section';

export class VerbWidgetSection extends Section {
  constructor() {
    super();
    this.buildProps({
      selectButton: '.verb-cta',
      fileUploadInput: '#file-upload',
      dropZone: '#drop-zone',
    })
  }

  async chooseFiles(filePaths) {
    const fileChooserPromise = this.native.waitForEvent('filechooser');
    this.selectButton.click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles(filePaths);   
  }

  async dragndropFiles(filePaths) {
    const filePath = filePaths[0];
    const buffer = fs.readFileSync(filePath).toString('base64');
    const basename = path.basename(filePath);

    const dataTransfer = await this.dropZone.evaluateHandle(async({bufferData, basename}) => {
        const dt = new DataTransfer();
        const blobData = await fetch(bufferData).then((res) => res.blob());
        const file = new File([blobData], basename, { type: 'application/pdf' });
        dt.items.add(file);
        return dt;
    }, {
        bufferData: `data:application/octet-stream;base64,${buffer}`, 
        basename
    });

    await this.dropZone.dispatchEvent('drop', { dataTransfer });
  }
}

async function dragAndDropFile(
    page,
    selector,
    filePath,
    fileName,
    fileType = ''
  ) {
    const buffer = readFileSync(filePath).toString('base64');
  
    const dataTransfer = await page.evaluateHandle(
      async ({ bufferData, localFileName, localFileType }) => {
        const dt = new DataTransfer();
  
        const blobData = await fetch(bufferData).then((res) => res.blob());
  
        const file = new File([blobData], localFileName, { type: localFileType });
        dt.items.add(file);
        return dt;
      },
      {
        bufferData: `data:application/octet-stream;base64,${buffer}`,
        localFileName: fileName,
        localFileType: fileType,
      }
    );
  
    await page.dispatchEvent(selector, 'drop', { dataTransfer });
  };
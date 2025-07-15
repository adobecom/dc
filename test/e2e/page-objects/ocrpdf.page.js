import { FrictionlessPage } from './frictionless.page';

export class OcrPdfPage extends FrictionlessPage {
  constructor() {
    super("/acrobat/online/ocr-pdf");
  }
}
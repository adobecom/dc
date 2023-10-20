import { classes } from "polytype";
import { DcGnavPage } from "./dcgnav.page";
import { PdfWidgetSection } from "./pdfwidget.section";

export class CaaSPage extends classes(DcGnavPage, PdfWidgetSection) {
  constructor(contentPath) {
    super({
      super: DcGnavPage,
      arguments: [contentPath],
    });
    this.buildProps({
      caas: '#caas',
      caasFragment: '.fragment[data-path*="caas"]>>nth=0',
      caasButton: 'a[data-testid="consonant-BtnInfobit"]'
    });
  }
}

import { classes } from "polytype";
import { DcGnavPage } from "./dcgnav.page";
import { PdfWidgetSection } from "./pdfwidget.section";

export class CaaSPage extends classes(DcGnavPage, PdfWidgetSection) {
  constructor(contentPath) {
    let locContentPath = contentPath;
    // if locale is specified, add to the path
    if (global.config.profile.locale) {
      locContentPath = locContentPath.replace(/^\/*|\/*$/g, '');
      if (global.config.profile.locale === 'us') {
        locContentPath = `/${locContentPath}`;
      } else {
        locContentPath = `/${global.config.profile.locale}/${locContentPath}`;
      }
    }
    super({
      super: DcGnavPage,
      arguments: [locContentPath],
    });
    this.buildProps({
      caas: '#caas',
      caasFragment: '.fragment[data-path*="caas"]>>nth=0',
      caasButton: 'a[data-testid="consonant-BtnInfobit"]'
    });
  }
}

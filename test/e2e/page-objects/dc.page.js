import { classes } from "polytype";
import { DcGnavPage } from "./dcgnav.page";
import { CaaSSection } from "./caas.section";
import { CommerceSection } from "./commerce.section";

export class DCPage extends classes(DcGnavPage, CaaSSection, CommerceSection)  {
  constructor(contentPath) {
    super({
      super: DcGnavPage,
      arguments: [contentPath],
    });
  }
}

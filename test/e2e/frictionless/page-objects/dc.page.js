import { classes } from "polytype";
import { DcGnavPage } from "./dcgnav.page";
import { CommerceSection } from "./commerce.section";

export class DCPage extends classes(DcGnavPage, CommerceSection)  {
  constructor(contentPath) {
    super({
      super: DcGnavPage,
      arguments: [contentPath],
    });
  }
}
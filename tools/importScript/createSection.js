import createMarqueeSection, { checkMarquee } from "./rules/marquee.js";
import createJumpSection, { checkJumpSection } from "./rules/jumpSection.js";
import createTextSection, { checkText } from "./rules/text.js";
import createImageSection, { checkImage } from "./rules/image.js";
import createIconBlock, {checkIconBlock} from "./rules/iconBlock.js";
import createColumnsSection, {checkColumns} from "./rules/columns.js";

const createSection = (element, document) => {
  if(checkMarquee(element)){
    createMarqueeSection(element, document);

    return;
  }

  if(checkJumpSection(element)) {
    createJumpSection(element, document);

    return;
  }

  if(checkIconBlock(element)){
    createIconBlock(element, document);

    return;
  }

  
  if(checkImage(element)){
    createImageSection(element, document);

    return;
  }

  if(checkText(element)){
    createTextSection(element, document);

    return;
  }

  if(checkColumns(element)){
    createColumnsSection(element, document);

    return;
  }

}

export default createSection;

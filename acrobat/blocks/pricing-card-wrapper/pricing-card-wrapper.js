import {getProperties} from "../../scripts/utils.js";

const init = (block) => {
  const properties = getProperties(block);
  console.log('bloc', properties);
  for (let i = 1; i <= properties['countCards']; i++) {
    const currentOption = `card${i}`;
    //todo select all pricing cards that are listed in this block, append them to this block and add styling as flex container,
    // so all cards are displayed in one row
    // console.log('card', document.querySelector(`${properies[currentOption]}`));
  }
};
export default init;

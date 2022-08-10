import AddRemoveColors from '../images/instructions/add-remove-colors.gif';
import SetupOptions from '../images/instructions/setup-options.png';
import ChangeStrandCount from '../images/instructions/change-strand-count.gif';

import { XAlignment, ContentType, InstructionImageName, YAlignment } from "../constants/instructionConstants";

//#region Navigation Page

export const findNavIndex = (pages) => {
  for (let i = 0; i < pages.length; i++) {
    if (pages[i].isNav) {
      return i;
    }
  }
  throw 'Error: No nav page could be found. (findNavIndex, modalLogic.js)';
}

export const isNavPage = (index, pages) => {
  return pages[index].isNav === true;
}

const createNavItemListDisplay = (contentItem, setIndex, key) => {
  let array = [];

  contentItem.navItems.forEach((ni, i) => {
    array.push(
      <li key={`${key}-${i}`}>
        <span
          className="nav-item"
          onClick={() => {
            setIndex(ni.index);
          }}
        >
          {ni.title}
        </span>
      </li>
    );
  });

  return (<ol key={key} className="nav-list">{array}</ol>);
}

//#endregion

//#region Instruction Pages

export const getPageContent = (index, pages) => {
  return pages[index].content;
}

export const createPageContentArray = (content, setIndex) => {
  let items = [];

  content.forEach((c, i) => {
    switch (c.type) {
      case ContentType.NAV_LIST:
        let navList = createNavItemListDisplay(c, setIndex, `c-nav${i}`);
        items.push(navList);
      default:
      case ContentType.PARAGRAPH:
        items.push(createParagraphContent(c, i));
        break;
    }
  });

  return items;
}

const createParagraphContent = (contentItem, i) => {
  let text = contentItem.text;
  let img = null;
  let textClass = 'p-text';
  let imgClass = 'instruct-img';

  if (contentItem.image !== null) {
    img = getImageByType(contentItem.image);
    switch (contentItem.imageXAlign) {
      case XAlignment.LEFT:
        imgClass += ' left';
        break;
      case XAlignment.RIGHT:
        imgClass += ' right';
        break;
      case XAlignment.CENTER:
        imgClass += ' xCenter';
        break;
      default:
        break;
    }
  }

  if (!img) {
    return (<p key={`c-text${i}`} className={textClass}>{text}</p>);
  } else {

    let inside = <></>;
    switch (contentItem.imageYAlign) {
      case YAlignment.TOP:
        inside = 
          <>
            <img className={imgClass} src={img} />
            <br></br>
            {text}
          </>;
        break;
      case YAlignment.BOTTOM:
        inside = 
          <>
            {text}
            <br></br>
            <img className={imgClass} src={img} />
          </>;
        break;
      case YAlignment.CENTER:
        imgClass += ' yCenter';
        inside = 
        <>
          <img className={imgClass} src={img} />
          {text}
        </>;
        break;
      default:
        break;
    }

    return (<p key={`c-text${i}`} className={textClass} >
      {inside}
    </p>);
  }
}

//#endregion

//#region Getting Images

const getImageByType = (type) => {
  switch (type) {
    default:
      return null;
    case InstructionImageName.SETUP_OPTIONS:
      return SetupOptions;
    case InstructionImageName.ADD_REMOVE_COLORS:
      return AddRemoveColors;
    case InstructionImageName.CHANGE_STRAND_COUNT:
      return ChangeStrandCount;
  }
}

//#endregion

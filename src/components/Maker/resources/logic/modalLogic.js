import { ContentType } from "../constants/instructionConstants";

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
        items.push(<span key={`c-text${i}`}>{c.text}</span>);
        break;
    }
  });

  return items;
}

//#endregion
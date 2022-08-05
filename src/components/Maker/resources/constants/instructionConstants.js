export const ContentType = {
  PARAGRAPH: 'PARAGRAPH',
  NAV_LIST: 'NAV_LIST',
}

export const InstructionImageName = {
  SETUP_OPTIONS: 'SETUP_OPTIONS',
  ADD_REMOVE_COLORS: 'ADD_REMOVE_COLORS',
  CHANGE_STRAND_COUNT: 'CHANGE_STRAND_COUNT',
};

export const XAlignment = {
  LEFT: "LEFT",
  RIGHT: "RIGHT",
  CENTER: "CENTER",
  NONE: "NONE",
}

export const YAlignment = {
  TOP: "LEFT",
  BOTTOM: "RIGHT",
  CENTER: "CENTER",
  NONE: "NONE",
}


export const MainInstructionItems = [
  {
    title: "Navigation",
    isNav: true,
    content: [
      {
        type: ContentType.NAV_LIST,
        navItems: [
          {
            title: "Setup Basics",
            index: 1,
          },
          {
            title: "Changing Colors",
            index: 2,
          },
          {
            title: "Strand Setup",
            index: 3,
          },
        ],
      },
    ],
  },
  {
    title: "Setup Basics",
    isNav: false,
    content: [
      {
        type: ContentType.PARAGRAPH,
        text: "Setting up is simple and easy. Once it is done, you can start designing!",
        image: null,
        imageXAlign: XAlignment.NONE,
        imageYAlign: YAlignment.NONE,
      },
      {
        type: ContentType.PARAGRAPH,
        text: "Two of the options can only be decided during setup: " +
          "how many colors and how many strands will be used in the pattern.",
        image: InstructionImageName.SETUP_OPTIONS,
        imageXAlign: XAlignment.CENTER,
        imageYAlign: YAlignment.TOP,
      },
      {
        type: ContentType.PARAGRAPH,
        text: `Add a new color by using the color selector and then clicking "Add". To remove a color, select the color you wish to remove and click "remove".`,
        image: InstructionImageName.ADD_REMOVE_COLORS,
        imageXAlign: XAlignment.RIGHT,
        imageYAlign: YAlignment.CENTER,
      },
      {
        type: ContentType.PARAGRAPH,
        text: `The number of strands can be changed by selecting an option in the dropdown.`,
        image: InstructionImageName.CHANGE_STRAND_COUNT,
        imageXAlign: XAlignment.CENTER,
        imageYAlign: YAlignment.BOTTOM,
      },
    ],
  },
  {
    title: "Changing Colors",
    isNav: false,
    content: [
      {
        type: ContentType.PARAGRAPH,
        text: "Luckily, color values can be altered at any time and so can the color of specific strands.",
        image: null,
        imageXAlign: XAlignment.NONE,
        imageYAlign: YAlignment.NONE,
      }
    ],
  },
  {
    title: "Setup: Counting Strands",
    isNav: false,
    content: [
      {
        type: ContentType.PARAGRAPH,
        text: "counting strands woo",
      }
    ],
  },
];
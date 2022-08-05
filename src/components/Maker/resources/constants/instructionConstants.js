export const ContentType = {
  PARAGRAPH: 'PARAGRAPH',
  NAV_LIST: 'NAV_LIST',
}

export const InstructionImageName = {
  SETUP_OPTIONS: 'SETUP_OPTIONS',
  ADD_REMOVE_COLORS: 'ADD_REMOVE_COLORS',
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
            title: "Basic Setup",
            index: 1,
          },
          {
            title: "Color Setup",
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
    title: "Setup: Basic",
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
    ],
  },
  {
    title: "Setup: Counting Colors",
    isNav: false,
    content: [
      {
        type: ContentType.PARAGRAPH,
        text: "counting colors woo",
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
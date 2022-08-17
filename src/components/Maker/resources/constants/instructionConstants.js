export const ContentType = {
  PARAGRAPH: 'PARAGRAPH',
  NAV_LIST: 'NAV_LIST',
}

export const InstructionImageName = {
  WELCOME_SCREEN: 'WELCOME_SCREEN',
  LOAD_PREVIOUS: 'LOAD_PREVIOUS',
  LOAD_ERROR: 'LOAD_ERROR',
  SETUP_OPTIONS: 'SETUP_OPTIONS',
  ADD_REMOVE_COLORS: 'ADD_REMOVE_COLORS',
  CHANGE_STRAND_COUNT: 'CHANGE_STRAND_COUNT',
  PRESET_COLORS: 'PRESET_COLORS',
  CHANGE_COLOR: 'CHANGE_COLOR',
  CHANGE_STRAND_COLOR: 'CHANGE_STRAND_COLOR',
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
            title: "Welcome Screen",
            index: 1,
          },
          {
            title: "Load: Previous Patterns",
            index: 2,
          },
          {
            title: "Create: Setup Basics",
            index: 3,
          },
          {
            title: "Changing Colors",
            index: 4,
          },
          {
            title: "Changing Knots",
            index: 5,
          },
        ],
      },
    ],
  },
  {
    title: "Welcome Screen",
    isNav: false,
    content: [
      {
        type: ContentType.PARAGRAPH,
        text: "The welcome screen provides two options: creating a brand new pattern and loading a new one. The load option is not recommended until one is familiar with this tool.",
        image: InstructionImageName.WELCOME_SCREEN,
        imageXAlign: XAlignment.CENTER,
        imageYAlign: YAlignment.TOP,
      }
    ],
  },
  {
    title: "Load: Previous Patterns",
    isNav: false,
    content: [
      {
        type: ContentType.PARAGRAPH,
        text: "If you are new to this tool, it is recommended to skip this past this section until you are familiar with creating a pattern from scratch.",
        image: null,
        imageXAlign: XAlignment.NONE,
        imageYAlign: YAlignment.NONE,
      },
      {
        type: ContentType.PARAGRAPH,
        text: "However, if you have copied and saved a pattern (see the \"Show Code\" section on how to do this), you may load the pattern here in order to continue working on it! Just copy and paste the code and click \"Load Pattern\".",
        image: InstructionImageName.LOAD_PREVIOUS,
        imageXAlign: XAlignment.CENTER,
        imageYAlign: YAlignment.TOP,
      },
      {
        type: ContentType.PARAGRAPH,
        text: "Note: Be sure to enter the code in the same format that was copied. Any mismatch or broken rule will result in an error message.",
        image: InstructionImageName.LOAD_ERROR,
        imageXAlign: XAlignment.CENTER,
        imageYAlign: YAlignment.TOP,
      },
    ],
  },
  {
    title: "Create: Setup Basics",
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
        text: "Luckily, colors can be altered at any time and so can the color of specific strands.",
        image: null,
        imageXAlign: XAlignment.NONE,
        imageYAlign: YAlignment.NONE,
      },
      {
        type: ContentType.PARAGRAPH,
        text: "Note: There is a set of preset colors to make changes easier. Colors can also be changed using the same selector from setup.",
        image: InstructionImageName.PRESET_COLORS,
        imageXAlign: XAlignment.LEFT,
        imageYAlign: YAlignment.CENTER,
      },
      {
        type: ContentType.PARAGRAPH,
        text: "Once a new color is chosen, click the \"Change\" button to change the color of any strand with that color.",
        image: InstructionImageName.CHANGE_COLOR,
        imageXAlign: XAlignment.RIGHT,
        imageYAlign: YAlignment.CENTER,
      },
      {
        type: ContentType.PARAGRAPH,
        text: "Finally, the color of a strand can be changed by selecting the color you want, then clicking the top of that strand.",
        image: InstructionImageName.CHANGE_STRAND_COLOR,
        imageXAlign: XAlignment.LEFT,
        imageYAlign: YAlignment.CENTER,
      },
    ],
  },
  {
    title: "Changing Knots",
    isNav: false,
    content: [
      {
        type: ContentType.PARAGRAPH,
        text: "counting strands woo",
      }
    ],
  },
];
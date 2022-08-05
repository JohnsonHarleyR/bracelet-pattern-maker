export const ContentType = {
  PARAGRAPH: 'PARAGRAPH',
  NAV_LIST: 'NAV_LIST',
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
        text: "basics woo",
      }
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
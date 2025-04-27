export const languages: { [key: string]: string } = {
  en: "English",
  hi: "Hindi",
  mr: "Marathi",
  te: "Telugu",
};

export const crops: { [key: string]: { type: string; name: { [key: string]: string }; image: string } } = {
  papaya: {
    type: "fruit",
    name: {
      en: "Papaya",
      hi: "पपीता",
      mr: "पपई",
      te: "బొప్పాయి",
    },
    image: "https://picsum.photos/100/100",
  },
  tomato: {
    type: "vegetable",
    name: {
      en: "Tomato",
      hi: "टमाटर",
      mr: "टोमॅटो",
      te: "టొమాటో",
    },
    image: "https://picsum.photos/100/100",
  },
  // Add more crops as needed
};

export const soils: { [key: string]: { name: { [key: string]: string }; image: string } } = {
  sandy: {
    name: {
      en: "Sandy Soil",
      hi: "बलुई मिट्टी",
      mr: "वाळुची माती",
      te: "ఇసుక నేల",
    },
    image: "https://picsum.photos/100/100",
  },
  clay: {
    name: {
      en: "Clay Soil",
      hi: "चिकनी मिट्टी",
      mr: "चिकणमाती",
      te: "బంకమట్టి",
    },
    image: "https://picsum.photos/100/100",
  },
  // Add more soil types as needed
};

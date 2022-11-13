export type Item = {
  user: {
    cgg_id: string;
    name: string;
  };
  service: {
    allowServiceSentence: string;
    allowServiceImage: string;
  };
};

export type Result = Item[];

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

export type SearchForm = {
  userId: string;
  onIdChange: (e: ChangeEvent<HTMLInputElement>) => void;
  disabled: boolean;
  onSearch: () => void;
  validMessage: string;
};

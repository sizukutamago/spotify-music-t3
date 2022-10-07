export type SearchItem = {
  uri: string;
  name: string;
  id: string;
  album: {
    uri: string;
    images: {
      height: number;
      url: string;
    }[];
  };
};

import { memo } from 'react';
import { SearchItem } from '../../types/spotify';

type Props = {
  searchItems: SearchItem[];
  setUri: (uri: string) => void;
};

export const SearchList = memo(function SearchList({
  searchItems,
  setUri,
}: Props): JSX.Element {
  return (
    <ul>
      {searchItems.map((searchItem) => (
        <li key={searchItem.id} onClick={() => setUri(searchItem.album.uri)}>
          <img
            src={
              searchItem.album.images.find((image) => image.height === 64)?.url
            }
          />
          <span>{searchItem.name}</span>
        </li>
      ))}
    </ul>
  );
});

import { memo } from 'react';
import { PlayListItem, SearchItem } from '../../types/spotify';

type Props = {
  searchItems: SearchItem[];
  setPlayList: (playList: PlayListItem) => void;
};

export const SearchList = memo(function SearchList({
  searchItems,
  setPlayList,
}: Props): JSX.Element {
  return (
    <ul>
      {searchItems.map((searchItem) => (
        <li
          key={searchItem.id}
          onClick={() => {
            setPlayList({
              uri: searchItem.album.uri,
              imageUrl:
                searchItem.album.images.find((image) => image.height === 64)
                  ?.url ?? '',
              name: searchItem.name,
            });
          }}
        >
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

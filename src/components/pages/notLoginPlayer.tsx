import { SearchList } from '../common/list';
import React, { useEffect, useState } from 'react';
import { trpc } from '../../utils/trpc';
import { PlayListItem } from '../../types/spotify';

export const NotLoginPlayer = ({ roomId }: { roomId: string }) => {
  const [searchText, setSearchText] = useState('');
  const [playList, setPlayList] = useState<PlayListItem>();

  const spotifySearch = trpc.useQuery(
    ['spotify.search', { roomId, searchText }],
    { enabled: searchText !== '' }
  );

  const { data: getPlayList, refetch } = trpc.useQuery([
    'spotify.getPlayList',
    { roomId },
  ]);

  useEffect(() => {
    const timer = setInterval(async () => {
      await refetch();
    }, 3000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  const spotifyAddPlayList = trpc.useMutation('spotify.addPlayList');
  useEffect(() => {
    if (!playList) {
      return;
    }

    spotifyAddPlayList.mutate(
      {
        roomId,
        uri: playList.uri,
        imageUrl: playList.imageUrl,
        name: playList.name,
      },
      {
        onSuccess: async () => {
          await refetch();
        },
      }
    );
  }, [playList]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.nativeEvent.isComposing || event.key !== 'Enter') return;
    setSearchText((event.target as HTMLInputElement).value);
  };

  return (
    <div>
      <div className='flex'>
        <div className='bg-green-200 w-1/2'>
          <input
            className='border-2 border-b-black'
            onKeyDown={handleKeyDown}
            name='search'
          />
          <SearchList
            searchItems={spotifySearch?.data?.tracks?.items ?? []}
            setPlayList={setPlayList}
          />
        </div>
        <div className='w-1/2 bg-amber-300'>
          <ul>
            {getPlayList?.map((music) => {
              return (
                <li key={music.id}>
                  <img src={music.image_url} />
                  {music.name}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};

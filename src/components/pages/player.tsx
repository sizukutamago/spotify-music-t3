import React, { FC, memo, useEffect, useState } from 'react';
import {
  usePlayerDevice,
  useSpotifyPlayer,
} from 'react-spotify-web-playback-sdk';
import { trpc } from '../../utils/trpc';
import { SearchList } from '../common/list';
import { PlayListItem } from '../../types/spotify';

export const Player: FC<{ accessToken: string; roomId: string }> =
  function Player({ accessToken, roomId }) {
    const [searchText, setSearchText] = useState('');
    const [playList, setPlayList] = useState<PlayListItem>();
    const [firstPlay, setFirstPlay] = useState<boolean>(false);
    const [playing, setPlaying] = useState<boolean>(false);
    const [playingName, setPlayingName] = useState('');

    const player = useSpotifyPlayer();
    const device = usePlayerDevice();
    const deviceId = device?.device_id;

    useEffect(() => {
      const timer = setInterval(async () => {
        const state = await player?.getCurrentState();
        if (!state) {
          return;
        }

        console.log(state.context?.metadata?.current_item.name);
        console.log({ playingName });

        if (
          state.context?.metadata?.current_item.name !== playingName &&
          firstPlay
        ) {
          if (!getPlayList || getPlayList.length === 0 || !deviceId) {
            return;
          }

          const nextPlayList = getPlayList[0];
          spotifyPlay.mutate({
            id: nextPlayList?.id ?? '',
            roomId,
            deviceId,
            uri: nextPlayList?.uri ?? '',
          });
          setPlayingName(() => {
            return nextPlayList?.name ?? '';
          });
        }
      }, 3000);

      return () => {
        clearTimeout(timer);
      };
    }, []);

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

    const spotifyPlay = trpc.useMutation('spotify.play');
    useEffect(() => {
      // 初回再生
      if (!getPlayList || getPlayList.length === 0 || !deviceId || firstPlay) {
        return;
      }

      const playListItem = getPlayList[0];
      spotifyPlay.mutate(
        {
          id: playListItem?.id ?? '',
          roomId,
          deviceId,
          uri: playListItem?.uri ?? '',
        },
        {
          onSuccess: async () => {
            await refetch();
            setFirstPlay(true);
            setPlaying(true);
            setPlayingName(playListItem?.name ?? '');
          },
        }
      );
    }, [getPlayList, deviceId]);

    // todo: 未ログインユーザの場合曲の追加だけできる ←次これ
    const spotifyAddPlayList = trpc.useMutation('spotify.addPlayList');
    useEffect(() => {
      if (!deviceId || !playList) {
        return;
      }

      spotifyAddPlayList.mutate({
        roomId,
        uri: playList.uri,
        imageUrl: playList.imageUrl,
        name: playList.name,
      });
    }, [deviceId, playList]);

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.nativeEvent.isComposing || event.key !== 'Enter') return;
      search((event.target as HTMLInputElement).value);
    };

    const search = (searchText: string) => {
      setSearchText(searchText);
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
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
        <div className='w-full content-center'>
          {playing ? (
            <span
              onClick={() => {
                player?.pause();
                setPlaying(false);
              }}
            >
              ■
            </span>
          ) : (
            <span
              onClick={() => {
                player?.togglePlay();
                setPlaying(true);
              }}
            >
              ▶︎
            </span>
          )}
          <input
            type='range'
            min={0}
            max={100}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              player?.setVolume(0.01 * Number(event.target.value));
            }}
          />
        </div>
      </div>
    );
  };

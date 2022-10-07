import { FC, memo, useEffect, useState } from 'react';
import {
  usePlayerDevice,
  useSpotifyPlayer,
  useWebPlaybackSDKReady,
} from 'react-spotify-web-playback-sdk';
import { trpc } from '../../utils/trpc';
import { SearchList } from '../common/list';

export const Player: FC<{ accessToken: string; roomId: string }> = memo(
  function Player({ accessToken, roomId }) {
    const [searchText, setSearchText] = useState('');
    const [uri, setUri] = useState('');

    const ready = useWebPlaybackSDKReady();
    const player = useSpotifyPlayer();
    const device = usePlayerDevice();
    const deviceId = device?.device_id;

    player?.getCurrentState().then((res) => console.log(res));

    const spotifySearch = trpc.useQuery(
      ['spotify.search', { roomId, searchText }],
      { enabled: searchText !== '' }
    );

    // todo: 未ログインユーザの場合曲の追加だけできる　曲が流れていない時はルーム主の端末で再生が始まる 流れている時はキューに追加(DBに追加 ←次これ)
    // todo: 曲が終わったら次の曲を再生する durationが再生時間 positionが今の再生時間
    const spotifyPlay = trpc.useMutation('spotify.play');

    useEffect(() => {
      if (!deviceId || !uri) {
        return;
      }

      spotifyPlay.mutate({
        roomId,
        deviceId,
        uri,
      });
    }, [deviceId, uri]);

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.nativeEvent.isComposing || event.key !== 'Enter') return;
      search((event.target as HTMLInputElement).value);
    };

    const search = (searchText: string) => {
      setSearchText(searchText);
    };

    return (
      <div>
        <input
          className='border-2 border-b-black'
          onKeyDown={handleKeyDown}
          name='search'
        />
        <SearchList
          searchItems={spotifySearch?.data?.tracks?.items ?? []}
          setUri={setUri}
        />
      </div>
    );
  }
);

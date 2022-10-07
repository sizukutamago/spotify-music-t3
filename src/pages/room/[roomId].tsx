import { trpc } from '../../utils/trpc';
import Layout from '../../components/layout';
import { FC, useCallback, useEffect, useState } from 'react';
import { WebPlaybackSDK } from 'react-spotify-web-playback-sdk';
import { Player } from '../../components/pages/player';
import { useRouter } from 'next/router';

const RoomId: FC = () => {
  const [accessToken, setAccessToken] = useState<string>('');

  const getUser = trpc.useQuery(['user.getUser']);

  const router = useRouter();
  const roomId = router.query.roomId as string;

  useEffect(() => {
    const { data: userData } = getUser;

    const spotifyAccount = userData?.accounts.find(
      (account) => account.provider === 'spotify'
    );

    setAccessToken(spotifyAccount?.access_token ?? '');
  }, [getUser]);

  const getOAuthToken: Spotify.PlayerInit['getOAuthToken'] = useCallback(
    (callback) => callback(accessToken),
    [accessToken]
  );

  return (
    <Layout>
      <WebPlaybackSDK
        initialDeviceName='spotify-music'
        getOAuthToken={getOAuthToken}
      >
        <Player accessToken={accessToken} roomId={roomId} />
      </WebPlaybackSDK>
    </Layout>
  );
};

export default RoomId;

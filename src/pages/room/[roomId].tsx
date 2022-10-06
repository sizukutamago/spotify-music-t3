import { trpc } from '../../utils/trpc';
import Layout from '../../components/layout';
import { FC, useCallback, useEffect, useState } from 'react';
import { WebPlaybackSDK } from 'react-spotify-web-playback-sdk';
import { signIn, useSession } from 'next-auth/react';
import { Player } from '../../components/pages/player';

const RoomId: FC = () => {
  const [accessToken, setAccessToken] = useState<string>('');

  const { data: session } = useSession();
  const getUser = trpc.useQuery(['user.getUser']);

  useEffect(() => {
    const { data: userData } = getUser;

    if (session?.error === 'refreshAccessTokenError') {
      signIn();
      return;
    }

    const spotifyAccount = userData?.accounts.find(
      (account) => account.provider === 'spotify'
    );

    setAccessToken(spotifyAccount?.access_token ?? '');
  }, [getUser, session]);

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
        <Player accessToken={accessToken} />
      </WebPlaybackSDK>
    </Layout>
  );
};

export default RoomId;

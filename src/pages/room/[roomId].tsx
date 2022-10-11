// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { trpc } from '../../utils/trpc';
import Layout from '../../components/layout';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { WebPlaybackSDK } from 'react-spotify-web-playback-sdk';
import { Player } from '../../components/pages/player';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { NotLoginPlayer } from '../../components/pages/notLoginPlayer';

const RoomId: FC = () => {
  const [accessToken, setAccessToken] = useState<string>('');

  const getUser = trpc.useQuery(['user.getUser']);

  const router = useRouter();
  const roomId = router.query.roomId as string;

  const session = useSession();

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

  if (session.data?.user) {
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
  } else {
    return <NotLoginPlayer roomId={roomId} />;
  }
};

export default RoomId;

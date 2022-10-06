import { FC, memo } from 'react';
import {
  useSpotifyPlayer,
  useWebPlaybackSDKReady,
} from 'react-spotify-web-playback-sdk';

export const Player: FC<{ accessToken: string }> = memo(function Player({
  accessToken,
}) {
  const ready = useWebPlaybackSDKReady();
  const player = useSpotifyPlayer();

  console.log(player?.connect().then((res) => console.log({ res })));

  return ready ? <p>ready</p> : <p>loading</p>;
});

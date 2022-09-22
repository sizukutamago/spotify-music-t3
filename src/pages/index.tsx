import type { NextPage } from 'next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import { signIn, signOut, useSession } from 'next-auth/react';

const Index: NextPage = () => {
  const { data: session } = useSession();

  type ButtonType = {
    type: 'login' | 'logout';
    onClickFn(): void;
  };

  const Button = (props: ButtonType) => {
    return (
      <button
        className='font-bold lg:text-xl rounded-lg bg-white p-2.5'
        onClick={props.onClickFn}
      >
        {props.type === 'login' ? 'ログイン' : 'ログアウト'}
      </button>
    );
  };

  const LoginButton = () => (
    <Button
      type='login'
      onClickFn={() => {
        signIn('spotify');
      }}
    />
  );

  const LogoutButton = () => (
    <Button
      type='logout'
      onClickFn={() => {
        signOut();
      }}
    />
  );

  return (
    <div className='h-screen'>
      <header className='h-24 bg-green-200'>
        <div className='flex h-full justify-between items-center m-auto w-11/12'>
          <div className='flex items-center'>
            <FontAwesomeIcon icon={faPlay} className='text-4xl pr-1 block' />
            <span className='font-extrabold text-4xl'>music(仮)</span>
          </div>

          {!session ? <LoginButton /> : <LogoutButton />}
        </div>
      </header>
      <section className='h-[calc(100vh-6rem)] m-auto'>
        <div className='h-full grid content-center justify-items-center bg-hero bg-center bg-cover'>
          <h1 className='mb-32 font-bold lg:text-6xl text-2xl'>
            みんなで曲をシェアしよう
          </h1>
          <p className='mb-16 font-light lg:text-2xl text-xl'>
            spotifyにログインして新しい部屋を作る
          </p>
          <LoginButton />
        </div>
      </section>
    </div>
  );
};

export default Index;

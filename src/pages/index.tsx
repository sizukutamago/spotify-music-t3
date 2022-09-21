import type { NextPage } from 'next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay } from '@fortawesome/free-solid-svg-icons';

const Index: NextPage = () => {
  return (
    <div className='h-screen'>
      <header className='h-24 bg-green-200'>
        <div className='flex h-full justify-between items-center m-auto w-11/12'>
          <div className='flex items-center'>
            <FontAwesomeIcon icon={faPlay} className='text-4xl pr-1 block' />
            <span className='font-extrabold text-4xl'>music(仮)</span>
          </div>

          <button className='text-xl rounded-lg bg-white p-2.5'>
            ログイン
          </button>
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
          <a
            href='#'
            className='font-bold lg:text-xl text-xl rounded-lg bg-white p-2.5'
          >
            ログイン
          </a>
        </div>
      </section>
    </div>
  );
};

export default Index;

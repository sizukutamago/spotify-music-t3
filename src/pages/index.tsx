import type { NextPage } from 'next';
import Layout from '../components/layout';
import { LoginButton } from '../components/buttons/button';

const Index: NextPage = () => {
  return (
    <Layout>
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
    </Layout>
  );
};

export default Index;

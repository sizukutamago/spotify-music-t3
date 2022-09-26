import { NextPage } from 'next';
import Layout from '../components/layout';
import { trpc } from '../utils/trpc';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

const Room: NextPage = () => {
  const { data: session } = useSession({
    required: true,
  });
  const router = useRouter();

  const createRoomApi = trpc.useMutation('room.createRoom', {
    onSuccess: (data) => {
      if (!data) {
        return;
      }
      router.push(`room/${data.id}`);
    },
  });

  const createRoom = () => {
    createRoomApi.mutate({
      userId: session?.user?.id as string,
    });
  };

  return (
    <Layout>
      <div>部屋を作る</div>
      <button onClick={createRoom}>作成</button>
    </Layout>
  );
};

export default Room;

import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { trpc } from '../../utils/trpc';
import Layout from '../../components/layout';

const RoomId: NextPage = () => {
  const router = useRouter();
  const roomId = router.query.roomId as string;

  const { data: room } = trpc.useQuery(['room.getRoomById', { roomId }]);
  console.log(room);
  return (
    <Layout>
      <div>room {roomId}</div>
    </Layout>
  );
};

export default RoomId;

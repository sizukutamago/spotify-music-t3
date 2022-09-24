import { useSession } from 'next-auth/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import { ReactNode } from 'react';
import { LoginButton, LogoutButton } from './buttons/button';

type ChildrenProps = {
  children: ReactNode;
};

const Layout = ({ children }: ChildrenProps) => {
  const { data: session } = useSession();

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
      {children}
    </div>
  );
};

export default Layout;

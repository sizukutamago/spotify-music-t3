import { signIn, signOut } from 'next-auth/react';

type ButtonType = {
  type: 'login' | 'logout';
  onClick(): void;
};

export const Button = ({ type, onClick }: ButtonType) => {
  return (
    <button
      className='font-bold lg:text-xl rounded-lg bg-white p-2.5'
      onClick={onClick}
    >
      {type === 'login' ? 'ログイン' : 'ログアウト'}
    </button>
  );
};

export const LoginButton = () => (
  <Button
    type='login'
    onClick={() => {
      console.log(signIn('spotify'));
    }}
  />
);

export const LogoutButton = () => (
  <Button
    type='logout'
    onClick={() => {
      signOut();
    }}
  />
);

import { useHistory } from 'react-router-dom';
import illustrationImg from '../assets/images/illustration.svg';
import logoImg from '../assets/images/logo.svg';
import ggogleIconImg from '../assets/images/google-icon.svg';
import '../styles/auth.scss';
import { Button } from '../components/Button/Button';
import { useAuth } from '../hooks/useAuth';
import { FormEvent, useState } from 'react';
import { firebase } from '../services/firebase';
import toast, { Toaster } from 'react-hot-toast';

export function Home() {
  const history = useHistory();
  const { signInWithGoogle, user } = useAuth();
  const [roomCode, setRoomCode] = useState('');
  async function handleCreateRoom() {
    if (!user) {
      await signInWithGoogle();
    }
    history.push('/rooms/new');
  }

  async function handleJoinRoom(event: FormEvent) {
    event.preventDefault();
    if (roomCode.trim() === '') {
      return;
    }
    const roomRef = await firebase.database().ref(`rooms/${roomCode}`).get();

    if (!roomRef.exists()) {
      toast.error('Room does not exist', {
        duration: 1000,
        position: 'top-center',
      });
      return;
    }
    if (roomRef.val().endedAt) {
      alert('Romm alread closed');
    }
    history.push(`/rooms/${roomCode}`);
  }

  return (
    <div id={'page-auth'}>
      <aside>
        <img
          src={illustrationImg}
          alt={'Ilustração simbolizando perguntas e respostas'}
        />
        <strong>Crie salas de Q&amp;A ao-vivo</strong>
        <p>Tire as dúvidas da sua audiência am tempo-real</p>
      </aside>
      <main>
        <div className={'main-content'}>
          <img src={logoImg} alt={'Letmeask'} />
          <button className={'create-room'} onClick={handleCreateRoom}>
            <img src={ggogleIconImg} alt={'logo do Google'} />
            Crie sua sala com o Google
          </button>
          <div className={'separator'}>ou entre em uma sala</div>
          <form onSubmit={handleJoinRoom}>
            <Toaster />
            <input
              type={'text'}
              value={roomCode}
              placeholder={'Digite o código da sala'}
              onChange={(event) => setRoomCode(event.target.value)}
            />
            <Button>Entrar na sala</Button>
          </form>
        </div>
      </main>
    </div>
  );
}

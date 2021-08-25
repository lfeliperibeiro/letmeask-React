import logoImg from '../assets/images/logo.svg';
import { Button } from '../components/Button';
import '../styles/room.scss';
import { RoomCode } from '../components/RoomCode';
import { useParams } from 'react-router-dom';
import { FormEvent, useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { firebase } from '../services/firebase';

type FirebaseQuestions = Record<
  string,
  {
    author: {
      name: string;
      avatar: string;
    };
    content: string;
    isAnswered: boolean;
    isHighlighted: boolean;
  }
>;

type RommParams = {
  id: string;
};

type Question = {
  id: string;
  author: {
    name: string;
    avatar: string;
  };
  content: string;
  isAnswered: boolean;
  isHighlighted: boolean;
};

export function Room() {
  const { user } = useAuth();
  const [newQuestion, setNewQuestion] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [title, setTitle] = useState('');
  const params = useParams<RommParams>();
  const roomId = params.id;

  useEffect(() => {
    const roomRef = firebase.database().ref(`rooms/${roomId}`);
    roomRef.on('value', (room) => {
      const databaseRoom = room.val();
      const firebaseQuestions: FirebaseQuestions = databaseRoom.questions ?? {};
      const parsedQuestion = Object.entries(firebaseQuestions).map(
        ([key, value]) => {
          return {
            id: key,
            content: value.content,
            author: value.author,
            isHighlighted: value.isHighlighted,
            isAnswered: value.isAnswered,
          };
        },
      );
      setTitle(databaseRoom.title);
      setQuestions(parsedQuestion);
    });
  }, [roomId]);

  async function handleSendQuestion(event: FormEvent) {
    event.preventDefault();
    if (newQuestion.trim() === '') {
      return;
    }
    if (!user) {
      throw new Error('You must be logged in');
    }
    const question = {
      context: newQuestion,
      author: {
        name: user.name,
        avatar: user.avatar,
      },
      isHighlighted: false,
      isAnswered: false,
    };

    await firebase.database().ref(`rooms/${roomId}/questions`).push(question);
    setNewQuestion('');
  }

  return (
    <div id={'page-room'}>
      <header>
        <div className={'content'}>
          <img src={logoImg} alt={'Letmeask'} />
          <RoomCode code={roomId} />
        </div>
      </header>
      <main>
        <div className={'room-title'}>
          <h1>Sala {title}</h1>
          {questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
        </div>
        <form onSubmit={handleSendQuestion}>
          <textarea
            placeholder={'O que você quer perguntar?'}
            value={newQuestion}
            onChange={(event) => setNewQuestion(event.target.value)}
          />
          <div className={'form-footer'}>
            {user ? (
              <div className={'user-info'}>
                <img src={user.avatar} alt={user.name} />
                <span>{user.name}</span>
              </div>
            ) : (
              <span>
                Para enviar uma pergunta, <button>faça seu login</button>
              </span>
            )}
            <Button type={'submit'} disabled={!user}>
              Enviar pergunta
            </Button>
          </div>
        </form>
        {JSON.stringify(questions)}
      </main>
    </div>
  );
}
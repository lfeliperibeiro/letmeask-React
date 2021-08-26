import logoImg from '../../assets/images/logo.svg';
import { Button } from '../../components/Button/Button';
import './styles.scss';
import { RoomCode } from '../../components/RoomCode/RoomCode';
import { useHistory, useParams } from 'react-router-dom';
import { Question } from '../../components/Question/Question';
import { useRoom } from '../../hooks/useRoom';
import DeleteImg from '../../assets/images/delete.svg';
import { firebase } from '../../services/firebase';

type RoomParams = {
  id: string;
};

export function AdminRoom() {
  // const { user } = useAuth();
  const history = useHistory();

  const params = useParams<RoomParams>();
  const roomId = params.id;
  const { questions, title } = useRoom(roomId);

  async function handleEndRoom() {
    await firebase.database().ref(`rooms/${roomId}`).update({
      endedAt: new Date(),
    });
    history.push('/');
  }

  async function handleDeleteQuestion(questionId: string) {
    // todo: colocar um modal
    if (window.confirm('Tem certeza que deseja excluir esta pergunta?')) {
      await firebase
        .database()
        .ref(`rooms/${roomId}/questions/${questionId}`)
        .remove();
    }
  }

  return (
    <div id={'page-room'}>
      <header>
        <div className={'content'}>
          <img src={logoImg} alt={'Letmeask'} />
          <div>
            <RoomCode code={roomId} />
            <Button isOutlined onClick={handleEndRoom}>
              Encerar Sala
            </Button>
          </div>
        </div>
      </header>
      <main>
        <div className={'room-title'}>
          <h1>Sala {title}</h1>
          {questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
        </div>

        <div className={'question-list'}>
          {questions.map((question) => {
            return (
              <Question
                key={question.id}
                context={question.context}
                author={question.author}
              >
                <button
                  type="button"
                  onClick={() => handleDeleteQuestion(question.id)}
                >
                  <img src={DeleteImg} alt={'remover pergunta'} />
                </button>
              </Question>
            );
          })}
        </div>
      </main>
    </div>
  );
}

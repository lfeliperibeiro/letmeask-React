import logoImg from '../../assets/images/logo.svg';
import { Button } from '../../components/Button/Button';
import './styles.scss';
import { RoomCode } from '../../components/RoomCode/RoomCode';
import { useHistory, useParams } from 'react-router-dom';
import { Question } from '../../components/Question/Question';
import { useRoom } from '../../hooks/useRoom';
import DeleteImg from '../../assets/images/delete.svg';
import { firebase } from '../../services/firebase';
import CheckImg from '../../assets/images/check.svg';
import AnswerImg from '../../assets/images/answer.svg';
import { useState } from 'react';
import { ModalConfirmation } from '../../components/ModalConfirmation/ModalConfirmation';
import DeleteConfirmationImg from '../../assets/images/deleteConfimation.svg';

type RoomParams = {
  id: string;
};

export function AdminRoom() {
  // const { user } = useAuth();
  const history = useHistory();

  const params = useParams<RoomParams>();
  const roomId = params.id;
  const { questions, title } = useRoom(roomId);

  const [modalIsOpen, setIsOpen] = useState(false);

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  async function handleEndRoom() {
    await firebase.database().ref(`rooms/${roomId}`).update({
      endedAt: new Date(),
    });
    history.push('/');
  }

  async function handleDeleteQuestion(questionId: string) {
    await firebase
      .database()
      .ref(`rooms/${roomId}/questions/${questionId}`)
      .remove();
  }

  async function handleCheckQuestionAsAnswered(questionId: string) {
    await firebase
      .database()
      .ref(`rooms/${roomId}/questions/${questionId}`)
      .update({
        isAnswered: true,
      });
  }

  async function handleHighlightQuestion(questionId: string) {
    await firebase
      .database()
      .ref(`rooms/${roomId}/questions/${questionId}`)
      .update({
        isHighlighted: true,
      });
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
                isAnswered={question.isAnswered}
                isHighlighted={question.isHighlighted}
              >
                {!question.isAnswered && (
                  <>
                    <button
                      type="button"
                      onClick={() => handleCheckQuestionAsAnswered(question.id)}
                    >
                      <img
                        src={CheckImg}
                        alt={'marcar pergunta como respondida'}
                      />
                    </button>{' '}
                    <button
                      type="button"
                      onClick={() => handleHighlightQuestion(question.id)}
                    >
                      <img
                        src={AnswerImg}
                        alt={'dar destaque a pergunta repondida'}
                      />
                    </button>
                  </>
                )}
                <button type="button" onClick={openModal}>
                  <img src={DeleteImg} alt={'remover pergunta'} />
                </button>
                <ModalConfirmation
                  image={DeleteConfirmationImg}
                  openModal={openModal}
                  closeModal={closeModal}
                  modalIsOpen={modalIsOpen}
                  confirmation={() => handleDeleteQuestion(question.id)}
                />
              </Question>
            );
          })}
        </div>
      </main>
    </div>
  );
}

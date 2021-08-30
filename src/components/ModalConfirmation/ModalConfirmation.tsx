import Modal from 'react-modal';
import './styles.scss';
import { Button } from '../Button/Button';

interface ModalConfirmationProps {
  openModal: () => void;
  closeModal: () => void;
  modalIsOpen: boolean;
  questionId?: string | undefined;
  image: string;
  confirmation(questionId: string | undefined): Promise<void>;
  endRoom?: () => void;
}

export function ModalConfirmation(props: ModalConfirmationProps) {
  return (
    <div>
      <Modal
        isOpen={props.modalIsOpen}
        onRequestClose={props.closeModal}
        className={'modal'}
        overlayClassName={'overlay'}
      >
        <div className={'container'}>
          <img src={props.image} alt={props.image} />
          <h1>Excluir pergunta</h1>

          <p>Tem certeza que você deseja excluir esta pergunta?</p>
          <div>
            <Button type={'button'} onClick={props.closeModal} isCanceled>
              Cancelar
            </Button>
            <Button
              type={'button'}
              onClick={() => props.confirmation(props.questionId)}
              isDeleted
            >
              Sim, excluir
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

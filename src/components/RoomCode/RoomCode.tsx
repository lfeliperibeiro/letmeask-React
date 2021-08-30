import copyImg from '../../assets/images/copy.svg';
import './styles.scss';
import toast, { Toaster } from 'react-hot-toast';

type RoomCodeProps = {
  code: string;
};

export function RoomCode(props: RoomCodeProps) {
  function copyRoomCodeToClipboard() {
    navigator.clipboard.writeText(props.code);
    toast.success('copied');
  }
  return (
    <>
      <Toaster />
      <button className={'room-code'} onClick={copyRoomCodeToClipboard}>
        <div>
          <img src={copyImg} alt={'Copy room code'} />
        </div>
        <span>Sala #{props.code}</span>
      </button>
    </>
  );
}

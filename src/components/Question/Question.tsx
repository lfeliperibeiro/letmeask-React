import './styles.scss';
import { ReactNode } from 'react';

type QuestionProps = {
  context: string;
  author: {
    name: string;
    avatar: string;
  };
  children?: ReactNode;
};

export function Question({ context, author, children }: QuestionProps) {
  return (
    <div className={'question'}>
      <p>{context}</p>
      <footer>
        <div className={'user-info'}>
          <img src={author.avatar} alt={author.name} />
          <span>{author.name}</span>
        </div>
        <div>{children}</div>
      </footer>
    </div>
  );
}
import { ButtonHTMLAttributes } from 'react';
import './styles.scss';
import cx from 'classnames';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  isOutlined?: boolean;
};

export function Button({ isOutlined = false, ...props }: ButtonProps) {
  return (
    <button className={cx('button', { outlined: isOutlined })} {...props} />
  );
}

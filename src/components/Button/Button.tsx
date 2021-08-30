import { ButtonHTMLAttributes } from 'react';
import './styles.scss';
import cx from 'classnames';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  isOutlined?: boolean;
  isDeleted?: boolean;
  isCanceled?: boolean;
};

export function Button({
  isOutlined = false,
  isCanceled = false,
  isDeleted = false,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cx('button', {
        outlined: isOutlined,
        cancel: isCanceled,
        delete: isDeleted,
      })}
      {...props}
    />
  );
}

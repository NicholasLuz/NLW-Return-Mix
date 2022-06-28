import {  ReactNode } from 'react';
import { useAuth } from '../../hooks/useAuth';
import cx from 'classnames';

import './styles.css';

type FeedbackCardProps = {
  comment: string;
  screenshot: string;
  type: string;
  children?: ReactNode;
}

export function FeedbackCard({
    comment,
    screenshot,
    type,
    children,
}: FeedbackCardProps) {

  const { user } = useAuth();

    return (
      <div className={cx(
        'feedback',
        {bug: type === 'BUG'},
        {idea: type === 'IDEA'},
        {other: type === 'OTHER'}
        )}>
        <div className='comment'>{comment}</div>
        <img src={screenshot} alt="Feedback image" />
        <footer className='card-footer'>
            <div className="user-info">
                <img src={user?.avatar} alt={user?.name} referrerPolicy="origin"/>
                <span>{user?.name}</span>
            </div>
            <div>
              {children}
            </div>
        </footer>
      </div>
    );
}
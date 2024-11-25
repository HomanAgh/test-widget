'use client';

import React from 'react';

interface ErrorMessageProps {
  error: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ error }) => {
  return <p style={{ color: 'red' }}>{error}</p>;
};

export default ErrorMessage;
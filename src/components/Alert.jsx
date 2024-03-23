import React, { useEffect } from 'react';

const Alert = ({ msg, type, removeAlert }) => {
  useEffect(() => {
    const timeOut = setTimeout(() => {
      removeAlert();
    }, 1000);

    return () => clearTimeout(timeOut);
  });

  return (
    <div className="wa__alert">
      <p className={`wa__alert wa__alert-${type}`}>{msg}</p>
    </div>
  );
};

export default Alert;

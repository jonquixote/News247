import React from 'react';

const TextBlock = ({ content }) => {
  return (
    <div className="text-block">
      {content.split('\n').map((paragraph, index) => (
        <p key={index}>{paragraph}</p>
      ))}
    </div>
  );
};

export default TextBlock;
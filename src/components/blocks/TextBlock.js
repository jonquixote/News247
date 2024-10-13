import React from 'react';

const TextBlock = ({ content }) => {
  console.log('TextBlock received content:', content);

  const renderContent = () => {
    if (content === null || content === undefined) {
      console.warn('TextBlock received null or undefined content');
      return <p>No content available</p>;
    }

    if (typeof content !== 'string') {
      console.warn('TextBlock received non-string content:', typeof content);
      return <p>{JSON.stringify(content)}</p>;
    }

    return content.split('\n').map((paragraph, index) => (
      <p key={index}>{paragraph}</p>
    ));
  };

  return (
    <div className="text-block">
      {renderContent()}
    </div>
  );
};

export default TextBlock;

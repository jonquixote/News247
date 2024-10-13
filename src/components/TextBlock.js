import React from 'react';

const TextBlock = ({ content }) => {
  console.log('TextBlock received content:', content);

  const renderContent = () => {
    try {
      if (content === null || content === undefined) {
        console.warn('TextBlock received null or undefined content');
        return <p>No content available</p>;
      }

      if (typeof content !== 'string') {
        console.warn('TextBlock received non-string content:', typeof content);
        return <p>{JSON.stringify(content)}</p>;
      }

      return content.split('\n').map((paragraph, index) => (
        <p key={index} className="mb-2">
          {paragraph}
        </p>
      ));
    } catch (error) {
      console.error('Error in TextBlock:', error);
      return <p>Error rendering content</p>;
    }
  };

  return (
    <div className="mb-4">
      {renderContent()}
    </div>
  );
};

export default TextBlock;
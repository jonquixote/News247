import React from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';

const DragAndDropArticleBlocks = ({ article, renderBlockContent }) => {
  return (
    <Droppable droppableId="article-blocks">
      {(provided) => (
        <div
          {...provided.droppableProps}
          ref={provided.innerRef}
          className="min-h-[100px] border border-gray-300 p-4 rounded bg-gray-100"
        >
          {article.content.map((block, index) => (
            <Draggable key={block.id} draggableId={block.id} index={index}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                  className="bg-white border border-gray-200 p-4 mb-2 rounded shadow-sm"
                >
                  {renderBlockContent(block)}
                  {/* Add delete button or other controls here */}
                </div>
              )}
            </Draggable>
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};

export default DragAndDropArticleBlocks;
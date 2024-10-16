import React, { useState, useEffect } from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { X, GripVertical } from 'lucide-react'; // Import icons
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../ui/dialog";
import { Button } from "../ui/button";

const DragAndDropArticleBlocks = ({ article, renderBlockContent, updateBlock, onDeleteBlock }) => {
  const [blocks, setBlocks] = useState([]);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    // Ensure each block has a draggableId
    const blocksWithIds = article.content.map((block, index) => ({
      ...block,
      id: block.id || `block-${index}`,
    }));
    setBlocks(blocksWithIds);
  }, [article.content]);

  const handleDeleteClick = (index) => {
    console.log('Delete clicked for index:', index);
    setDeleteIndex(index);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deleteIndex !== null) {
      onDeleteBlock(deleteIndex);
      setDeleteIndex(null);
    }
    setIsDeleteModalOpen(false);
  };

  const handleCancelDelete = () => {
    setDeleteIndex(null);
    setIsDeleteModalOpen(false);
  };

  return (
    <>
      <Droppable droppableId="article-blocks">
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="min-h-[100px] border border-gray-300 p-4 rounded bg-gray-100"
          >
            {blocks.map((block, index) => (
              <Draggable key={block.id} draggableId={block.id} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    className="bg-white border border-gray-200 p-4 mb-2 rounded shadow-sm relative"
                  >
                    <button
                      onClick={() => handleDeleteClick(index)}
                      className="absolute top-2 right-2 text-gray-500 hover:text-red-500 p-1"
                      title="Delete block"
                    >
                      <X size={20} />
                    </button>
                    <div className="mt-6">
                      {renderBlockContent(block, index)}
                    </div>
                    <div
                      {...provided.dragHandleProps}
                      className="mt-2 pt-2 border-t border-gray-200 text-gray-400 flex justify-center cursor-move"
                      title="Drag to reorder"
                    >
                      <GripVertical size={20} />
                    </div>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>

      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
            <p className="mb-4">Are you sure you want to delete this block? This action cannot be undone.</p>
            <div className="flex justify-end space-x-2">
              <button
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                onClick={handleCancelDelete}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                onClick={handleConfirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DragAndDropArticleBlocks;

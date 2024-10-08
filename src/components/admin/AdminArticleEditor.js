import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import ArticleRenderer from '../ArticleRender';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import Input from '../ui/input';
import { GripVertical, X } from 'lucide-react';

const BlockTypes = {
  TEXT: 'text',
  IMAGE: 'image',
  VIDEO: 'video',
  TWEET: 'tweet'
};

const AdminArticleEditor = () => {
  const [article, setArticle] = useState({
    title: '',
    tagline: '',
    mainImage: '',
    author: '',
    date: '',
    content: []
  });

  const addBlock = (type) => {
    let newBlock;
    switch (type) {
      case BlockTypes.TWEET:
        const tweetInput = prompt("Enter the Tweet ID or Tweet URL:");
        if (tweetInput) {
          let tweetId;
          if (tweetInput.includes('twitter.com') || tweetInput.includes('x.com')) {
            // Extract tweet ID from URL using regex
            const match = tweetInput.match(/\/status\/(\d+)/);
            tweetId = match ? match[1] : null;
          } else {
            // Assume the input is already a tweet ID
            tweetId = tweetInput;
          }
          if (tweetId) {
            newBlock = { id: Date.now().toString(), type, content: tweetId };
          } else {
            alert("Invalid Tweet ID or URL");
            return;
          }
        } else {
          return; // User cancelled the prompt
        }
        break;
      case BlockTypes.TEXT:
      case BlockTypes.IMAGE:
      case BlockTypes.VIDEO:
        newBlock = { id: Date.now().toString(), type, content: '' };
        break;
      default:
        console.error("Unknown block type:", type);
        return;
    }
    setArticle(prev => ({
      ...prev,
      content: [...prev.content, newBlock]
    }));
  };

  const updateBlock = (id, updates) => {
    setArticle(prev => ({
      ...prev,
      content: prev.content.map(block =>
        block.id === id ? { ...block, ...updates } : block
      )
    }));
  };

  const removeBlock = (id) => {
    setArticle(prev => ({
      ...prev,
      content: prev.content.filter(block => block.id !== id)
    }));
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(article.content);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setArticle(prev => ({ ...prev, content: items }));
  };

  const handleFileUpload = (id, event, isMainImage = false) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (isMainImage) {
          setArticle(prev => ({ ...prev, mainImage: reader.result }));
        } else {
          updateBlock(id, { content: reader.result });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const renderBlockContent = (block) => {
    switch (block.type) {
      case BlockTypes.TEXT:
        return (
          <textarea
            value={block.content}
            onChange={(e) => updateBlock(block.id, { content: e.target.value })}
            placeholder="Enter text content"
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="4"
          />
        );
      case BlockTypes.IMAGE:
        return (
          <div>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileUpload(block.id, e)}
              className="mb-2"
            />
            {block.content && (
              <img src={block.content} alt="Uploaded content" className="max-w-full h-auto mb-2" />
            )}
            <Input
              type="text"
              value={block.caption || ''}
              onChange={(e) => updateBlock(block.id, { caption: e.target.value })}
              placeholder="Image caption (optional)"
              className="w-full mt-2"
            />
          </div>
        );
      case BlockTypes.VIDEO:
        return (
          <div>
            <input
              type="file"
              accept="video/*"
              onChange={(e) => handleFileUpload(block.id, e)}
              className="mb-2"
            />
            {block.content && (
              <video controls className="max-w-full h-auto mb-2">
                <source src={block.content} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            )}
            <Input
              type="text"
              value={block.title || ''}
              onChange={(e) => updateBlock(block.id, { title: e.target.value })}
              placeholder="Video title (optional)"
              className="w-full mt-2"
            />
          </div>
        );
      case BlockTypes.TWEET:
        return (
          <Input
            type="text"
            value={block.content}
            onChange={(e) => updateBlock(block.id, { content: e.target.value })}
            placeholder="Enter Tweet URL or ID"
            className="w-full"
          />
        );
      default:
        return null;
    }
  };

  const saveArticle = () => {
    console.log('Saving article:', article);
    alert('Article saved successfully!');
  };

  const publishArticle = () => {
    console.log('Publishing article:', article);
    alert('Article published successfully!');
  };

  return (
    <div className="admin-article-editor w-full max-w-[1400px] mx-auto p-4 sm:p-6">
      <div className="lg:flex lg:space-x-6 space-y-6 lg:space-y-0">
        <div className="lg:w-1/2 w-full">
          <Card>
            <CardHeader>
              <CardTitle>Create New Article</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block mb-2">Main Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(null, e, true)}
                    className="mb-2"
                  />
                </div>
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                  <Input
                    type="text"
                    value={article.title}
                    onChange={(e) => setArticle(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Article Title"
                    className="w-full sm:w-1/2"
                  />
                  <Input
                    type="text"
                    value={article.tagline}
                    onChange={(e) => setArticle(prev => ({ ...prev, tagline: e.target.value }))}
                    placeholder="Article Tagline"
                    className="w-full sm:w-1/2"
                  />
                </div>
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                <Input
                  type="text"
                  value={article.author}
                  onChange={(e) => setArticle(prev => ({ ...prev, author: e.target.value }))}
                  placeholder="Author"
                  className="w-full"
                />
                <Input
                  type="date"
                  value={article.date}
                  onChange={(e) => setArticle(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full"
                />
                </div>

                <DragDropContext onDragEnd={onDragEnd}>
                  <Droppable droppableId="blocks">
                    {(provided) => (
                      <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                        {article.content.map((block, index) => (
                          <Draggable key={block.id} draggableId={block.id} index={index}>
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                className="bg-gray-100 p-4 rounded-md relative"
                              >
                                <div className="flex items-center mb-2">
                                  <div {...provided.dragHandleProps} className="mr-2 cursor-move">
                                    <GripVertical size={20} />
                                  </div>
                                  <span className="font-semibold">{block.type.charAt(0).toUpperCase() + block.type.slice(1)}</span>
                                  <button
                                    onClick={() => removeBlock(block.id)}
                                    className="ml-auto text-red-500 hover:text-red-700"
                                  >
                                    <X size={20} />
                                  </button>
                                </div>
                                {renderBlockContent(block)}
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>

                <div className="flex flex-wrap gap-2">
                  <Button onClick={() => addBlock(BlockTypes.TEXT)} variant="outline">Add Text</Button>
                  <Button onClick={() => addBlock(BlockTypes.IMAGE)} variant="outline">Add Image</Button>
                  <Button onClick={() => addBlock(BlockTypes.VIDEO)} variant="outline">Add Video</Button>
                  <Button onClick={() => addBlock(BlockTypes.TWEET)} variant="outline">Add Tweet</Button>
                </div>

                <div className="flex justify-end space-x-2 mt-6">
                  <Button onClick={saveArticle} variant="outline">Save Draft</Button>
                  <Button onClick={publishArticle}>Publish Article</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:w-1/2 w-full">
          <Card className="overflow-hidden">
            <CardHeader>
                <div className="pb-4">
                  <CardTitle>Preview</CardTitle>
                </div>
            </CardHeader>
            <CardContent className="p-0"> {/* Remove padding here */}
              <ArticleRenderer article={article} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminArticleEditor;
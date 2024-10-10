import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Link } from 'react-router-dom';
import { Edit, Trash2 } from 'lucide-react';
import Modal from '../ui/modal';

const AdminArticleListPage = () => {
  const [articles, setArticles] = useState([]);
  const [deleteArticleId, setDeleteArticleId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch all articles on component mount
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/articles`);
        setArticles(response.data);
      } catch (error) {
        console.error('Error fetching articles:', error);
      }
    };

    fetchArticles();
  }, []);

  // Open the delete confirmation modal
  const handleDeleteClick = (id) => {
    setDeleteArticleId(id);
    setIsModalOpen(true);
  };

  // Confirm deletion
  const confirmDelete = async () => {
    try {
      // Delete the article via backend API
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/articles/${deleteArticleId}`);
      
      // Remove the deleted article from the state
      setArticles(prev => prev.filter(article => article._id !== deleteArticleId));
      setIsModalOpen(false);
      setDeleteArticleId(null);
    } catch (error) {
      console.error('Error deleting article:', error);
      alert('Failed to delete the article. Please try again.');
      setIsModalOpen(false);
      setDeleteArticleId(null);
    }
  };

  // Cancel deletion
  const cancelDelete = () => {
    setIsModalOpen(false);
    setDeleteArticleId(null);
  };

  return (
    <div className="admin-article-list-page w-full max-w-[1400px] mx-auto p-4 sm:p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Article List</h1>
      <div className="space-y-4">
        {articles.map(article => (
          <Card key={article._id}>
            <CardHeader>
              <CardTitle>{article.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{article.tagline}</p>
              <div className="flex space-x-2 mt-4">
                <Link to={`/admin/edit/${article._id}`}>
                  <Button variant="outline" className="flex items-center">
                    <Edit className="mr-2" /> Edit
                  </Button>
                </Link>
                <Button variant="destructive" onClick={() => handleDeleteClick(article._id)} className="flex items-center">
                  <Trash2 className="mr-2" /> Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      {isModalOpen && (
        <Modal>
          <div className="p-6">
            <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
            <p>Are you sure you want to delete this article? This action cannot be undone.</p>
            <div className="mt-6 flex justify-end space-x-4">
              <Button variant="outline" onClick={cancelDelete}>Cancel</Button>
              <Button variant="destructive" onClick={confirmDelete}>Delete</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default AdminArticleListPage;
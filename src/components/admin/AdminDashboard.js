import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { 
  FileText, 
  Users, 
  BarChart2, 
  Settings,
  PlusCircle
} from 'lucide-react';

const AdminDashboard = () => {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="bg-green-50 border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center text-green-700">
              <PlusCircle className="mr-2" />
              Create New Article
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-green-600">Start writing a new article for your site.</p>
            <Link to="/admin/articles/new">
              <Button className="bg-green-500 hover:bg-green-600">Create Article</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="mr-2" />
              Manage Articles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Create, edit, and manage your articles.</p>
            <Link to="/admin/articles">
              <Button>Go to Articles</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="mr-2" />
              User Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Manage user accounts and permissions.</p>
            <Link to="/admin/users">
              <Button>Manage Users</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart2 className="mr-2" />
              Analytics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">View site statistics and analytics.</p>
            <Link to="/admin/analytics">
              <Button>View Analytics</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="mr-2" />
              Site Settings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Configure global site settings.</p>
            <Link to="/admin/settings">
              <Button>Edit Settings</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;

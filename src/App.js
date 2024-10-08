import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from './components/ui/dropdown-menu';
import { Button } from './components/ui/button';
import { Menu } from 'lucide-react';
import './styles/globals.css'
import navLogo from './media/logo.jpg';
import HomePage from './components/HomePage';
import ArticlePage from './components/ArticlePage';
import AdminArticleEditor from './components/admin/AdminArticleEditor';

const NewsApp = () => {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <nav className="sticky top-0 bg-white border-b border-gray-200 shadow-sm z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex-shrink-0 flex items-center">
                <Link to="/"> {/* Wrap img with Link */}
                  <img src={navLogo} alt="APM News Logo" className="h-9" />
                </Link>
              </div>
              <div className="flex items-center">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="p-1 [&>svg]:hidden">
                      <Menu className="h-6 w-6" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-[#FFFFFF] bg-opacity-3 backdrop-blur-sm">
                    <Link to="/">
                      <DropdownMenuItem>Home</DropdownMenuItem>
                    </Link>
                    <DropdownMenuItem>Categories</DropdownMenuItem>
                    <Link to="/admin">
                      <DropdownMenuItem>Admin</DropdownMenuItem>
                    </Link>
                    <DropdownMenuItem>About</DropdownMenuItem>
                    <DropdownMenuItem>Contact</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </nav>
        
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/article/:id" element={<ArticlePage />} />
          <Route path="/admin"  element={<AdminArticleEditor />} />
        </Routes>
      </div>
    </Router>
  );
};

export default NewsApp;
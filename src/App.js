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
import AdminArticleListPage from './components/admin/AdminArticleListPage'; // Import the new component
import ArticleListPage from './components/ArticleListPage';
import ArticleFullPage from './components/ArticleFullPage';

const NavMenu = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="p-1 [&>svg]:hidden">
          <Menu className="h-6 w-6" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-[#FFFFFF] bg-opacity-3 backdrop-blur-sm">
        <DropdownMenuItem asChild onClick={closeMenu}>
          <Link to="/" className="w-full">Home</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild onClick={closeMenu}>
          <Link to="/articles" className="w-full">All Articles</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild onClick={closeMenu}>
          <Link to="/admin/articles" className="w-full">Admin Article List</Link> {/* Add link to Admin Article List */}
        </DropdownMenuItem>
        <DropdownMenuItem asChild onClick={closeMenu}>
          <Link to="/admin" className="w-full">Create New Article</Link> {/* Updated Admin Create route */}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={closeMenu}>About</DropdownMenuItem>
        <DropdownMenuItem onClick={closeMenu}>Contact</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const Navigation = () => {
  return (
    <nav className="sticky top-0 bg-white border-b border-gray-200 shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link to="/">
              <img src={navLogo} alt="APM News Logo" className="h-9" />
            </Link>
          </div>
          <div className="flex items-center">
            <NavMenu />
          </div>
        </div>
      </div>
    </nav>
  );
};

const NewsApp = () => {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/articles" element={<ArticleListPage />} />
          <Route path="/article/:id" element={<ArticleFullPage />} />
          <Route path="/admin" element={<AdminArticleEditor />} />
          <Route path="/admin/articles" element={<AdminArticleListPage />} /> {/* Add the new route */}
          <Route path="/admin/edit/:id" element={<AdminArticleEditor />} /> {/* Add Edit route */}
        </Routes>
      </div>
    </Router>
  );
};

export default NewsApp;
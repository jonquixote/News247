// components/DropdownMenu.js

import React, { useState, useRef, useEffect } from 'react';

function DropdownMenu({ children, className, ...props }) {
  const [isOpen, setIsOpen] = useState(false);

  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownRef]);

  return (
    <div className={`relative inline-block text-left ${className}`} {...props} ref={dropdownRef}>
      {React.Children.map(children, (child) => {
        if (child.type === DropdownMenuTrigger) {
          return React.cloneElement(child, { onClick: () => setIsOpen(!isOpen) });
        } else if (child.type === DropdownMenuContent) {
          return React.cloneElement(child, { isOpen });
        }
        return child;
      })}
    </div>
  );
}

function DropdownMenuTrigger({ children, className, onClick, ...props }) {
  return (
    <button
      className={`inline-flex w-full justify-center rounded-md bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
      <svg
        className="ml-2 -mr-1 h-5 w-5"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
          clipRule="evenodd"
        />
      </svg>
    </button>
  );
}

function DropdownMenuContent({ children, className, isOpen, ...props }) {
  return (
    isOpen && (
      <div
        className={`absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-card shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none ${className}`}
        {...props}
      >
        <div className="py-1">{children}</div>
      </div>
    )
  );
}

function DropdownMenuItem({ children, className, ...props }) {
  return (
    <a
      className={`block px-4 py-2 text-sm text-foreground hover:bg-accent hover:text-accent-foreground ${className}`}
      {...props}
    >
      {children}
    </a>
  );
}

export {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
};
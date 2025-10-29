'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/providers/AuthProvider';
import { 
  BookOpenIcon, 
  VideoCameraIcon, 
  AcademicCapIcon,
  Bars3Icon,
  XMarkIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  CogIcon
} from '@heroicons/react/24/outline';

export function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigation = [
    { name: 'Trang chủ', href: '/' },
    { name: 'Khóa học', href: '/courses' },
    { name: 'Video bài giảng', href: '/videos' },
    { name: 'Luyện tập', href: '/practice' },
  ];

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <BookOpenIcon className="h-8 w-8 text-nc-gold" />
              <span className="text-xl font-bold text-nc-dark-orange">
                NC Telearning
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-700 hover:text-nc-gold px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                {/* Admin Dashboard Link */}
                {user?.role === 'admin' && (
                  <Link
                    href="/admin/videos"
                    className="flex items-center space-x-1 text-gray-600 hover:text-nc-gold transition-colors"
                  >
                    <CogIcon className="h-5 w-5" />
                    <span className="text-sm">Quản lý</span>
                  </Link>
                )}
                
                <div className="flex items-center space-x-2">
                  <UserCircleIcon className="h-6 w-6 text-gray-600" />
                  <span className="text-sm text-gray-700">
                    {user?.firstName} {user?.lastName}
                  </span>
                  {user?.role === 'admin' ? (
                    <span className="text-xs bg-red-500 text-white px-2 py-1 rounded-full">
                      Admin
                    </span>
                  ) : user?.gradeLevel ? (
                    <span className="text-xs bg-nc-gold text-white px-2 py-1 rounded-full">
                      Lớp {user.gradeLevel}
                    </span>
                  ) : null}
                </div>
                <button
                  onClick={logout}
                  className="flex items-center space-x-1 text-gray-600 hover:text-nc-dark-orange transition-colors"
                >
                  <ArrowRightOnRectangleIcon className="h-5 w-5" />
                  <span className="text-sm">Đăng xuất</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href="/auth/login"
                  className="text-gray-700 hover:text-nc-gold px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Đăng nhập
                </Link>
                <Link
                  href="/auth/register"
                  className="btn-primary text-sm"
                >
                  Đăng ký
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-nc-gold focus:outline-none focus:text-nc-gold"
            >
              {isMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-700 hover:text-nc-gold block px-3 py-2 rounded-md text-base font-medium transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              
              {isAuthenticated ? (
                <div className="pt-4 border-t border-gray-200">
                  {/* Admin Dashboard Link */}
                  {user?.role === 'admin' && (
                    <Link
                      href="/admin/videos"
                      className="flex items-center space-x-2 text-gray-600 hover:text-nc-gold px-3 py-2 rounded-md text-base font-medium transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <CogIcon className="h-5 w-5" />
                      <span>Quản lý Video</span>
                    </Link>
                  )}
                  
                  <div className="flex items-center space-x-2 px-3 py-2">
                    <UserCircleIcon className="h-6 w-6 text-gray-600" />
                    <span className="text-sm text-gray-700">
                      {user?.firstName} {user?.lastName}
                    </span>
                    {user?.role === 'admin' ? (
                      <span className="text-xs bg-red-500 text-white px-2 py-1 rounded-full">
                        Admin
                      </span>
                    ) : user?.gradeLevel ? (
                      <span className="text-xs bg-nc-gold text-white px-2 py-1 rounded-full">
                        Lớp {user.gradeLevel}
                      </span>
                    ) : null}
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center space-x-2 text-gray-600 hover:text-nc-dark-orange px-3 py-2 rounded-md text-base font-medium transition-colors w-full text-left"
                  >
                    <ArrowRightOnRectangleIcon className="h-5 w-5" />
                    <span>Đăng xuất</span>
                  </button>
                </div>
              ) : (
                <div className="pt-4 border-t border-gray-200 space-y-2">
                  <Link
                    href="/auth/login"
                    className="text-gray-700 hover:text-nc-gold block px-3 py-2 rounded-md text-base font-medium transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Đăng nhập
                  </Link>
                  <Link
                    href="/auth/register"
                    className="btn-primary block text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Đăng ký
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

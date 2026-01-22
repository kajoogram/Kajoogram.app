import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './firebase';
import SplashScreen from './pages/SplashScreen';
import GetStarted from './pages/GetStarted';
import Auth from './pages/Auth';
import ProfileSetup from './pages/ProfileSetup';
import Home from './pages/Home';
import Search from './pages/Search';
import Profile from './pages/Profile';
import UserProfile from './pages/UserProfile';
import FriendsList from './pages/FriendsList';
import Wishlist from './pages/Wishlist';
import Discover from './pages/Discover';
import DiscoverSearch from './pages/DiscoverSearch';
import Reels from './pages/Reels';
import Create from './pages/Create';
import CategoryPage from './pages/CategoryPage';
import PlatformPage from './pages/PlatformPage';
import LabelPage from './pages/LabelPage';
import ProductDetails from './pages/ProductDetails';
import VideoDetail from './pages/VideoDetail';
import ChannelPage from './pages/ChannelPage';
import GenericPage from './pages/GenericPage';
import AdminHome from './pages/admin/AdminHome';
import AdminProducts from './pages/admin/AdminProducts';
import AdminPlatforms from './pages/admin/AdminPlatforms';
import AdminCategories from './pages/admin/AdminCategories';
import AdminCategoryDetails from './pages/admin/AdminCategoryDetails';
import AdminSliders from './pages/admin/AdminSliders';
import AdminLabels from './pages/admin/AdminLabels';
import AdminMenuPages from './pages/admin/AdminMenuPages';
import AdminPageEditor from './pages/admin/AdminPageEditor';
import AdminReports from './pages/admin/AdminReports';
import AdminReportDetail from './pages/admin/AdminReportDetail';
import AdminNotifications from './pages/admin/AdminNotifications';
import AdminNotificationSend from './pages/admin/AdminNotificationSend';
import Dashboard from './pages/dashboard/Dashboard';
import Analytics from './pages/dashboard/Analytics';
import PostList from './pages/dashboard/PostList';
import { AppContextProvider } from './context/AppContext';
import { ProductContextProvider } from './context/ProductContext';
import { PlatformContextProvider } from './context/PlatformContext';
import { CategoryContextProvider } from './context/CategoryContext';
import { SliderContextProvider } from './context/SliderContext';
import { LabelContextProvider } from './context/LabelContext';
import { ContentContextProvider } from './context/ContentContext';
import { ReportContextProvider } from './context/ReportContext';
import { NotificationContextProvider } from './context/NotificationContext';
import { FriendContextProvider } from './context/FriendContext';
import { PostContextProvider } from './context/PostContext';
import { User } from './types';

interface ProtectedRouteProps {
  isLoggedIn: boolean;
  children?: React.ReactNode;
}

const ProtectedRoute = ({ isLoggedIn, children }: ProtectedRouteProps) => {
  if (!isLoggedIn) {
    return <Navigate to="/auth" replace />;
  }
  return <>{children}</>;
};

// Strict Admin Route Protection
const AdminRoute = ({ user, children }: { user: User; children?: React.ReactNode }) => {
  if (!user.isLoggedIn || !user.isAdmin) {
    return <Navigate to="/profile" replace />;
  }
  return <>{children}</>;
};

const App: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [authResolved, setAuthResolved] = useState(false);
  const [user, setUser] = useState<User>({
    id: '',
    username: '',
    email: '',
    isLoggedIn: false,
    isAdmin: false
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3500);
    return () => clearTimeout(timer);
  }, []);

  // Firebase Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        // Check for admin email
        const isAdmin = firebaseUser.email === 'patwaadmin@gmail.com';
        
        setUser(prev => ({
          ...prev,
          id: firebaseUser.uid,
          username: firebaseUser.displayName || prev.username || 'User',
          email: firebaseUser.email || '',
          isLoggedIn: true,
          isAdmin: isAdmin,
          profilePhoto: prev.profilePhoto || firebaseUser.photoURL || undefined
        }));
      } else {
        setUser({
          id: '',
          username: '',
          email: '',
          isLoggedIn: false,
          isAdmin: false
        });
      }
      setAuthResolved(true);
    });

    return () => unsubscribe();
  }, []);

  if (showSplash || !authResolved) {
    return <SplashScreen />;
  }

  return (
    <AppContextProvider>
      <PlatformContextProvider>
        <CategoryContextProvider>
          <SliderContextProvider>
            <LabelContextProvider>
              <ContentContextProvider>
                <ReportContextProvider>
                  <NotificationContextProvider>
                    <ProductContextProvider>
                      <FriendContextProvider>
                        <PostContextProvider>
                          <HashRouter>
                            <div className="max-w-[480px] mx-auto bg-white min-h-screen relative shadow-2xl overflow-hidden">
                              <Routes>
                                {/* Public Landing */}
                                <Route path="/" element={
                                  user.isLoggedIn ? <Navigate to="/home" replace /> : <GetStarted />
                                } />
                                
                                <Route path="/get-started" element={
                                  user.isLoggedIn ? <Navigate to="/home" replace /> : <GetStarted />
                                } />
                                
                                <Route path="/auth" element={
                                  user.isLoggedIn ? <Navigate to="/home" replace /> : <Auth onAuthSuccess={(u) => setUser({ ...user, ...u, isLoggedIn: true })} />
                                } />

                                {/* Protected Routes */}
                                <Route path="/setup" element={<ProtectedRoute isLoggedIn={user.isLoggedIn}><ProfileSetup user={user} onComplete={(u) => setUser(u)} /></ProtectedRoute>} />
                                
                                <Route path="/home" element={<ProtectedRoute isLoggedIn={user.isLoggedIn}><Home user={user} /></ProtectedRoute>} />
                                
                                <Route path="/search" element={<ProtectedRoute isLoggedIn={user.isLoggedIn}><Search /></ProtectedRoute>} />

                                <Route path="/category/:id" element={<ProtectedRoute isLoggedIn={user.isLoggedIn}><CategoryPage isLoggedIn={user.isLoggedIn} /></ProtectedRoute>} />

                                <Route path="/platform/:name" element={<ProtectedRoute isLoggedIn={user.isLoggedIn}><PlatformPage isLoggedIn={user.isLoggedIn} /></ProtectedRoute>} />
                                
                                <Route path="/label/:id" element={<ProtectedRoute isLoggedIn={user.isLoggedIn}><LabelPage isLoggedIn={user.isLoggedIn} /></ProtectedRoute>} />

                                <Route path="/product/:id" element={<ProtectedRoute isLoggedIn={user.isLoggedIn}><ProductDetails /></ProtectedRoute>} />

                                <Route path="/page/:pageId" element={<GenericPage />} />
                                
                                <Route path="/discover" element={
                                  <ProtectedRoute isLoggedIn={user.isLoggedIn}>
                                    <Discover />
                                  </ProtectedRoute>
                                } />

                                <Route path="/discover/search" element={
                                  <ProtectedRoute isLoggedIn={user.isLoggedIn}>
                                    <DiscoverSearch />
                                  </ProtectedRoute>
                                } />
                                
                                <Route path="/video/:id" element={
                                  <ProtectedRoute isLoggedIn={user.isLoggedIn}>
                                    <VideoDetail />
                                  </ProtectedRoute>
                                } />

                                <Route path="/channel/:id" element={
                                  <ProtectedRoute isLoggedIn={user.isLoggedIn}>
                                    <ChannelPage />
                                  </ProtectedRoute>
                                } />

                                <Route path="/reels" element={
                                  <ProtectedRoute isLoggedIn={user.isLoggedIn}>
                                    <Reels />
                                  </ProtectedRoute>
                                } />
                                
                                <Route path="/create" element={
                                  <ProtectedRoute isLoggedIn={user.isLoggedIn}>
                                    <Create />
                                  </ProtectedRoute>
                                } />
                                
                                <Route path="/profile" element={
                                  <ProtectedRoute isLoggedIn={user.isLoggedIn}>
                                    <Profile user={user} onLogout={() => {
                                      signOut(auth).catch((error) => console.error("Sign out error", error));
                                    }} />
                                  </ProtectedRoute>
                                } />

                                <Route path="/user/:userId" element={
                                  <ProtectedRoute isLoggedIn={user.isLoggedIn}>
                                    <UserProfile />
                                  </ProtectedRoute>
                                } />

                                <Route path="/friends" element={
                                  <ProtectedRoute isLoggedIn={user.isLoggedIn}>
                                    <FriendsList />
                                  </ProtectedRoute>
                                } />
                                
                                <Route path="/wishlist" element={
                                  <ProtectedRoute isLoggedIn={user.isLoggedIn}>
                                    <Wishlist />
                                  </ProtectedRoute>
                                } />

                                {/* Dashboard Routes */}
                                <Route path="/dashboard" element={<ProtectedRoute isLoggedIn={user.isLoggedIn}><Dashboard /></ProtectedRoute>} />
                                <Route path="/dashboard/:metric" element={<ProtectedRoute isLoggedIn={user.isLoggedIn}><Analytics /></ProtectedRoute>} />
                                <Route path="/dashboard/:metric/posts" element={<ProtectedRoute isLoggedIn={user.isLoggedIn}><PostList /></ProtectedRoute>} />

                                {/* Admin Routes */}
                                <Route path="/admin" element={
                                  <AdminRoute user={user}>
                                    <AdminHome />
                                  </AdminRoute>
                                } />
                                <Route path="/admin/products" element={<AdminRoute user={user}><AdminProducts /></AdminRoute>} />
                                <Route path="/admin/platforms" element={<AdminRoute user={user}><AdminPlatforms /></AdminRoute>} />
                                <Route path="/admin/categories" element={<AdminRoute user={user}><AdminCategories /></AdminRoute>} />
                                <Route path="/admin/categories/:id" element={<AdminRoute user={user}><AdminCategoryDetails /></AdminRoute>} />
                                <Route path="/admin/sliders" element={<AdminRoute user={user}><AdminSliders /></AdminRoute>} />
                                <Route path="/admin/labels" element={<AdminRoute user={user}><AdminLabels /></AdminRoute>} />
                                <Route path="/admin/menu-pages" element={<AdminRoute user={user}><AdminMenuPages /></AdminRoute>} />
                                <Route path="/admin/menu-pages/:pageId" element={<AdminRoute user={user}><AdminPageEditor /></AdminRoute>} />
                                <Route path="/admin/reports" element={<AdminRoute user={user}><AdminReports /></AdminRoute>} />
                                <Route path="/admin/reports/:id" element={<AdminRoute user={user}><AdminReportDetail /></AdminRoute>} />
                                <Route path="/admin/notifications" element={<AdminRoute user={user}><AdminNotifications /></AdminRoute>} />
                                <Route path="/admin/notifications/:mode" element={<AdminRoute user={user}><AdminNotificationSend mode="broadcast" /></AdminRoute>} />
                                <Route path="/admin/notifications/user/:userId" element={<AdminRoute user={user}><AdminNotificationSend mode="personal" /></AdminRoute>} />

                              </Routes>
                            </div>
                          </HashRouter>
                        </PostContextProvider>
                      </FriendContextProvider>
                    </ProductContextProvider>
                  </NotificationContextProvider>
                </ReportContextProvider>
              </ContentContextProvider>
            </LabelContextProvider>
          </SliderContextProvider>
        </CategoryContextProvider>
      </PlatformContextProvider>
    </AppContextProvider>
  );
};

export default App;
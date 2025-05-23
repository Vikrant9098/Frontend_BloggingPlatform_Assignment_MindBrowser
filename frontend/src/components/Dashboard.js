import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getUserPosts, deletePost } from '../api';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      fetchUserPosts();
    }
  }, [isAuthenticated]);

  const fetchUserPosts = async () => {
    try {
      const response = await getUserPosts();
      setPosts(response.data);
    } catch (error) {
      setError('Error fetching your posts');
      console.error('Error fetching user posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (postId, postTitle) => {
    if (window.confirm(`Are you sure you want to delete "${postTitle}"?`)) {
      try {
        await deletePost(postId);
        setPosts(posts.filter(post => post.id !== postId));
        alert('Post deleted successfully!');
      } catch (error) {
        alert('Error deleting post');
        console.error('Error deleting post:', error);
      }
    }
  };

  const stripHtml = (html) => {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  if (!isAuthenticated) {
    return (
      <div className="auth-required">
        <h2>Authentication Required</h2>
        <p>Please log in to view your dashboard.</p>
      </div>
    );
  }

  if (loading) return <div className="loading">Loading your posts...</div>;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>My Posts Dashboard by Vikrant </h1>
        <p>Welcome back, {user?.username}!</p>
        <Link to="/create-post" className="create-post-btn">
          Create New Post
        </Link>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="posts-section">
        {posts.length === 0 ? (
          <div className="no-posts">
            <h3>You haven't created any posts yet.</h3>
            <p>Start sharing your thoughts with the world!</p>
            <Link to="/create-post" className="create-first-post-btn">
              Create Your First Post
            </Link>
          </div>
        ) : (
          <div className="user-posts-grid">
            {posts.map(post => (
              <div key={post.id} className="user-post-card">
                <div className="post-content">
                  <h3 className="post-title">
                    <Link to={`/posts/${post.id}`}>{post.title}</Link>
                  </h3>
                  <p className="post-excerpt">
                    {stripHtml(post.content).substring(0, 120)}...
                  </p>
                  <div className="post-stats">
                    <span className="post-date">
                      Created: {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                    {post.updatedAt !== post.createdAt && (
                      <span className="post-updated">
                        Updated: {new Date(post.updatedAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
                <div className="post-actions">
                  <Link to={`/posts/${post.id}`} className="view-btn">
                    View
                  </Link>
                  <Link to={`/edit-post/${post.id}`} className="edit-btn">
                    Edit
                  </Link>
                  <button 
                    onClick={() => handleDelete(post.id, post.title)}
                    className="delete-btn"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getPost, deletePost } from '../../api';
import { useAuth } from '../../context/AuthContext';

const BlogPost = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      const response = await getPost(id);
      setPost(response.data);
    } catch (error) {
      setError('Post not found');
      console.error('Error fetching post:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await deletePost(id);
        alert('Post deleted successfully!');
        navigate('/');
      } catch (error) {
        alert('Error deleting post');
        console.error('Error deleting post:', error);
      }
    }
  };

  if (loading) return <div className="loading">Loading post...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!post) return <div className="error-message">Post not found</div>;

  const isOwner = isAuthenticated && user && user.id === post.userId;

  return (
    <div className="blog-post-container">
      <article className="blog-post">
        <header className="post-header">
          <h1 className="post-title">{post.title}</h1>
          <div className="post-meta">
            <span className="post-author">By {post.user?.username || 'Unknown'}</span>
            <span className="post-date">
              Published on {new Date(post.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
            {post.updatedAt !== post.createdAt && (
              <span className="post-updated">
                (Updated: {new Date(post.updatedAt).toLocaleDateString()})
              </span>
            )}
          </div>
          {isOwner && (
            <div className="post-actions">
              <Link to={`/edit-post/${post.id}`} className="edit-btn">
                Edit Post
              </Link>
              <button onClick={handleDelete} className="delete-btn">
                Delete Post
              </button>
            </div>
          )}
        </header>
        
        <div className="post-content" dangerouslySetInnerHTML={{ __html: post.content }} />
        
        <footer className="post-footer">
          <Link to="/" className="back-link">← Back to All Posts</Link>
        </footer>
      </article>
    </div>
  );
};

export default BlogPost;
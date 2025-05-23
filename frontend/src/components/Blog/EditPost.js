import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { getPost, editPost } from '../../api';
import { useAuth } from '../../context/AuthContext';

const EditPost = () => {
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      const response = await getPost(id);
      const post = response.data;
      
      // Check if user owns this post
      if (!isAuthenticated || user.id !== post.userId) {
        setError('You are not authorized to edit this post');
        return;
      }
      
      setTitle(post.title);
      setContent(post.content);
    } catch (error) {
      setError('Post not found');
      console.error('Error fetching post:', error);
    } finally {
      setFetchLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError('Please fill in both title and content');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await editPost(id, { title: title.trim(), content });
      alert('Post updated successfully!');
      navigate(`/posts/${id}`);
    } catch (error) {
      setError(error.response?.data?.message || 'Error updating post');
      console.error('Error updating post:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="auth-required">
        <h2>Authentication Required</h2>
        <p>Please log in to edit posts.</p>
      </div>
    );
  }

  if (fetchLoading) return <div className="loading">Loading post...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="edit-post-container">
      <div className="edit-post-form">
        <h1>Edit Post</h1>
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Post Title</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter your post title..."
              required
              className="title-input"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="content">Post Content</label>
            <div className="editor-container">
              <CKEditor
                editor={ClassicEditor}
                data={content}
                onChange={(event, editor) => {
                  const data = editor.getData();
                  setContent(data);
                }}
                config={{
                  toolbar: [
                    'heading',
                    '|',
                    'bold',
                    'italic',
                    'link',
                    'bulletedList',
                    'numberedList',
                    '|',
                    'outdent',
                    'indent',
                    '|',
                    'blockQuote',
                    'insertTable',
                    'undo',
                    'redo'
                  ],
                  placeholder: 'Write your blog post content here...'
                }}
              />
            </div>
          </div>
          
          <div className="form-actions">
            <button 
              type="button" 
              onClick={() => navigate(`/posts/${id}`)} 
              className="cancel-btn"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading || !title.trim() || !content.trim()} 
              className="submit-btn"
            >
              {loading ? 'Updating...' : 'Update Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPost;
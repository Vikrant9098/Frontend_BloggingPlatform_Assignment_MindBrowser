import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { createPost } from '../../api';
import { useAuth } from '../../context/AuthContext';

const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="auth-required">
        <h2>Authentication Required</h2>
        <p>Please log in to create a new post.</p>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError('Please fill in both title and content');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await createPost({ title: title.trim(), content });
      alert('Post created successfully!');
      navigate(`/posts/${response.data.post.id}`);
    } catch (error) {
      setError(error.response?.data?.message || 'Error creating post');
      console.error('Error creating post:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-post-container">
      <div className="create-post-form">
        <h1>Create New Post</h1>
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
              onClick={() => navigate('/')} 
              className="cancel-btn"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading || !title.trim() || !content.trim()} 
              className="submit-btn"
            >
              {loading ? 'Creating...' : 'Create Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
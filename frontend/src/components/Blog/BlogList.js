import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getPosts } from '../../api';

const BlogList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await getPosts();
      setPosts(response.data);
    } catch (error) {
      setError('Error fetching posts');
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stripHtml = (html) => {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  if (loading) return <div className="loading">Loading posts...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="blog-list-container">
      <div className="search-container">
        <h1>Latest Blog Posts</h1>
        <input
          type="text"
          placeholder="Search posts by title or content..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="posts-grid">
        {filteredPosts.length === 0 ? (
          <div className="no-posts">
            {searchTerm ? 'No posts found matching your search.' : 'No posts available yet.'}
          </div>
        ) : (
          filteredPosts.map(post => (
            <article key={post.id} className="post-card">
              <Link to={`/posts/${post.id}`} className="post-link">
                <h2 className="post-title">{post.title}</h2>
                <p className="post-excerpt">
                  {stripHtml(post.content).substring(0, 150)}...
                </p>
                <div className="post-meta">
                  <span className="post-author">By {post.user?.username || 'Unknown'}</span>
                  <span className="post-date">
                    {new Date(post.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
              </Link>
            </article>
          ))
        )}
      </div>
    </div>
  );
};

export default BlogList;
import React from 'react';
import PropTypes from 'prop-types';
import Post from './Post';

const PostList = (props) => {
  const {posts, editPost, deletePost, isPostByUser} = props 
  return (

    <div className="post-list">
      {posts.map((post) => (
        <Post key={post.id} post={post} editPost={editPost} deletePost={deletePost} isPostByUser={isPostByUser} />
      ))}
    </div>
  );
};

PostList.propTypes = {
  posts: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      user: PropTypes.shape({
        name: PropTypes.string.isRequired,
      }).isRequired,
      book: PropTypes.shape({
        title: PropTypes.string.isRequired,
        author: PropTypes.string.isRequired,
      }).isRequired,
      review: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default PostList;

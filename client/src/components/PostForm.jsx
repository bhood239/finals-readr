
import React, { useState, useEffect } from 'react';
import CustomRating from './CustomRating';
import PropTypes from 'prop-types';
import { useCreatePost, useUpdatePostById, useDeletePostById } from '../helpers/hooks/apiData/usePostData';
import { useBookById } from '../helpers/hooks/useBookData';
import './PostForm.scss';
import { useNavigate } from 'react-router-dom';

const PostForm = ({ currentUser, post, bookId, onPostCreation, setPostFormSelected }) => {
  const [rating, setRating] = useState(post ? post.rating : null);
  const [timeSpent, setTimeSpent] = useState(post ? post.time_spent : '');
  const [review, setReview] = useState(post ? post.review : '');
  const [hours, setHours] = useState(post ? post.hours : '');
  const [error, setError] = useState(null); 

  const { handleCreatePost, loading, error: createError } = useCreatePost(currentUser);
  const { updatePost, loading: updateLoading, error: updateError } = useUpdatePostById(currentUser);
  const { deletePost } = useDeletePostById(currentUser);
  const { book, loading: bookLoading, error: bookError } = useBookById(bookId); // Fetch book details

  const navigate = useNavigate();

  useEffect(() => {
    if (post) {
      setRating(post.rating);
      setTimeSpent(post.time_spent);
      setReview(post.review);
      setHours(post.hours);
    }
  }, [post]);

  const handleSubmit = (event) => {
    event.preventDefault();
    setError(null); // Reset error state on submit

    const numericRating = Number(rating);
    if (
      rating === "" ||
      isNaN(numericRating) ||
      numericRating < 1 ||
      numericRating > 5
    ) {
      console.error("Invalid rating value");
      return;
    }

    if (!bookId) {
      console.error("Book ID is required");
      return;
    }

    const timeSpentNumber = hours ? parseFloat(hours) : null;

    const postData = {
      rating: numericRating,
      time_spent: timeSpentNumber,
      review,
      user_id: currentUser,
      book_id: bookId,
    };

  const action = post ? updatePost(post.id, postData) : handleCreatePost(postData);
    action
      .then((postResponse) => {
        console.log('postResponse', postResponse);

        setPostFormSelected(false); // Hide the form after submission
        onPostCreation(postResponse);

        if (!post) { // Reset form fields after creating a new post
          setRating(null);
          setTimeSpent('');
          setReview('');
          setHours('');
        }
          // Redirect to PostList on dashboard after successful creation/update
          navigate('/');
        // Reload the page after successful update
        window.location.reload();


      })
      .catch((err) => setError(err.message)); // Display error message
  };

  // const handleDelete = () => {
  //   if (post) {
  //     const confirmed = window.confirm("Are you sure you want to delete this post?");
    
  //   if (confirmed) {
  //     deletePost(post.id)
  //       .then(() => {
  //         console.log('Post deleted');

  //         setPostFormSelected(false); // Hide the form after deletion
  //         onPostCreation(null); // Notify parent about deletion

  //         // Reload the page after successful deletion
  //         window.location.reload();

  //       })
  //       .catch((error) => console.error("Error deleting post:", error));
  //     }
  //   }
  // };

  const handleDelete = () => {
    if (post) {
      const confirmed = window.confirm("Are you sure you want to delete this post?");
  
      if (confirmed) {
        deletePost(post.id)
          .then(() => {
            console.log('Post deleted');
  
            // Optionally update the posts list in the parent component
            onPostCreation(null);
  
            // Option 1: Update the state to remove the post from the UI without reloading
            // setPosts((prevPosts) => prevPosts.filter((p) => p.id !== post.id));
            // setPostFormSelected(false); // Hide the form after deletion
  
            // Option 2: Reload the page after successful deletion (use only one option)
            window.location.reload();
          })
          .catch((error) => console.error("Error deleting post:", error));
      }
    }
  };
  


  return (
    <div className='post-form-container'>
      <div className='post-form-card card'>

        <h2>{post ? 'Edit Post:' : 'Create a Post:'}</h2>

        <CustomRating rating={rating} setRating={setRating} />

        <form onSubmit={handleSubmit}>
          <div className='mb-3'>
            <label htmlFor='review' className='form-label'>Book Review:</label>
            <textarea
              id="review"
              type="text"
              name="review"
              rows="5"
              placeholder="Write a post:"
              className='form-control'
              value={review}
              onChange={(event) => setReview(event.target.value)}
              required
            />
          </div>

          <div className='col-md-2'>
            <label htmlFor='hours' className='form-label'>Time Spent (Hours):</label>
            <input
              id="hours"
              type="number"
              className='form-control'
              placeholder='0'
              value={hours}
              onChange={(event) => setHours(event.target.value)}
              required
            />
          </div>

          <div>
            <button type="submit" className='btn btn-primary' disabled={loading || updateLoading}>
              {loading || updateLoading ? (post ? 'Updating Post...' : 'Creating Post...') : post ? 'Update Post' : 'Create My Post'}
            </button>
            {(error || updateError) && <p className='text-danger mt-2'>Error: {error?.message || updateError?.message}</p>}
            {post && (
              <button type="button" className='btn btn-danger' onClick={handleDelete}>
                Delete Post
              </button>
            )}
            <button className='back-btn-primary' onClick={() => setPostFormSelected(false)}>Back</button>
            
          </div>
          
        </form>
      </div>
    </div>
  );
};

PostForm.propTypes = {
  currentUser: PropTypes.string.isRequired,
  post: PropTypes.object, // post is optional for create mode
  bookId: PropTypes.string.isRequired,
  onPostCreation: PropTypes.func.isRequired,
  setPostFormSelected: PropTypes.func.isRequired,
};

export default PostForm;

import axios from 'axios';
import { showAlert } from './alert';

export const createReview = async (tourId,review,rating) => {
  try {
    const res = await axios({
      method: 'POST',
      url: `http://127.0.0.1:3000/api/v1/tours/${tourId}/reviews/`,
      data: {
        review,
       rating
      }
    });
    
    
    if (res.data.status === 'success') {
      // console.log(res.data.status);
      showAlert('success', 'Review created successfully!');
      window.setTimeout(() => {
        window.location.reload();
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const deleteReview = async reviewId => {
  try {
    const res = await axios({
      method: 'DELETE',
      url: `/api/v1/reviews/${reviewId}`
    });

    if (res.status === 204) {
      showAlert('success', 'Review deleted successfully!');

      window.setTimeout(() => {
        location.reload();
      }, 1000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const editReview = async (reviewId,review,rating) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: `/api/v1/reviews/${reviewId}`,
      data: {
        review,
       rating
      }
    });

    if (res.status === 200) {
      showAlert('success', 'Review updated successfully!');

      window.setTimeout(() => {
        location.reload();
      }, 1000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

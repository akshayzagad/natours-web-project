/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alert';

export const bookTour = async tourId => {
  try {
    // Get Paystack checkout URL
    const res = await axios(
      `/api/v1/bookings/checkout-session/${tourId}`
    );

    // Redirect to Paystack
    window.location.assign(
      res.data.session.authorization_url
    );
  } catch (err) {
    console.error(err);
    showAlert('error', 'Payment initialization failed');
  }
};
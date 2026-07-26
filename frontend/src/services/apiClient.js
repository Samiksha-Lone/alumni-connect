import axios from 'axios';
import { getApiBase } from '../utils/api';

const apiBase = getApiBase();

const client = axios.create({
  baseURL: apiBase,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const normalizeApiError = (error) => {
  const response = error?.response;
  if (!response) {
    return {
      status: 0,
      message: error?.message || 'Network error',
      details: []
    };
  }

  const data = response.data || {};
  const message = data.message || (data.error && data.error.message) || data.error || 'Server error';
  const details = data.errors || (data.error && data.error.details) || [];

  return {
    status: response.status,
    message,
    details,
    payload: data
  };
};

client.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(normalizeApiError(error))
);

export default client;

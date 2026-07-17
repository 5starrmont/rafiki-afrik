import { useState } from 'react';
import { contentAPI } from '../services/api';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    setMessage('');
    
    try {
      await contentAPI.subscribeNewsletter(email);
      setStatus('success');
      setMessage('Thank you! You have successfully subscribed.');
      setEmail('');
    } catch (error) {
      setStatus('error');
      // Django REST Framework returns field-specific errors
      if (error.response?.data?.email) {
        setMessage('This email is already subscribed.');
      } else {
        setMessage('Something went wrong. Please try again.');
      }
    }
  };

  return (
    <div className="bg-primary text-white py-16 px-6 rounded-2xl my-12 max-w-4xl mx-auto shadow-lg text-center">
      <h2 className="text-3xl font-heading font-bold mb-4">Stay Connected</h2>
      <p className="font-body text-gray-200 mb-8 max-w-xl mx-auto">
        Subscribe to our newsletter to get the latest updates on our stories, films, and community initiatives across Africa.
      </p>
      
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row justify-center max-w-xl mx-auto gap-3">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email address"
          required
          disabled={status === 'loading' || status === 'success'}
          className="flex-grow px-4 py-3 rounded-md text-gray-900 font-body focus:outline-none focus:ring-2 focus:ring-secondary border-none"
        />
        <button
          type="submit"
          disabled={status === 'loading' || status === 'success'}
          className="bg-secondary hover:bg-[#e07d3b] transition-colors text-white font-medium px-8 py-3 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
        </button>
      </form>
      
      {message && (
        <div className={`mt-4 font-body text-sm font-medium ${status === 'success' ? 'text-green-300' : 'text-red-300'}`}>
          {message}
        </div>
      )}
    </div>
  );
};

export default Newsletter;
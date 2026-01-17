import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const useSubscription = () => {
  const [plans, setPlans] = useState([]);
  const [currentPlan, setCurrentPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState(false);
  const [error, setError] = useState(null);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    fetchPlans();
    fetchCurrentSubscription();
  }, []);

  useEffect(() => {
    if (!currentPlan?.endDate || currentPlan?.isExpired) return;

    const calculateCountdown = () => {
      const now = new Date().getTime();
      const end = new Date(currentPlan.endDate).getTime();
      const distance = end - now;

      if (distance < 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }

      return {
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      };
    };

    setCountdown(calculateCountdown());

    const timer = setInterval(() => {
      setCountdown(calculateCountdown());
    }, 1000);

    return () => clearInterval(timer);
  }, [currentPlan]);

  const fetchPlans = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/subscription-plans/plans`);
      setPlans(response.data.plans || []);
      setError(null);
    } catch (error) {
      console.error('Error fetching plans:', error);
      setError('Failed to load subscription plans');
    } finally {
      setLoading(false);
    }
  };

  const fetchCurrentSubscription = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const token = localStorage.getItem('token');
      const restaurantId = user?.id;
      if (!restaurantId) return;
      
      const response = await axios.get(
        `${API_URL}/api/subscription-plans/status/${restaurantId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCurrentPlan(response.data.subscription);
    } catch (error) {
      console.error('Error fetching subscription:', error);
    }
  };

  const handleRenew = async () => {
    if (!confirm('Renew subscription for another 30 days?')) return;

    setSubscribing(true);
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const token = localStorage.getItem('token');
      const restaurantId = user?.id;
      
      await axios.post(
        `${API_URL}/api/subscription-plans/renew`,
        {
          restaurantId,
          paymentMethod: 'card',
          transactionId: `TXN-${Date.now()}`
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert('Subscription renewed successfully!');
      fetchCurrentSubscription();
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to renew subscription');
    } finally {
      setSubscribing(false);
    }
  };

  const handleSubscribe = async (planName) => {
    if (!confirm(`Subscribe to ${planName} plan?`)) return;

    setSubscribing(true);
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const token = localStorage.getItem('token');
      const restaurantId = user?.id;
      
      await axios.post(
        `${API_URL}/api/subscription-plans/subscribe`,
        {
          restaurantId,
          paymentMethod: 'card',
          transactionId: `TXN-${Date.now()}`
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert('Subscription activated successfully!');
      fetchCurrentSubscription();
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to subscribe');
    } finally {
      setSubscribing(false);
    }
  };

  return {
    plans,
    currentPlan,
    loading,
    subscribing,
    error,
    countdown,
    handleRenew,
    handleSubscribe
  };
};

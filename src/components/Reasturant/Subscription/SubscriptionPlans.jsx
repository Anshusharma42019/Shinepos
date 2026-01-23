import React from 'react';
import { FiCheck, FiClock, FiCalendar } from 'react-icons/fi';
import { useSubscription } from './hooks/useSubscription';

const SubscriptionPlans = () => {
  const {
    plans,
    currentPlan,
    loading,
    subscribing,
    error,
    countdown,
    handleRenew,
    handleSubscribe
  } = useSubscription();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-pulse-slow">💳</div>
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-500 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-900 font-medium">Loading plans...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-500/80 backdrop-blur-md border border-red-600/50 text-white px-4 py-3 rounded-xl">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 animate-fadeIn">
      {/* <h1 className="text-3xl font-bold text-gray-900 mb-6">💳 Subscription Plans</h1> */}

      {currentPlan && (
        <div className="bg-white/20 backdrop-blur-2xl border border-white/40 rounded-2xl p-6 mb-6 shadow-2xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">Current Plan: {currentPlan.plan}</h3>
              <p className="text-sm text-gray-700 flex items-center">
                <FiCalendar className="mr-2" />
                {new Date(currentPlan.startDate).toLocaleDateString()} - {new Date(currentPlan.endDate).toLocaleDateString()}
              </p>
            </div>
            <div className={`px-4 py-2 rounded-full font-semibold ${
              currentPlan.paymentStatus === 'cancelled' ? 'bg-orange-500 text-white' :
              currentPlan.isExpired ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
            }`}>
              {currentPlan.paymentStatus === 'cancelled' ? '⚠️ Cancelled' : currentPlan.isExpired ? '❌ Expired' : '✓ Active'}
            </div>
          </div>
          
          {!currentPlan.isExpired && currentPlan.paymentStatus === 'paid' && (
            <div className="bg-white/40 backdrop-blur-lg rounded-xl p-4 mt-4 border border-white/50">
              <div className="flex items-center mb-3">
                <FiClock className="text-gray-900 mr-2" />
                <h4 className="font-semibold text-gray-900">⏰ Time Remaining</h4>
              </div>
              <div className="grid grid-cols-4 gap-4 text-center">
                <div className="bg-white/40 backdrop-blur-lg rounded-xl p-3 border border-white/50">
                  <div className="text-3xl font-bold text-gray-900">{countdown.days}</div>
                  <div className="text-xs text-gray-700 mt-1">Days</div>
                </div>
                <div className="bg-white/40 backdrop-blur-lg rounded-xl p-3 border border-white/50">
                  <div className="text-3xl font-bold text-gray-900">{countdown.hours}</div>
                  <div className="text-xs text-gray-700 mt-1">Hours</div>
                </div>
                <div className="bg-white/40 backdrop-blur-lg rounded-xl p-3 border border-white/50">
                  <div className="text-3xl font-bold text-gray-900">{countdown.minutes}</div>
                  <div className="text-xs text-gray-700 mt-1">Minutes</div>
                </div>
                <div className="bg-white/40 backdrop-blur-lg rounded-xl p-3 border border-white/50">
                  <div className="text-3xl font-bold text-gray-900">{countdown.seconds}</div>
                  <div className="text-xs text-gray-700 mt-1">Seconds</div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans.map((plan, index) => (
          <div 
            key={plan.name} 
            className="bg-white/20 backdrop-blur-2xl rounded-2xl shadow-2xl p-6 border border-white/40 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 animate-fadeIn"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="text-center mb-4">
              <div className="text-4xl mb-2">
                {plan.name === 'TRIAL' ? '🆓' : 
                 plan.name === 'BASIC' ? '📦' : 
                 plan.name === 'PREMIUM' ? '⭐' : '👑'}
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.displayName}</h3>
              <div className="text-3xl font-bold text-gray-900 mb-1">
                ₹{plan.price}
              </div>
              <span className="text-sm text-gray-700">/month</span>
            </div>

            <ul className="space-y-2 mb-6">
              {plan.features?.map((feature, idx) => (
                <li key={idx} className="flex items-start text-sm text-gray-900">
                  <FiCheck className="text-green-600 mr-2 mt-1 flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleSubscribe(plan.name)}
              disabled={subscribing || currentPlan?.plan === plan.name}
              className={`w-full py-3 px-4 rounded-xl font-medium transition-all ${
                currentPlan?.plan === plan.name
                  ? 'bg-green-500 text-white cursor-not-allowed'
                  : 'bg-white/30 backdrop-blur-md hover:bg-white/40 text-gray-900 border border-white/40'
              } disabled:opacity-50`}
            >
              {currentPlan?.plan === plan.name ? '✓ Current Plan' : '🚀 Subscribe'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubscriptionPlans;

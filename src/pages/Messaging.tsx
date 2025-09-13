import React from 'react';
import { Messaging } from '@/components/messaging/Messaging';

const MessagingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Real-time Messaging</h1>
          <p className="text-gray-600 mt-2">
            Connect and communicate with your network in real-time
          </p>
        </div>
        
        <Messaging />
      </div>
    </div>
  );
};

export default MessagingPage;

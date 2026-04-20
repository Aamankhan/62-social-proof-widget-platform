import React, { useState, useEffect, useRef } from 'react';
import { usePreview } from '../../contexts/PreviewContext';

// Large random pools
const RANDOM_POOLS = {
  names: [
    'Rahul', 'Anita', 'Priya', 'Amit', 'Neha', 'Vikram', 'Rohan', 'Simran',
    'Karan', 'Meera', 'Pooja', 'Arjun', 'Sneha', 'Aditya', 'Kavya', 'Mohit',
    'Sana', 'Tarun', 'Komal', 'Dev', 'Isha', 'Raj', 'Nidhi', 'Akash'
  ],
  cities: [
    'Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Kolkata', 'Pune', 'Jaipur',
    'Lucknow', 'Hyderabad', 'Noida', 'Gurgaon', 'Ahmedabad', 'Surat', 'Indore'
  ],
  products: [
    'Shoes', 'Watch', 'Laptop', 'Phone', 'Headphones', 'Bag', 'T-Shirt', 'Jeans',
    'Smart TV', 'Tablet', 'Perfume', 'Wallet', 'Sunglasses', 'Camera'
  ]
};

export default function LiveWidgetPreview() {
  const { settings, currentWidget, isVisible } = usePreview();
  const [currentNotification, setCurrentNotification] = useState(null);
  const [showAnimation, setShowAnimation] = useState(false);
  const intervalRef = useRef(null);
  const lastNotificationsRef = useRef([]);

  // Generate random notification
  const generateRandomNotification = () => {
    let notification = {};
    
    if (currentWidget?.type === 'sales') {
      let name, city, product;
      
      // Avoid recent duplicates
      do {
        name = RANDOM_POOLS.names[Math.floor(Math.random() * RANDOM_POOLS.names.length)];
      } while (lastNotificationsRef.current.slice(-5).some(n => n?.name === name));
      
      do {
        city = RANDOM_POOLS.cities[Math.floor(Math.random() * RANDOM_POOLS.cities.length)];
      } while (lastNotificationsRef.current.slice(-5).some(n => n?.city === city));
      
      do {
        product = RANDOM_POOLS.products[Math.floor(Math.random() * RANDOM_POOLS.products.length)];
      } while (lastNotificationsRef.current.slice(-5).some(n => n?.product === product));
      
      notification = { name, city, product };
    } 
    else if (currentWidget?.type === 'visitor') {
      const count = Math.floor(Math.random() * 38) + 12;
      notification = { count };
    }
    else if (currentWidget?.type === 'signup') {
      let name, city;
      do {
        name = RANDOM_POOLS.names[Math.floor(Math.random() * RANDOM_POOLS.names.length)];
      } while (lastNotificationsRef.current.slice(-5).some(n => n?.name === name));
      
      do {
        city = RANDOM_POOLS.cities[Math.floor(Math.random() * RANDOM_POOLS.cities.length)];
      } while (lastNotificationsRef.current.slice(-5).some(n => n?.city === city));
      
      notification = { name, city };
    }
    else {
      const messages = [
        'Limited stock available',
        'Free shipping today',
        'Sale ends tonight',
        'New collection launched',
        'Hurry only few left'
      ];
      notification = { text: messages[Math.floor(Math.random() * messages.length)] };
    }
    
    // Track last notifications
    lastNotificationsRef.current.push(notification);
    if (lastNotificationsRef.current.length > 10) {
      lastNotificationsRef.current.shift();
    }
    
    return notification;
  };

  // Format message
  const formatMessage = (widget, data) => {
    let message = widget?.message || '';
    
    if (!message) {
      if (widget?.type === 'sales') {
        message = '{name} from {city} purchased {product}';
      } else if (widget?.type === 'visitor') {
        message = '{count} people viewing this page';
      } else if (widget?.type === 'signup') {
        message = '{name} from {city} just signed up';
      } else {
        message = '{text}';
      }
    }
    
    if (widget?.type === 'sales') {
      message = message.replace('{name}', data.name || 'Someone');
      message = message.replace('{city}', data.city || 'your city');
      message = message.replace('{product}', data.product || 'an item');
    } else if (widget?.type === 'visitor') {
      message = message.replace('{count}', data.count || 0);
    } else if (widget?.type === 'signup') {
      message = message.replace('{name}', data.name || 'Someone');
      message = message.replace('{city}', data.city || 'your city');
    } else {
      message = message.replace('{text}', data.text || 'Special offer!');
    }
    
    return message;
  };

  useEffect(() => {
    if (isVisible && currentWidget) {
      startInfiniteLoop();
    }
    return () => stopInfiniteLoop();
  }, [isVisible, currentWidget]);

  const startInfiniteLoop = () => {
    stopInfiniteLoop();
    showNextNotification();
    
    intervalRef.current = setInterval(() => {
      showNextNotification();
    }, (currentWidget?.rotationInterval || 5) * 1000);
  };

  const stopInfiniteLoop = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const showNextNotification = () => {
    if (!currentWidget) return;
    
    setShowAnimation(false);
    
    const randomData = generateRandomNotification();
    const message = formatMessage(currentWidget, randomData);
    
    setTimeout(() => {
      setCurrentNotification({ text: message, ...randomData });
      setShowAnimation(true);
    }, 100);
  };

  if (!isVisible || !currentWidget) return null;

  const getPositionClass = () => {
    const positions = {
      'bottom-left': 'bottom-4 left-4',
      'bottom-right': 'bottom-4 right-4',
      'top-right': 'top-4 right-4'
    };
    return positions[currentWidget.position] || 'bottom-4 right-4';
  };

  const getAnimationClass = () => {
    if (!showAnimation) return 'opacity-0 translate-x-full';
    
    const animations = {
      slide: 'transition-all duration-300 translate-x-0 opacity-100',
      fade: 'transition-opacity duration-300 opacity-100',
      bounce: 'animate-bounce'
    };
    return animations[currentWidget.themeSettings?.animation] || animations.slide;
  };

  const getShadowClass = () => {
    const shadows = {
      none: '',
      soft: 'shadow-md',
      medium: 'shadow-lg',
      strong: 'shadow-xl'
    };
    return shadows[currentWidget.themeSettings?.shadowIntensity] || 'shadow-md';
  };

  const getIcon = () => {
    switch (currentWidget.type) {
      case 'sales': return 'fa-solid fa-cart-shopping';
      case 'visitor': return 'fa-solid fa-users';
      case 'signup': return 'fa-solid fa-user-plus';
      default: return 'fa-solid fa-bell';
    }
  };

  const getTimeText = () => {
    const times = ['Just now', '1 min ago', '2 min ago', '3 min ago', '5 min ago'];
    return times[Math.floor(Math.random() * times.length)];
  };

  return (
    <div className={`fixed ${getPositionClass()} z-50 ${getAnimationClass()}`}>
      <div 
        className={`bg-white rounded-lg p-4 min-w-[280px] max-w-md ${getShadowClass()}`}
        style={{
          backgroundColor: currentWidget.themeSettings?.backgroundColor,
          borderRadius: currentWidget.themeSettings?.borderRadius,
          border: `1px solid ${currentWidget.themeSettings?.buttonColor}20`
        }}
      >
        <div className="flex items-start gap-3">
          <div 
            className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: `${currentWidget.themeSettings?.buttonColor}15` }}
          >
            <i 
              className={`${getIcon()} text-lg`}
              style={{ color: currentWidget.themeSettings?.buttonColor }}
            ></i>
          </div>
          <div className="flex-1">
            <p 
              className="text-sm font-medium mb-1"
              style={{ 
                color: currentWidget.themeSettings?.textColor,
                fontSize: currentWidget.themeSettings?.fontSize
              }}
            >
              {currentNotification?.text || currentWidget.message}
            </p>
            <p 
              className="text-xs flex items-center gap-1"
              style={{ color: `${currentWidget.themeSettings?.textColor}80` }}
            >
              <span>🕐</span> {getTimeText()}
            </p>
          </div>
          <button className="text-gray-400 hover:text-gray-600">
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
      </div>
    </div>
  );
}
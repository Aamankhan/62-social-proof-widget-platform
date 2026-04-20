(function() {
    'use strict';
    
    console.log('🎯 Social Proof Widget v5.0');
    
    let config = {
        apiKey: null,
        domain: window.location.hostname,
        widgets: [],
        currentIndex: 0,
        intervalId: null,
        lastNotifications: []
    };
    
    // Random pools for random mode
    const RANDOM_POOLS = {
        names: ['Rahul', 'Anita', 'Priya', 'Amit', 'Neha', 'Vikram', 'Rohan', 'Simran', 'Karan', 'Meera'],
        cities: ['Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Kolkata', 'Pune', 'Jaipur', 'Hyderabad', 'Ahmedabad', 'Lucknow'],
        products: ['Shoes', 'Watch', 'Laptop', 'Phone', 'Headphones', 'Bag', 'T-Shirt', 'Jeans', 'Sunglasses', 'Perfume']
    };
    
    const scriptTag = document.currentScript;
    config.apiKey = scriptTag.getAttribute('data-api-key');
    
    if (!config.apiKey) {
        console.error('❌ API key required');
        return;
    }
    
    // Fetch widgets
    async function fetchWidgets() {
        try {
            const url = `http://localhost:5000/api/embed/widget-data?apiKey=${config.apiKey}&domain=${config.domain}`;
            const response = await fetch(url);
            const data = await response.json();
            
            if (data.success && data.data) {
                config.widgets = data.data.widgets || [];
                console.log(`✅ Found ${config.widgets.length} widget(s)`);
                startWidget();
            }
        } catch (error) {
            console.error('Failed to load widgets:', error);
        }
    }
    
    // Generate random notification
    function generateRandomNotification(widget, settings) {
        const names = settings?.names || RANDOM_POOLS.names;
        const cities = settings?.cities || RANDOM_POOLS.cities;
        const products = settings?.products || RANDOM_POOLS.products;
        
        let name = names[Math.floor(Math.random() * names.length)];
        let city = cities[Math.floor(Math.random() * cities.length)];
        let product = products[Math.floor(Math.random() * products.length)];
        
        return { name, city, product };
    }
    
    // Format message
    function formatMessage(widget, data) {
        let message = widget.message || '';
        
        if (widget.mode === 'manual') {
            return message;
        }
        
        if (widget.mode === 'random') {
            message = message.replace('{name}', data.name || 'Someone');
            message = message.replace('{city}', data.city || 'your city');
            message = message.replace('{product}', data.product || 'an item');
        }
        
        return message;
    }
    
    // Get position styles
    function getPositionStyles(position) {
        const positions = {
            'bottom-left': { bottom: '20px', left: '20px', right: 'auto', top: 'auto' },
            'bottom-right': { bottom: '20px', right: '20px', left: 'auto', top: 'auto' },
            'top-right': { top: '20px', right: '20px', left: 'auto', bottom: 'auto' }
        };
        return positions[position] || positions['bottom-right'];
    }
    
    // Create notification
    function createNotification(widget, message) {
        const div = document.createElement('div');
        const positionStyles = getPositionStyles(widget.position);
        const theme = widget.themeSettings || {};
        
        const icons = { sales: '🛒', visitor: '👥', signup: '🎉', custom: '✨' };
        const icon = icons[widget.type] || '🔔';
        
        Object.assign(div.style, {
            position: 'fixed',
            ...positionStyles,
            backgroundColor: theme.backgroundColor || '#ffffff',
            borderRadius: theme.borderRadius || '12px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
            padding: '16px',
            minWidth: '280px',
            maxWidth: '380px',
            cursor: 'pointer',
            transition: 'all 0.3s ease-in-out',
            border: `1px solid ${theme.buttonColor || '#3b82f6'}30`,
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            zIndex: '1000000',
            opacity: '0',
            transform: 'translateX(100px)'
        });
        
        div.innerHTML = `
            <div style="display: flex; gap: 12px; align-items: flex-start;">
                <div style="width:44px;height:44px;border-radius:50%;background:${theme.buttonColor || '#3b82f6'}15;
                    display:flex;align-items:center;justify-content:center;font-size:22px;">${icon}</div>
                <div style="flex:1;">
                    <p style="margin:0 0 6px 0;font-size:${theme.fontSize || '14px'};color:${theme.textColor || '#1f2937'};
                        font-weight:600;line-height:1.4;">${message}</p>
                    <p style="margin:0;font-size:11px;color:${theme.textColor || '#1f2937'}70;">Just now</p>
                </div>
                <button style="background:none;border:none;color:#9ca3af;cursor:pointer;font-size:18px;">✕</button>
            </div>
        `;
        
        setTimeout(() => { div.style.opacity = '1'; div.style.transform = 'translateX(0)'; }, 50);
        
        div.querySelector('button').addEventListener('click', (e) => {
            e.stopPropagation();
            div.style.opacity = '0';
            div.style.transform = 'translateX(100px)';
            setTimeout(() => div.remove(), 300);
        });
        
        setTimeout(() => {
            if (div.parentNode) {
                div.style.opacity = '0';
                div.style.transform = 'translateX(100px)';
                setTimeout(() => div.remove(), 300);
            }
        }, (widget.rotationInterval || 5) * 1000);
        
        return div;
    }
    
    // Show notification
    function showNotification(widget, container) {
        let message = '';
        let data = {};
        
        if (widget.mode === 'manual') {
            message = widget.message || 'Welcome!';
        } else if (widget.mode === 'random') {
            data = generateRandomNotification(widget, widget.fakeSettings);
            message = formatMessage(widget, data);
        }
        
        if (message) {
            const notification = createNotification(widget, message);
            container.appendChild(notification);
            console.log(`🔔 ${message}`);
        }
    }
    
    // Start rotation
    let isRunning = true;
    let timeoutId = null;
    
    function startRotation() {
        let container = document.getElementById('social-proof-widget');
        if (!container) {
            container = document.createElement('div');
            container.id = 'social-proof-widget';
            document.body.appendChild(container);
        }
        
        const activeWidget = config.widgets.find(w => w.status === true);
        if (!activeWidget) {
            console.log('No active widget');
            return;
        }
        
        showNotification(activeWidget, container);
        
        if (isRunning) {
            timeoutId = setTimeout(startRotation, (activeWidget.rotationInterval || 5) * 1000);
        }
    }
    
    function startWidget() {
        console.log('🚀 Starting widget...');
        isRunning = true;
        setTimeout(startRotation, 2000);
    }
    
    function stopWidget() {
        isRunning = false;
        if (timeoutId) clearTimeout(timeoutId);
    }
    
    fetchWidgets();
    
    window.SocialProofWidget = { start: startWidget, stop: stopWidget, refresh: fetchWidgets };
})();
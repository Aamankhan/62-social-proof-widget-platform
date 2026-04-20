// Test script to verify API connection
const testAPI = async () => {
  const API_URL = 'http://localhost:5000/api';
  const API_KEY = 'sp_your_key_here'; // Replace with your key
  
  try {
    const response = await fetch(`${API_URL}/widgets`, {
      headers: { 'x-api-key': API_KEY }
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ API Connection successful!', data);
    } else {
      console.log('❌ API Connection failed:', response.status, await response.text());
    }
  } catch (error) {
    console.error('❌ Cannot connect to server:', error);
  }
};

testAPI();
const { getGeminiRecommendations } = require('./dist/services/aiService');

// Mock user profile for testing
const testProfile = {
  meNow: "Full-stack developer with 3 years experience in React, Node.js, and TypeScript",
  meNext: "Senior developer role with focus on cloud architecture and team leadership"
};

async function testAIService() {
  console.log('Testing AI service with fallback...');
  
  try {
    const recommendations = await getGeminiRecommendations(testProfile);
    console.log('Recommendations received:', recommendations.length);
    console.log('First recommendation:', JSON.stringify(recommendations[0], null, 2));
  } catch (error) {
    console.error('Test failed:', error);
  }
}

testAIService(); 
import axios from 'axios';

const OPENAI_API_KEY = 'GITHUB';

const openaiApi = axios.create({
  baseURL: 'https://api.openai.com/v1',
  headers: {
    'Authorization': `Bearer ${OPENAI_API_KEY}`,
    'Content-Type': 'application/json',
    'OpenAI-Beta': 'assistants=v2', // Use assistants=v2 for the Assistant API
  },
});

export const getOpenAIResponse = async (prompt) => {
  try {
    const response = await openaiApi.post('/chat/completions', {
      model: 'gpt-3.5-turbo', // Use your assistant ID here
      messages: [{ role: 'user', content: prompt }],
    });
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('Error fetching OpenAI response:', error);
    return 'Sorry, something went wrong.';
  }
};

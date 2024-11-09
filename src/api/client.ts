import axios from 'axios';

const API_KEY = 'PNDrNUbJ67vFKscO4ApB7cq1X00iuHddSetFpbwPK7NvSsI63n62PzWRkiXK';
const BASE_URL = 'https://cricket.sportmonks.com/api/v2.0';

export const api = axios.create({
  baseURL: BASE_URL,
  params: {
    api_token: API_KEY
  },
  timeout: 10000
});

// Add response interceptor for better error handling
api.interceptors.response.use(
  response => response.data.data,
  error => {
    const errorMessage = error.response?.data?.message || error.message;
    console.error('API Error:', errorMessage);
    
    // Enhance error object with custom message
    throw new Error(
      error.response?.status === 401 
        ? 'Invalid API key. Please check your credentials.'
        : `Failed to fetch data: ${errorMessage}`
    );
  }
);

export const fetchLiveMatches = async (): Promise<Match[]> => {
  try {
    const response = await api.get('/fixtures', {
      params: {
        include: 'localteam,visitorteam,venue',
        filter: {
          status: ['NS', 'IN']
        }
      }
    });
    return response || [];
  } catch (error) {
    throw error;
  }
};

export const fetchMatchDetails = async (matchId: number): Promise<Match> => {
  try {
    const response = await api.get(`/fixtures/${matchId}`, {
      params: {
        include: 'localteam,visitorteam,batting,bowling,scoreboards,balls'
      }
    });
    return response;
  } catch (error) {
    throw error;
  }
};
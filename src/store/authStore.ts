import { create } from 'zustand';
import axios from 'axios';

export enum ViewPages {
    MEMBERS = 'members',
    INVENTORY = 'inventory',
    CONTRACTS = 'contracts',
    LOGIN = 'login',
    REGISTER = 'register',
    LEADS = 'leads',
}

interface AuthState {
  user: any;
  token: string | null;
  isAuthenticated: boolean;
  currentView: ViewPages; 
  lastView: ViewPages;
  login: (token: string) => void;
  logout: () => void;
  fetchUser: () => void;
  setView: (view: ViewPages) => void;
  checkAuth: () => void;
}

const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: localStorage.getItem('authToken'),  // Ensure you get the correct token key
  isAuthenticated: !!localStorage.getItem('authToken'),
  currentView: ViewPages.LOGIN,  // Initial view
    lastView: ViewPages.MEMBERS,

    setLastView: (view:ViewPages) => set({ lastView: view }),


  // Login function saves token and sets headers for future requests
  login: (token: string) => {
    console.log('Received token from server:', token);  // Log token for debugging
  
    if (!token) {
      console.error('No token received, cannot proceed with login.');
      return;
    }
  
    // Save the token to localStorage
    localStorage.setItem('authToken', token);
    console.log('Token saved to localStorage:', localStorage.getItem('authToken'));  // Confirm it's saved
  
    // Set axios default Authorization header
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  
    // Update Zustand state
    set({
      token,
      isAuthenticated: true,
      currentView: ViewPages.MEMBERS,  // Redirect to members after login
    });
  
    // Fetch user details after login
    useAuthStore.getState().fetchUser();
  },
  

  // Check if there's a token in localStorage on app initialization
  checkAuth: () => {
    const token = localStorage.getItem('authToken');
    const lastView = localStorage.getItem('lastView') as ViewPages;

    console.log('Token retrieved from localStorage:', token);  // Log the token for debugging
  
    if (token) {
      // Set the Authorization header for all future requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      console.log('Authorization header set after page refresh:', `Bearer ${token}`);
      // Update Zustand state to mark the user as authenticated
      set({
        isAuthenticated: true,
        token,
        currentView: lastView,  // Restore the last view
        lastView: lastView,
  
      });
  
      // Fetch the user details from the server
      useAuthStore.getState().fetchUser();
    } else {
      // If no token is found, mark the user as not authenticated
      console.warn('No token found in localStorage, user is not authenticated.');
      set({
        isAuthenticated: false,
        token: null,
      });
      
    }
  },
  // Logout function clears token and resets state
  logout: () => {
    localStorage.removeItem('authToken');  // Remove token from localStorage
    delete axios.defaults.headers.common['Authorization'];  // Remove axios auth header
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      currentView: ViewPages.LOGIN,
    });
  },

  // Fetch user data from server
  fetchUser: async () => {
    const token = useAuthStore.getState().token;  // Get token from Zustand state
    if (token) {
      try {
        console.log('Token being used for fetchUser:', token);  // Log token before making request
        const response = await axios.get('http://localhost:5000/api/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`,  // Ensure the correct token is sent in the header
          },
        });
        set({ user: response.data });  // Set user data in Zustand state
      } catch (error) {
        console.error('Failed to fetch user data', error);
        useAuthStore.getState().logout();  // Logout if user fetching fails
      }
    }
  },
  // Change current view
  setView: (view: ViewPages) => {
    localStorage.setItem('lastView', view);  // Save last view in localStorage
    set({ currentView: view, lastView: view })
},
}));

export default useAuthStore;

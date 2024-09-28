import axios, { AxiosResponse } from 'axios';

interface ApiResponse<T> {
  data: T;
  message?: string;
}

interface ApiError {
  message: string;
  statusCode?: number;
}

class ApiService {
  private apiUrl: string;

  constructor() {
    this.apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
  }

  // Generic GET request
  public async get<T>(endpoint: string): Promise<ApiResponse<T> | ApiError> {
    try {
      const response: AxiosResponse<T> = await axios.get(`${this.apiUrl}${endpoint}`);
      return { data: response.data };
    } catch (error: any) {
      return this.handleError(error);
    }
  }

  // Generic POST request
  public async post<T>(endpoint: string, payload: any): Promise<ApiResponse<T> | ApiError> {
    try {
      const response: AxiosResponse<T> = await axios.post(`${this.apiUrl}${endpoint}`, payload);
      return { data: response.data };
    } catch (error: any) {
      return this.handleError(error);
    }
  }

  // Generic PUT request
  public async put<T>(endpoint: string, payload: any): Promise<ApiResponse<T> | ApiError> {
    try {
      const response: AxiosResponse<T> = await axios.put(`${this.apiUrl}${endpoint}`, payload);
      return { data: response.data };
    } catch (error: any) {
      return this.handleError(error);
    }
  }

  // Generic DELETE request
  public async delete<T>(endpoint: string): Promise<ApiResponse<T> | ApiError> {
    try {
      const response: AxiosResponse<T> = await axios.delete(`${this.apiUrl}${endpoint}`);
      return { data: response.data };
    } catch (error: any) {
      return this.handleError(error);
    }
  }

  // Error handling function
  private handleError(error: any): ApiError {
    if (axios.isAxiosError(error)) {
      return {
        message: error.response?.data?.message || 'An error occurred',
        statusCode: error.response?.status,
      };
    } else {
      return {
        message: 'An unexpected error occurred',
      };
    }
  }
}
const apiService = new ApiService();
export default apiService;

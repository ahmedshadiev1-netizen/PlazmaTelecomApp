import axios, { AxiosInstance, AxiosResponse } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  API_STORAGE_KEY,
  API_TIMEOUT_MS,
  getDefaultBaseUrl,
  sanitizeBaseUrl,
} from '../config/api';

interface LoginResponse {
  access_token: string;
  token_type: string;
}

interface Contract {
  id: string;
  number: string;
  balance: number;
  status: string;
  accounts_count: number;
}

interface Account {
  id: string;
  contract_id: string;
  tariff_name: string;
  status: string;
  balance: number;
  service_rent: number;
  current_shape: number;
  agent_type: string;
}

interface PeriodicService {
  id: string;
  vgid: string;
  description: string;
  quantity: number;
  price: number;
  total_cost: number;
  category: string;
  tariff_id: string;
  first_on: string;
  comment: string | null;
}

interface PromisePaymentRequest {
  amount: number;
  description: string;
}

interface PromisePaymentResponse {
  status: string;
  contract_id: number;
  amount: number;
  result: any;
  message?: string;
}

class ApiService {
  private static instance: ApiService;
  private api: AxiosInstance;
  private baseURL: string;
  private readonly appVersion = '1.0.0';

  constructor() {
    this.baseURL = sanitizeBaseUrl(getDefaultBaseUrl());
    this.api = this.createAxiosInstance(this.baseURL);
    this.bootstrapBaseUrl();
  }

  static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }

  private createAxiosInstance(baseURL: string): AxiosInstance {
    const instance = axios.create({
      baseURL,
      timeout: API_TIMEOUT_MS,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store',
        'X-Client-Version': this.appVersion,
      },
    });

    instance.interceptors.request.use(
      async (config) => {
        const token = await AsyncStorage.getItem('auth_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    instance.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          await AsyncStorage.removeItem('auth_token');
        }
        return Promise.reject(error);
      }
    );

    return instance;
  }

  private async bootstrapBaseUrl() {
    try {
      const stored = await AsyncStorage.getItem(API_STORAGE_KEY);
      if (stored) {
        this.setBaseUrl(stored, false);
      }
    } catch (error) {
      console.warn('Failed to load stored API base URL', error);
    }
  }

  getBaseUrl(): string {
    return this.baseURL;
  }

  async setBaseUrl(url: string, persist = true): Promise<void> {
    const sanitized = sanitizeBaseUrl(url);
    if (sanitized === this.baseURL) {
      return;
    }
    this.baseURL = sanitized;
    this.api = this.createAxiosInstance(this.baseURL);
    if (persist) {
      await AsyncStorage.setItem(API_STORAGE_KEY, sanitized);
    }
  }

  // Authentication
  async login(username: string, password: string): Promise<LoginResponse> {
    const payload = `username=${encodeURIComponent(
      username
    )}&password=${encodeURIComponent(password)}&grant_type=password`;

    const response: AxiosResponse<LoginResponse> = await this.api.post(
      '/auth/login',
      payload,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    if (response.data.access_token) {
      await AsyncStorage.setItem('auth_token', response.data.access_token);
    }

    return response.data;
  }

  async logout(): Promise<void> {
    await AsyncStorage.removeItem('auth_token');
  }

  // Contracts
  async getContracts(): Promise<Contract[]> {
    const response: AxiosResponse<Contract[]> = await this.api.get('/contracts');
    return response.data;
  }

  async getContractDetails(contractId: string): Promise<Contract> {
    const response: AxiosResponse<Contract> = await this.api.get(`/contracts/${contractId}`);
    return response.data;
  }

  async getContractBalance(contractId: string): Promise<{ balance: number }> {
    const response: AxiosResponse<{ balance: number }> = await this.api.get(`/contracts/${contractId}/balance`);
    return response.data;
  }

  async getContractAccounts(contractId: string): Promise<Account[]> {
    const response: AxiosResponse<Account[]> = await this.api.get(`/contracts/${contractId}/accounts`);
    return response.data;
  }

  // Accounts
  async getAccounts(): Promise<Account[]> {
    const response: AxiosResponse<Account[]> = await this.api.get('/accounts');
    return response.data;
  }

  async getAccountDetails(accountId: string): Promise<Account> {
    const response: AxiosResponse<Account> = await this.api.get(`/accounts/${accountId}`);
    return response.data;
  }

  async getAccountPeriodicServices(accountId: string): Promise<PeriodicService[]> {
    const response: AxiosResponse<PeriodicService[]> = await this.api.get(
      `/accounts/${accountId}/services`
    );
    return response.data;
  }

  // Payments
  async activatePromisePayment(contractId: string, payment: PromisePaymentRequest): Promise<PromisePaymentResponse> {
    const response: AxiosResponse<PromisePaymentResponse> = await this.api.post(
      `/contracts/${contractId}/promise-payment`,
      payment
    );
    return response.data;
  }

  // Tariffs
  async getTariffDetails(tariffId: string): Promise<any> {
    const response: AxiosResponse<any> = await this.api.get(`/tariffs/${tariffId}`);
    return response.data;
  }

  // Health check
  async healthCheck(): Promise<{ status: string }> {
    const response: AxiosResponse<{ status: string }> = await this.api.get('/admin/health');
    return response.data;
  }

  // Check if user is authenticated
  async isAuthenticated(): Promise<boolean> {
    const token = await AsyncStorage.getItem('auth_token');
    return !!token;
  }

  // Get current token
  async getToken(): Promise<string | null> {
    return await AsyncStorage.getItem('auth_token');
  }
}

export default ApiService;

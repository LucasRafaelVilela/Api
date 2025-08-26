import axios from 'axios';
import type { AxiosInstance, AxiosResponse } from 'axios';
import type { Author, Book } from '../types/api';

export class ApiClient {
  private client: AxiosInstance;

  constructor(baseURL: string, timeout = 10000) {
    this.client = axios.create({
      baseURL,
      timeout,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });
  }

  // Authors endpoints
  async getAuthors(): Promise<AxiosResponse<Author[]>> {
    return this.client.get('/api/authors');
  }

  async createAuthor(data: { nome: string; bio?: string }): Promise<AxiosResponse<Author>> {
    return this.client.post('/api/authors', data);
  }

  async getAuthor(id: number): Promise<AxiosResponse<Author>> {
    return this.client.get(`/api/authors/${id}`);
  }

  async updateAuthor(id: number, data: { nome?: string; bio?: string }): Promise<AxiosResponse<Author>> {
    return this.client.put(`/api/authors/${id}`, data);
  }

  async deleteAuthor(id: number): Promise<AxiosResponse<void>> {
    return this.client.delete(`/api/authors/${id}`);
  }

  async getAuthorBooks(id: number): Promise<AxiosResponse<Book[]>> {
    return this.client.get(`/api/authors/${id}/books`);
  }

  // Books endpoints
  async getBooks(): Promise<AxiosResponse<Book[]>> {
    return this.client.get('/api/books');
  }

  async createBook(data: {
    titulo: string;
    autor_id: number;
    ano_publicacao?: number;
    paginas?: number;
    genero?: string;
    disponivel?: boolean;
  }): Promise<AxiosResponse<Book>> {
    return this.client.post('/api/books', data);
  }

  async getBook(id: number): Promise<AxiosResponse<Book>> {
    return this.client.get(`/api/books/${id}`);
  }

  async updateBook(id: number, data: {
    titulo?: string;
    autor_id?: number;
    ano_publicacao?: number;
    paginas?: number;
    genero?: string;
    disponivel?: boolean;
  }): Promise<AxiosResponse<Book>> {
    return this.client.put(`/api/books/${id}`, data);
  }

  async deleteBook(id: number): Promise<AxiosResponse<void>> {
    return this.client.delete(`/api/books/${id}`);
  }

  // Utility method to test if API is reachable
  async testConnection(): Promise<boolean> {
    try {
      await this.client.get('/api/authors');
      return true;
    } catch {
      return false;
    }
  }
}
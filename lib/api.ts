const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  platform: 'n8n' | 'zapier' | 'make';
  workflowJson?: string;
  createdAt?: string;
}

export interface CreateProductInput {
  title: string;
  description: string;
  price: number;
  platform: 'n8n' | 'zapier' | 'make';
  workflowJson: string;
}

// Token helper
export const getAdminToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('admin_token');
  }
  return null;
};

export const setAdminToken = (token: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('admin_token', token);
  }
};

export const removeAdminToken = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('admin_token');
  }
};

// Base fetch wrapper
async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAdminToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: response.statusText }));
    const message = Array.isArray(errorData.message)
      ? errorData.message.join(', ')
      : errorData.message;
    throw new Error(message || 'حدث خطأ في الاتصال بالخادم');
  }

  // Handle 204 No Content safely
  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

// Admin Auth
export async function loginAdmin(email: string, password: string): Promise<{ accessToken: string }> {
  const data = await apiFetch<{ accessToken: string }>('/admin/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  if (data.accessToken) {
    setAdminToken(data.accessToken);
  }
  return data;
}

export async function registerAdmin(email: string, password: string): Promise<{ accessToken: string }> {
  const data = await apiFetch<{ accessToken: string }>('/admin/register', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  if (data.accessToken) {
    setAdminToken(data.accessToken);
  }
  return data;
}

// Products API
export async function getProducts(): Promise<Product[]> {
  return apiFetch<Product[]>('/products');
}

export async function getProductById(id: string): Promise<Product> {
  return apiFetch<Product>(`/products/${id}`);
}

export async function createProduct(product: CreateProductInput): Promise<Product> {
  return apiFetch<Product>('/admin/products', {
    method: 'POST',
    body: JSON.stringify(product),
  });
}

export async function deleteProduct(id: string): Promise<{ success: boolean }> {
  return apiFetch<{ success: boolean }>(`/admin/products/${id}`, {
    method: 'DELETE',
  });
}

// Orders API
export async function createOrder(productId: string, customerEmail: string): Promise<{ checkoutUrl: string }> {
  return apiFetch<{ checkoutUrl: string }>('/orders', {
    method: 'POST',
    body: JSON.stringify({ productId, customerEmail }),
  });
}

// Download JSON (Public endpoint protected by Order ID & Paid Status in Backend)
export async function downloadOrderJson(orderId: string): Promise<Blob> {
  const response = await fetch(`${API_BASE_URL}/orders/${orderId}/download`);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: response.statusText }));
    const message = Array.isArray(errorData.message)
      ? errorData.message.join(', ')
      : errorData.message;
    throw new Error(message || 'فشل تنزيل ملف الـ JSON أو الطلب غير مكتمل');
  }

  return response.blob();
}

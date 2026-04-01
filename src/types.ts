export type UserRole = 'client' | 'admin';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  role: UserRole;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  description?: string;
  order?: number;
}

export type ServiceType = 'digital' | 'physical';
export type ServiceMode = 'fixed' | 'quote';

export interface Service {
  id: string;
  name: string;
  shortDescription: string;
  fullDescription: string;
  categoryId: string;
  type: ServiceType;
  mode: ServiceMode;
  price: number;
  estimatedTime: string;
  location?: string;
  imageUrl: string;
  active: boolean;
  createdAt: string;
}

export type OrderStatus = 'pending' | 'processing' | 'completed' | 'cancelled';

export interface Order {
  id: string;
  userId: string;
  serviceId: string;
  status: OrderStatus;
  price: number;
  briefing: string;
  attachments: string[];
  providerId?: string;
  createdAt: string;
  updatedAt: string;
}

export type QuoteStatus = 'requested' | 'quoted' | 'accepted' | 'rejected' | 'completed';

export interface Quote {
  id: string;
  userId: string;
  serviceId: string;
  status: QuoteStatus;
  quotedPrice?: number;
  briefing: string;
  attachments: string[];
  providerId?: string;
  response?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  userId: string;
  serviceId: string;
  orderId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  link?: string;
  createdAt: any;
}

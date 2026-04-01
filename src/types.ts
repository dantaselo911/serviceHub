export type UserRole = 'client' | 'admin';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  role: UserRole;
  balance: number;
  favorites?: string[];
  createdAt: any;
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
  discountAmount?: number;
  couponCode?: string;
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
  discountAmount?: number;
  couponCode?: string;
  briefing: string;
  attachments: string[];
  providerId?: string;
  createdAt: string;
  updatedAt: string;
}

export type DiscountType = 'percentage' | 'fixed';

export interface Coupon {
  id: string;
  code: string;
  description: string;
  discountType: DiscountType;
  discountValue: number;
  appliesToCategory: string | null;
  appliesToService: string | null;
  minimumOrderValue: number;
  usageLimit: number;
  usedCount: number;
  expiresAt: string;
  active: boolean;
  createdAt: any;
}

export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  type: 'deposit' | 'payment' | 'refund' | 'adjustment';
  status: 'pending' | 'completed' | 'failed';
  description: string;
  transactionId?: string;
  createdAt: any;
}

export type ChatType = 'support' | 'order';
export type ChatStatus = 'open' | 'closed';

export interface Chat {
  id: string;
  userId: string;
  orderId?: string;
  type: ChatType;
  status: ChatStatus;
  lastMessage?: string;
  lastMessageAt?: any;
  unreadCount?: { [uid: string]: number };
  createdAt: any;
  updatedAt: any;
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  text: string;
  attachments?: string[];
  createdAt: any;
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

export interface Review {
  id: string;
  serviceId: string;
  userId: string;
  userName: string;
  userPhoto: string;
  rating: number;
  comment: string;
  createdAt: any;
}

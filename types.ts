export enum DietaryTag {
  VEGAN = 'Vegan',
  GF = 'Gluten Free',
  DF = 'Dairy Free',
  SPICY = 'Spicy',
  NUT_FREE = 'Nut Free'
}

export enum SpiceLevel {
  NONE = 0,
  MILD = 1,
  MEDIUM = 2,
  HOT = 3,
  EXTRA_HOT = 4
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  tags: DietaryTag[];
  calories?: number;
}

export interface CustomizationOptions {
  lowSalt: boolean;
  lowSugar: boolean;
  lowOil: boolean;
  spiceLevel: SpiceLevel;
  allergyNotes: string;
  specialRequests: string;
}

export interface OrderItem {
  cartId: string;
  menuItem: MenuItem;
  customization: CustomizationOptions;
  quantity: number;
}

export interface AiAnalysisResult {
  safe: boolean;
  message: string;
  kitchenTicketSummary?: string;
}

export interface Order {
  id: string;
  tableNumber: string;
  customerName?: string;
  items: OrderItem[];
  status: 'pending' | 'completed';
  timestamp: Date;
  analysisResults?: Record<string, AiAnalysisResult>;
}

export interface CustomerSession {
  tableNumber: string;
  customerName: string;
}
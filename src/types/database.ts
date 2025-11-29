export interface User {
  id: string;
  username: string;
  email: string;
  avatar_url?: string;
  bio?: string;
  created_at: string;
}

export interface Location {
  id: string;
  name: string;
  address?: string;
  location_type: 'hostel' | 'canteen' | 'restaurant';
  opening_hours?: string;
  created_at: string;
}

export interface FoodItem {
  id: string;
  location_id: string;
  name: string;
  description?: string;
  category_id: string;
  is_vegetarian: boolean;
  is_vegan: boolean;
  spice_level?: number;
  allergens?: string[];
  image_url?: string;
  created_at: string;
}

export interface FoodCategory {
  id: string;
  name: string;
  description?: string;
}

export interface Review {
  id: string;
  food_item_id: string;
  user_id: string;
  rating: number;
  review_text?: string;
  price_paid?: number;
  portion_size?: 'small' | 'medium' | 'large';
  wait_time_minutes?: number;
  image_url?: string;
  created_at: string;
  updated_at: string;
  user?: User;
}

export interface Favorite {
  id: string;
  user_id: string;
  food_item_id: string;
  created_at: string;
}

export interface ReviewLike {
  id: string;
  review_id: string;
  user_id: string;
  created_at: string;
}

export interface FoodItemRating {
  food_item_id: string;
  food_item_name: string;
  location_name: string;
  average_rating: number;
  review_count: number;
  average_price: number;
}

export interface LocationRating {
  location_id: string;
  location_name: string;
  location_type: string;
  average_rating: number;
  review_count: number;
}

export interface PopularFoodItem extends FoodItemRating {
  location_id: string;
  description?: string;
  category_id: string;
  is_vegetarian: boolean;
  is_vegan: boolean;
  image_url?: string;
}

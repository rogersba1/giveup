export type Category = 'clothing' | 'toy' | 'accessory';
export type AgeGroup = 'baby' | 'toddler' | 'preschooler' | 'child';
export type Gender = 'boy' | 'girl' | 'neutral';
export type ItemState = 'new' | 'like-new' | 'used';

export interface Item {
  id: string;
  userId: string;
  title: string;
  description: string;
  category: Category;
  ageGroup: AgeGroup;
  gender: Gender;
  size?: string;
  state: ItemState;
  imageUrls: string[];
  createdAt: Date;
  updatedAt: Date;
  isAvailable: boolean;
}

export interface ItemFormData {
  title: string;
  description: string;
  category: Category;
  ageGroup: AgeGroup;
  gender: Gender;
  size?: string;
  state: ItemState;
  images: File[];
}
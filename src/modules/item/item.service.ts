import { itemRepository } from './item.repository';
import type { ItemCreateInput, ItemUpdateInput } from './item.validation';
import type { IItem } from './item.model';

export const itemService = {
  getAllItems: async (queryStr: Record<string, unknown> = {}): Promise<IItem[]> => {
    return itemRepository.findAll(queryStr);
  },

  getItemById: async (id: string): Promise<IItem | null> => {
    const item = await itemRepository.findById(id);
    if (!item) {
      throw new Error('Item not found');
    }
    return item;
  },

  createItem: async (data: ItemCreateInput): Promise<IItem> => {
    return itemRepository.create(data);
  },

  updateItem: async (id: string, data: ItemUpdateInput): Promise<IItem | null> => {
    const existing = await itemRepository.findById(id);
    if (!existing) {
      throw new Error('Item not found');
    }
    return itemRepository.updateById(id, data);
  },

  deleteItem: async (id: string): Promise<IItem | null> => {
    const existing = await itemRepository.findById(id);
    if (!existing) {
      throw new Error('Item not found');
    }
    return itemRepository.deleteById(id);
  },

  getUserItems: async (userId: string): Promise<IItem[]> => {
    return itemRepository.findAll({ createdBy: userId });
  },
};

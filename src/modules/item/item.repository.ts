import Item, { type IItem } from './item.model';
import ApiFeatures from '../../utils/ApiFeatures';

export const itemRepository = {
  create: async (data: Partial<IItem>): Promise<IItem> => {
    return await Item.create(data);
  },

  findById: async (id: string): Promise<IItem | null> => {
    return await Item.findById(id);
  },

  findAll: async (queryStr: Record<string, unknown> = {}): Promise<IItem[]> => {
    const features = new ApiFeatures(Item.find(), queryStr)
      .search(['title', 'shortDescription', 'description'])
      .filter()
      .sort()
      .paginate();

    return await features.getQuery();
  },

  updateById: async (id: string, data: Partial<IItem>): Promise<IItem | null> => {
    return await Item.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  },

  deleteById: async (id: string): Promise<IItem | null> => {
    return await Item.findByIdAndDelete(id);
  },

  count: async (filter = {}): Promise<number> => {
    return await Item.countDocuments(filter);
  },
};

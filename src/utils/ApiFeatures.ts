import type { Query } from 'mongoose';

class ApiFeatures<T> {
  private query: Query<T[], T>;
  private queryStr: Record<string, unknown>;

  constructor(query: Query<T[], T>, queryStr: Record<string, unknown>) {
    this.query = query;
    this.queryStr = queryStr;
  }

  search(searchFields: string[]) {
    const search = this.queryStr.search as string;
    if (search) {
      this.query = this.query.find({
        $or: searchFields.map((field) => ({
          [field]: { $regex: search, $options: 'i' },
        })),
      });
    }
    return this;
  }

  filter() {
    const queryObj = { ...this.queryStr };
    const excludeFields = ['search', 'sort', 'page', 'limit', 'fields'];
    excludeFields.forEach((el) => delete queryObj[el]);

    // Handle price range
    if (queryObj.priceMin || queryObj.priceMax) {
      const priceFilter: Record<string, number> = {};
      if (queryObj.priceMin) {
        priceFilter.$gte = Number(queryObj.priceMin);
        delete queryObj.priceMin;
      }
      if (queryObj.priceMax) {
        priceFilter.$lte = Number(queryObj.priceMax);
        delete queryObj.priceMax;
      }
      queryObj.price = priceFilter;
    }

    this.query = this.query.find(queryObj);
    return this;
  }

  sort() {
    const sort = this.queryStr.sort as string;
    if (sort) {
      const sortBy = sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  paginate() {
    const page = Number(this.queryStr.page) || 1;
    const limit = Number(this.queryStr.limit) || 10;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);
    return this;
  }

  getQuery() {
    return this.query;
  }
}

export default ApiFeatures;

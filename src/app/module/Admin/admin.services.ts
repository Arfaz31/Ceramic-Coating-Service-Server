import QueryBuilder from '../../Builder/QueryBuilder';
import { adminSearchableFields } from './admin.constant';
import { Admin } from './admin.model';

const getAlladminsFromDB = async (query: Record<string, unknown>) => {
  const adminQuery = new QueryBuilder(Admin.find(), query)
    .search(adminSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await adminQuery.modelQuery;
  const meta = await adminQuery.countTotal();
  return {
    result,
    meta,
  };
};

export const AdminService = {
  getAlladminsFromDB,
};

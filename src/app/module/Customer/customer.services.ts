import QueryBuilder from '../../Builder/QueryBuilder';
import { customerSearchableFields } from './customer.constant';
import { Customer } from './customer.model';

const getAllCustomersFromDB = async (query: Record<string, unknown>) => {
  const customerQuery = new QueryBuilder(Customer.find(), query)
    .search(customerSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await customerQuery.modelQuery;
  const meta = await customerQuery.countTotal();
  return {
    result,
    meta,
  };
};

export const CustomerService = {
  getAllCustomersFromDB,
};

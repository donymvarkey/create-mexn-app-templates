import { hashSync, genSaltSync, compareSync } from 'bcrypt';

const hashPassword = (password) => {
  return hashSync(password, genSaltSync(10));
};

const comparePassword = (password, hashedPassword) => {
  return compareSync(password, hashedPassword);
};

const getPaginatedData = async (model, pageNo, size = 10) => {
  const q = {};
  q.skip = size * (pageNo - 1);
  q.limit = size;
  const data = await model.find({}, {}, q);
  return data;
};

export default {
  hashPassword,
  comparePassword,
  getPaginatedData,
};

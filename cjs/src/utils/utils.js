const bcrypt = require('bcryptjs');

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

const comparePassword = async (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
};

const getPaginatedData = async (model, pageNo = 1, size = 10, filter = {}) => {
  const page = Math.max(1, parseInt(pageNo, 10) || 1);
  const limit = Math.max(1, parseInt(size, 10) || 10);
  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    model.find(filter).skip(skip).limit(limit),
    model.countDocuments(filter),
  ]);

  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

module.exports = {
  hashPassword,
  comparePassword,
  getPaginatedData,
};

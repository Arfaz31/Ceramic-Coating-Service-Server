import dotenv from 'dotenv';

dotenv.config();

export const config = {
  NODE_ENV: process.env.NODE_ENV,
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL,

  cloudinary_cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  cloudinary_api_key: process.env.CLOUDINARY_API_KEY,
  cloudinary_api_secret: process.env.CLOUDINARY_API_SECRET,

  SUPERADMIN: {
    NAME: process.env.SUPERADMIN_NAME || '',
    EMAIL: process.env.SUPERADMIN_EMAIL || '',
    CONTACT: process.env.SUPERADMIN_CONTACT || '',
    USERNAME: process.env.SUPERADMIN_USERNAME || '',
    PASSWORD: process.env.SUPERADMIN_PASSWORD || '',
    GENDER: process.env.SUPERADMIN_GENDER || '',
    ROLE: process.env.SUPERADMIN_ROLE || '',
    IS_DELETED: process.env.SUPERADMIN_ISDELETED,
  },

  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
  jwt_access_secret: process.env.JWT_ACCESS_SECRET,
  jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
  jwt_access_expire_in: process.env.JWT_ACCESS_EXPIRES_IN,
  jwt_refresh_expire_in: process.env.JWT_REFRESH_EXPIRES_IN,
  reset_pass_secret: process.env.RESET_PASS_TOKEN,
  reset_pass_expire_in: process.env.RESET_PASS_EXPIRES_IN,
  reset_pass_link: process.env.RESET_PASS_LINK,
};

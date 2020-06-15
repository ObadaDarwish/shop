const env_variables = {
    DB_USER: process.env.DEV_DB_USER,
    DB_PASS: process.env.DEV_DB_PASS,
    JWT_SECRET:process.env.DEV_JWT_SECRET,
    SENDGRID_API_KEY:process.env.DEV_SENDGRID_API_KEY,
    STRIPE_KEY:process.env.DEV_STRIPE_SECRET_KEY
};
const prod_variables = {
    DB_USER: process.env.DB_USER,
    DB_PASS: process.env.DB_PASS,
    JWT_SECRET:process.env.JWT_SECRET,
    SENDGRID_API_KEY:process.env.SENDGRID_API_KEY,
    STRIPE_KEY:process.env.STRIPE_SECRET_KEY
};
module.exports = process.env.NODE_ENV === 'production' ? prod_variables : env_variables;

require('dotenv').config();

const ADMIN_PASSKEY = process.env.ADMIN_PASSKEY || 'pranjay_admin_45';

function requireAdmin(req, res, next) {
  const providedKey = req.headers['x-admin-key'] || req.body.adminKey || req.query.adminKey;
  
  if (!providedKey || providedKey !== ADMIN_PASSKEY) {
    return res.status(401).json({
      success: false,
      error: 'Invalid Admin Passkey. Only Pranjay has edit and upload access.'
    });
  }
  
  req.isAdmin = true;
  next();
}

function verifyAdminKey(key) {
  return Boolean(key && key === ADMIN_PASSKEY);
}

module.exports = {
  requireAdmin,
  verifyAdminKey,
  ADMIN_PASSKEY
};

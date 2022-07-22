const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = (roles) => function (req, res, next) {
  if (req.method === 'OPTIONS') {
    return next();
  }

  try {
    const token = req.headers.authorization.split(' ')[1];

    if (!token) {
      res.status(401).json({ message: 'Відсутня авторизація' });
    }

    const { roles: userRoles } = jwt.verify(token, 'jwtSecret');
    let hasRole = false;
    userRoles.forEach((role) => {
      if (roles.includes(role)) {
        hasRole = true;
      }
    });

    if (!hasRole) {
      res.status(401).json({ message: 'Немає доступу' });
    }

    next();
  } catch (e) {
    res.status(401).json({ message: 'Відсутня авторизація' });
  }
};

import jwt from 'jsonwebtoken';

export function withAuth(handler) {
  return async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return res.status(401).json({ error: 'No token provided' });
      }

      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = decoded; // { userId, role }
      return handler(req, res);
    } catch (error) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
  };
}

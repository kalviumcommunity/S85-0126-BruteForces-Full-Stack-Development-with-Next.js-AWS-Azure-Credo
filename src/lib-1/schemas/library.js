import { withAuth } from '@/middleware/withAuth';
import { hasPermission } from '@/lib/permissions';

function handler(req, res) {
  const { role } = req.user;

  const allowed = hasPermission(role, 'delete');

  console.log(
    `[RBAC] ${role} attempted DELETE: ${allowed ? 'ALLOWED' : 'DENIED'}`
  );

  if (!allowed) {
    return res.status(403).json({
      error: 'Access denied: insufficient permissions',
    });
  }

  // Delete logic here
  return res.status(200).json({
    message: 'Resource deleted successfully',
  });
}

export default withAuth(handler);

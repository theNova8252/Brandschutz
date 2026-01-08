// backend/middleware/requireSpecial.js
import { requireRole } from './requireRole.js';
export default requireRole('ADMIN');

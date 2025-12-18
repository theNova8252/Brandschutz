import express from 'express';
import Certificate from '../models/certificate.js';
import User from '../models/User.js';

const router = express.Router();

router.get('/verify/:id', async (req, res) => {
  const cert = await Certificate.findOne({
    where: { certificateId: req.params.id },
    include: [{ model: User, attributes: ['name', 'email'] }],
  });

  if (!cert) {
    return res.status(404).json({ valid: false });
  }

  res.json({
    valid: true,
    name: cert.User.name,
    issuedAt: cert.issuedAt,
  });
});

export default router;

import Role from '../models/Role.js';
import UserRole from '../models/UserRole.js';
import User from '../models/User.js';

function parseBootstrapAdminEmails() {
  const envList = (process.env.BOOTSTRAP_ADMIN_EMAILS || '').trim();
  const legacySingle = (process.env.BOOTSTRAP_ADMIN_EMAIL || '').trim();

  const source = envList || legacySingle;
  if (!source) return [];

  return [...new Set(
    source
      .split(',')
      .map(email => email.trim().toLowerCase())
      .filter(Boolean),
  )];
}

export async function seedRoles() {
  // Rollen sicherstellen
  const [userRole] = await Role.findOrCreate({ where: { name: 'USER' } });
  const [adminRole] = await Role.findOrCreate({ where: { name: 'ADMIN' } });

  // Falls SPECIAL existiert → auf USER migrieren
  const specialRole = await Role.findOne({ where: { name: 'SPECIAL' } });
  if (specialRole) {
    const links = await UserRole.findAll({ where: { role_id: specialRole.id } });

    for (const link of links) {
      await UserRole.findOrCreate({
        where: { user_id: link.user_id, role_id: userRole.id },
      });
    }

    await UserRole.destroy({ where: { role_id: specialRole.id } });
    await Role.destroy({ where: { id: specialRole.id } });
  }

  const bootstrapAdminEmails = parseBootstrapAdminEmails();
  if (!bootstrapAdminEmails.length) return;

  for (const bootstrapEmail of bootstrapAdminEmails) {
    const [user] = await User.findOrCreate({
      where: { email: bootstrapEmail },
      defaults: {
        name: bootstrapEmail.split('@')[0],
        isNewUser: false,
      },
    });

    await UserRole.findOrCreate({
      where: { user_id: user.id, role_id: adminRole.id },
    });

    console.log(`[seedRoles] Ensured ADMIN for ${bootstrapEmail}`);
  }
}

import Role from '../models/Role.js';
import UserRole from '../models/UserRole.js';
import User from '../models/User.js';

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

  const bootstrapEmail = process.env.BOOTSTRAP_ADMIN_EMAIL.trim().toLowerCase();
  if (!bootstrapEmail) return;

  const anyAdminLink = await UserRole.findOne({
    where: { role_id: adminRole.id },
  });
  if (anyAdminLink) return;

  const user = await User.findOne({
    where: { email: bootstrapEmail },
  });
  if (!user) {
    console.warn(
      `[seedRoles] BOOTSTRAP_ADMIN_EMAIL gesetzt (${bootstrapEmail}), aber User existiert noch nicht.`,
    );
    return;
  }

  await UserRole.findOrCreate({
    where: { user_id: user.id, role_id: adminRole.id },
  });

  console.log(`[seedRoles] Bootstrapped ADMIN for ${bootstrapEmail}`);
}

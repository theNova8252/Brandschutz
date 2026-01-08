// backend/seed/seedRoles.js
import Role from '../models/Role.js';
import UserRole from '../models/UserRole.js';

export async function seedRoles() {
  const [userRole] = await Role.findOrCreate({ where: { name: 'USER' } });
  await Role.findOrCreate({ where: { name: 'ADMIN' } });

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
}

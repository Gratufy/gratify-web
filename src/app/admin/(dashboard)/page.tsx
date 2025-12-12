import AdminMainClient from '@/components/admin/main/AdminMainClient';
import { getBusinessesCount } from '@/lib/actions/getBusinessesCount';

export default async function AdminMain() {
  const total = await getBusinessesCount();
  return (
    <div className="w-full">
      <AdminMainClient totalBusinesses={total} />
    </div>
  );
}

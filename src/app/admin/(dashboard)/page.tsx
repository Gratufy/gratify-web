import AdminMainClient from '@/components/admin/AdminMainClient';
import { getBusinessesCount } from '@/lib/actions/getBusinessesCount';

export default async function AdminMain() {
  const total = await getBusinessesCount();
  return (
    <div className="">
      <AdminMainClient totalBusinesses={total} />
    </div>
  );
}

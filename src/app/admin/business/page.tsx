import AdminHomeClient from "@/components/admin/AdminHomeClient";

export default function AdminBusiness() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-2">
        Welcome to the Admin Business Page
      </h1>
      <p className="mb-1 text-lg">
        Ця сторінка призначена для перегляду СПИСКУ бізнесів з фільтрами
      </p>
      <p className="mb-1 text-lg">
        Назва, власник, статус (активний/неактивний/на модераціі), дата
        створення
      </p>

      <p className="mb-1 text-lg">
        З можливістю переходити на окрему картку бізнесу та там редагувати,
        видаляти, приховувати
      </p>
      <p className="italic mb-2">
        На навігацію поки не звертати увагу. Це виключно для мене і тимчасово
      </p>
      <AdminHomeClient />
    </div>
  );
}

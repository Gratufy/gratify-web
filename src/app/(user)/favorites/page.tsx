export default function UserFavorites() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-2">
        Welcome to the User Favorites Page
      </h1>
      <p className="mb-1 text-lg">
        Ця сторінка призначена для перегляду УЛЮБЛЕНИХ бізнесів
      </p>
      <p className="mb-1 text-lg">
        Тут будуть картки УЛЮБЛЕНИХ бізнесів користувача
      </p>
      <p className="mb-1 text-lg">З можливістю переходити на окрему картку</p>
      <p className="italic">
        На навігацію поки не звертати увагу. Це виключно для мене і тимчасово
      </p>
    </div>
  );
}

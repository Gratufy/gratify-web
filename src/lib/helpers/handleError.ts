import { CustomToast } from '@/components/ui/custom-ui/CustomToast';

export function handleError(error: unknown) {
  if (!(error instanceof Error)) {
    CustomToast({
      type: 'error',
      content: 'Невідома помилка',
    });
    return;
  }
  const code = error.message;
  const errorMap: Record<
    string,
    { type: 'error' | 'warning'; message: string }
  > = {
    // auth
    AUTH_REQUIRED: {
      type: 'error',
      message: 'Потрібна авторизація',
    },
    PROFILE_NOT_FOUND: {
      type: 'error',
      message: 'Профіль користувача не знайдено',
    },

    // images
    FILE_TOO_LARGE: {
      type: 'warning',
      message: 'Фото занадто велике (макс. 2 Мб)',
    },
    IMAGE_COMPRESSION_FAILED: {
      type: 'error',
      message: 'Не вдалося обробити фото',
    },
    UPLOAD_FAILED: {
      type: 'error',
      message: 'Помилка завантаження фото',
    },

    // db
    DB_WRITE_FAILED: {
      type: 'error',
      message: 'Не вдалося зберегти фото',
    },
    DB_READ_FAILED: {
      type: 'error',
      message: 'Не вдалося отримати фото бізнесу',
    },
    DB_DELETE_FAILED: {
      type: 'error',
      message: 'Не вдалося оновити фото',
    },
    DB_INSERT_FAILED: {
      type: 'error',
      message: 'Не вдалося зберегти нові фото',
    },
    STORAGE_DELETE_FAILED: {
      type: 'error',
      message: 'Помилка видалення фото',
    },
    //votes
    VOTE_FAILED: { type: 'error', message: 'Не вдалося проголосувати' },
    VOTE_FETCH_FAILED: {
      type: 'error',
      message: 'Не вдалося отримати ваш голос',
    },
    //
    // fallback
    UNKNOWN_ERROR: {
      type: 'error',
      message: 'Щось пішло не так',
    },
  };

  const config = errorMap[code] ?? errorMap.UNKNOWN_ERROR;

  CustomToast({
    type: config.type,
    content: config.message,
  });
}

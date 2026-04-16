export function extractIdFromSlug(slug: string): string {
  const id = slug.split('-').pop();

  if (!id) {
    throw new Error('Invalid slug');
  }

  return id;
}

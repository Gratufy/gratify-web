FOR ME!!!!
Always use supabase.auth.getUser() to protect pages and user data.
https://supabase.com/docs/guides/auth/server-side/nextjs
https://supabase.com/dashboard/project/mmpegbtxqddsiqbamdmk
https://supabase.com/docs/guides/auth/social-login/auth-google
https://supabase.com/docs/guides/getting-started/quickstarts/nextjs
https://supabase.com/docs/guides/auth
https://github.com/Chensokheng/next-rbac/blob/master/app/auth/_action/login-with-oauth.ts

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Створити гугл auth

1. створити тут проєкт
   https://console.cloud.google.com/cloud-resource-manager?inv=1&invt=Ab4g_A
2. потім тут налаштування api and survices
   https://console.cloud.google.com/

# Attention !!!!

hier supabase\migrations\0006_slimy_tattoo.sql
I created trigger and function to prevent delete category Інше.

```sql
BEGIN
IF OLD.category_id = '11111111-1111-1111-1111-111111111111' THEN
RAISE EXCEPTION 'Cannot delete category Інше';
END IF;
RETURN OLD;
END;
```

to check

```sql
SELECT proname, prosrc
FROM pg_proc
WHERE proname = 'prevent_delete_inche';
```

and

```sql
SELECT tgname, tgrelid::regclass AS table_name
FROM pg_trigger
WHERE tgname = 'trg_prevent_delete_inche';

```

# RLS

## only ADMIN

```sql
EXISTS (
  SELECT 1
  FROM user_profiles up
  WHERE ((up.user_id = auth.uid()) AND (up.role = 'ADMIN'::role))
) OR (user_id = auth.uid())
```

## ADMIN and user

```sql
EXISTS (
SELECT 1
FROM user_profiles up
WHERE up.user_id = auth.uid()
AND up.role = 'ADMIN'::role
)
```

## only user

```sql
auth.uid() = user_id
```

## Admib or owner

```sql
EXISTS (
    SELECT 1
    FROM user_profiles up
    WHERE up.user_id = auth.uid()
      AND up.role = 'ADMIN'::role
  )
  OR owner_id = auth.uid()
```

## for relative tables

```sql
  EXISTS (
    SELECT 1
    FROM user_profiles up
    WHERE up.user_id = auth.uid()
      AND up.role = 'ADMIN'::role
  )
  OR EXISTS (
    SELECT 1
    FROM businesses b
    WHERE b.owner_id = auth.uid()
      AND b.id = business_id  --
  )
```

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

# gratify

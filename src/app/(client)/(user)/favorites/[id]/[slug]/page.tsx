import React, { cache } from 'react';
import { notFound, redirect } from 'next/navigation';
import { validate as uuidValidate } from 'uuid'; // npm install uuid
import BusinessDetails from '@/components/shared/oneCardDetails/BusinessDetails';
import { getBusinessById } from '@/lib/actions/getBusinessById';
import GoBackButton from '@/components/ui/custom-ui/GoBackButton';

interface UserBusinessDetailsPageProps {
  params: Promise<{ id: string; slug: string }>;
}
const getBusinessCached = cache(getBusinessById);

export async function generateMetadata({
  params,
}: UserBusinessDetailsPageProps) {
  const { id } = await params;

  if (!uuidValidate(id)) {
    return {
      title: 'Бізнес не знайдено | Gratify',
    };
  }

  const business = await getBusinessCached(id);

  if (!business) {
    return {
      title: 'Бізнес не знайдено ',
    };
  }

  return {
    title: `${business.name} `,
    description: business.description ?? 'Дивись деталі бізнесу на Gratify',
    openGraph: {
      title: business.name,
      description: business.description,
      images: business.images?.[0] ? [business.images[0]] : [],
    },
    alternates: {
      canonical: `/business/${id}/${business.slug}`,
    },
  };
}

export default async function UserBusinessDetailsPage({
  params,
}: UserBusinessDetailsPageProps) {
  const { id, slug } = await params;
  if (!uuidValidate(id)) return notFound();
  const business = await getBusinessCached(id);
  if (!business) {
    // if ID wrong → NotFound
    return notFound();
  }
  // 🔥 SEO redirect (VERY IMPORTANT)
  if (slug !== business.slug) {
    redirect(`/business/${id}/${business.slug}`);
  }
  return (
    <div className="container flex min-h-screen flex-col items-center justify-center lg:pb-20 xl:pb-20">
      <div className="max-[1024px]:max-w-150 w-full px-4 lg:w-[1024px] lg:px-[50px] lg:py-2 xl:w-[1440px] xl:px-[150px]">
        <GoBackButton href="/favorites" className="w-8 py-2 pr-2" />
      </div>
      <BusinessDetails id={id} selectedCity="__all__" initialData={business} />
    </div>
  );
}

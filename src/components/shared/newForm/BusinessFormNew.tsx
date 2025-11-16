'use client';
import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { Plus } from 'lucide-react';
import CrossIcon from '@/assets/icons/general/icon-16-cross.svg';
import * as v from 'valibot';
import { valibotResolver } from '@hookform/resolvers/valibot';
import { useForm, useFieldArray } from 'react-hook-form';
import type { FieldErrors } from 'react-hook-form';
import {
  Form,
  FormControl,
  // FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import CustomSelect from '../../ui/CustomSelect';
import { useBusinessCategories } from '@/hooks/useBusinessCategories';
import { UKRAINE_REGIONAL_CENTERS } from '@/const/regions';
import { useCheckAddress } from '@/hooks/useBusinessLocation';

import { useCreateBusiness, useUpdateBusiness } from '@/hooks/useBusinesses';
import { BusinessUpdate, LocationFormData } from '@/types';
import { useUserStore } from '@/stores/useUserStore';

import dynamic from 'next/dynamic';
// import { saveBusinessLocations } from '@/lib/actions/businessLocation';
import { useAllSpecialOffers } from '@/hooks/useSpecialOffers';
//import CustomCheckBox from '../ui/CustomCheckBox';
//import { specialOffers } from '@/db/schema';
import OffersMultiSelect from '../OffersMultiSelect';
import ImagesBlock from './ImagesBlock';
import { uploadBusinessImages } from '@/lib/actions/uploadBusinessImages';
const BusinessMap = dynamic(() => import('@/components/shared/BusinessMap'), {
  ssr: false,
});

const emptyToUndefined = v.transform((value: unknown) => {
  if (typeof value === 'string' && value.trim() === '') return undefined;
  return value;
});

export const businessFormSchema = v.pipe(
  v.object({
    isOnline: v.boolean(), // checkbox for online status
    name: v.pipe(v.string(), v.nonEmpty('Please enter a name')),
    description: v.pipe(v.string(), v.nonEmpty('Please enter a description')),
    website: v.pipe(
      v.any(),
      emptyToUndefined,
      v.optional(v.pipe(v.string(), v.url('Invalid website URL')))
    ),
    specialOffers: v.pipe(
      v.array(v.string()),
      v.minLength(1, 'Please select at least one offer.')
    ), // array of offer IDs
    category: v.pipe(v.string(), v.nonEmpty('Please select a category.')),
    locations: v.array(
      v.object({
        city: v.optional(v.string()),
        address: v.optional(v.string()),
        latitude: v.optional(v.number()),
        longitude: v.optional(v.number()),
        // latitude: v.optional(v.nullable(v.number())),
        // longitude: v.optional(v.nullable(v.number())),
      })
    ),
  }),
  // check 1: if online - true , website is required
  v.forward(
    v.partialCheck(
      [['isOnline'], ['website']],
      (data) => {
        // if online but no website -> error
        return !(data.isOnline && !data.website);
      },
      'Website is required for online businesses.'
    ),
    ['website']
  ),

  v.forward(
    v.partialCheck(
      [['isOnline'], ['locations']],
      (data) => {
        if (data.isOnline) return true; // онлайн → не проверяем

        // офлайн → должна быть хотя бы одна локация с городом
        return (
          data.locations.length > 0 &&
          data.locations.every(
            (loc: LocationFormData) => loc.city && loc.city.trim() !== ''
          )
        );
      },
      'At least one location with a city is required for offline businesses.'
    ),
    ['locations']
  )
);

type FormValues = v.InferOutput<typeof businessFormSchema>;
interface PreviewImage {
  file: File | null;
  url: string | null;
  isCover: boolean;
}
type BusinessFormProps = {
  businessId?: string; // if edit
  defaultValues?: FormValues;

  //onSuccess?: () => void;
};

export default function BusinessFormNew({
  defaultValues,
  businessId,
}: //onSuccess,
BusinessFormProps) {
  const router = useRouter();
  const pathname = usePathname();

  const MAX_PHOTOS = 10;
  const [imagesState, setImagesState] = useState<PreviewImage[]>(
    Array.from({ length: MAX_PHOTOS }, () => ({
      file: null,
      url: null,
      isCover: false,
    }))
  );
  const {
    categories,
    // isLoading: isCategoriesLoading,
    // isError: isCategoriesError,
  } = useBusinessCategories();
  const createBusinessMutation = useCreateBusiness();
  const updateBusinessMutation = useUpdateBusiness();

  const checkAddressMutation = useCheckAddress();
  const { data: allSpecialOffers } = useAllSpecialOffers();

  const form = useForm<FormValues>({
    resolver: valibotResolver(businessFormSchema),
    defaultValues: defaultValues ?? {
      name: '',
      description: '',
      website: '',
      category: '',
      isOnline: false,
      locations: [],
      specialOffers: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'locations',
  });

  // local state for check
  const [mapOpenIndex, setMapOpenIndex] = useState<number | null>(null);
  const [tempLatLng, setTempLatLng] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  useEffect(() => {
    if (!defaultValues && fields.length === 0) {
      append({ city: '', address: '' });
    }
  }, [defaultValues, fields.length, append]);
  // open map and check location for a specific location index
  async function handleOpenCheck(index: number) {
    setMapOpenIndex(null);
    const loc = form.getValues(`locations.${index}`);
    if (!loc.city) {
      alert('Please specify a city first');
      return;
    }

    if (!loc.address) {
      alert('Please specify an address');
      return;
    }
    try {
      const res = await checkAddressMutation.mutateAsync({
        city: loc.city,
        address: loc.address,
      });

      if (!res) {
        alert('Address not found. Please refine your input.');
        return;
      }

      setTempLatLng({ lat: res.latitude, lng: res.longitude });
      setMapOpenIndex(index);
    } catch (error) {
      console.error('Check address failed:', error);
      alert(
        'Не вдалося перевірити локацію. Можна продовжити без координат. Вони будуть додані пізніше автоматично.'
      );
    }
  }
  // to confirm location
  function handleConfirmLocation() {
    if (tempLatLng === null || mapOpenIndex === null) return;
    form.setValue(`locations.${mapOpenIndex}.latitude`, tempLatLng.lat, {
      shouldValidate: true,
    });
    form.setValue(`locations.${mapOpenIndex}.longitude`, tempLatLng.lng, {
      shouldValidate: true,
    });

    setMapOpenIndex(null);
  }

  // on Submit
  async function onSubmit(data: FormValues) {
    try {
      const locationsWithCoords = await Promise.all(
        data.locations.map(async (loc) => {
          // if coords already confirmed (in  "Check") — use them
          if (loc.latitude != null && loc.longitude != null) {
            return loc;
          }

          // if there is city and address find coords
          if (loc.city && loc.address) {
            const coords = await checkAddressMutation.mutateAsync({
              city: loc.city,
              address: loc.address,
            });
            return {
              ...loc,
              latitude: coords?.latitude ?? null,
              longitude: coords?.longitude ?? null,
            };
          }

          // if there is only city or nothing — leave as is
          return loc;
        })
      );
      if (businessId) {
        // update existing business
        // Prepare data for the database
        const updateData: BusinessUpdate = {
          isOnline: data.isOnline,
          name: data.name,
          description: data.description,
          website: data.website ?? null,
          categoryId: data.category,
          locations: locationsWithCoords,
          specialOffers: data.specialOffers ?? [],
        };

        await updateBusinessMutation.mutateAsync({
          id: businessId,
          values: updateData,
        });

        // update all locations at once
        //await saveBusinessLocations(businessId, locationsWithCoords, true);
        alert('Business edited successfully!');
        // Reset form
        form.reset(defaultValues);
      } else {
        // Creating a new business

        const newBusinessData = {
          name: data.name,
          description: data.description,
          website: data.website ?? null,
          categoryId: data.category,
          locations: locationsWithCoords,
          isOnline: data.isOnline,
          specialOffers: data.specialOffers,
        };
        // Create the business-user
        const { business, profile } =
          await createBusinessMutation.mutateAsync(newBusinessData);
        // Update Zustand profile
        useUserStore.getState().setProfile(profile);

        //IMAGES
        const uploadedImagesWithUrl: {
          businessId: string;
          url: string;
          isCover: boolean;
        }[] = [];
        const supabase = createClient();

        const uploadedImages = imagesState
          .filter((img) => img.file !== null)
          .map((img) => ({
            file: img.file!,
            isCover: img.isCover,
          }));
        for (const { file, isCover } of uploadedImages) {
          const filePath = `${business.id}/${Date.now()}_${file.name}`;
          const { error } = await supabase.storage
            .from('business-images')
            .upload(filePath, file);
          if (error) {
            console.error('Upload error:', error);
            continue;
          }

          const {
            data: { publicUrl },
          } = supabase.storage.from('business-images').getPublicUrl(filePath);
          uploadedImagesWithUrl.push({
            businessId: business.id,
            url: publicUrl,
            isCover,
          });
        }
        //  Передаём URL в серверную функцию
        if (uploadedImages.length) {
          await uploadBusinessImages(uploadedImagesWithUrl, profile.userId);
        }
        //--------------------
        alert('Business created successfully!');
        // Reset form
        form.reset();
        // setTempLatLng(null);
        // setLocationConfirmed(false);
      }

      if (pathname.startsWith('/admin')) {
        router.push('/admin/business');
      } else {
        router.push('/dashboard/business');
      }
    } catch (error) {
      console.error('Error creating/updating business:', error);
      alert('Something went wrong');
    }
  }
  const onError = (
    errors: FieldErrors<v.InferOutput<typeof businessFormSchema>>
  ) => {
    console.log('❌ Form Error', errors);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, onError)}
        className="flex w-full flex-col items-center justify-center"
      >
        {/* About Field */}
        <div className="container mb-10 w-full max-[1024px]:px-4 lg:flex lg:items-center lg:justify-between">
          {/* Name Field */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="mb-5 w-full lg:mb-0">
                <div className="flex w-full justify-between gap-4 lg:justify-start lg:gap-8">
                  <FormLabel htmlFor="name" className="title-h6">
                    Назва*
                  </FormLabel>
                  <FormControl className="w-[70%] shrink-0 lg:w-[213px]">
                    <Input
                      id="name"
                      className="input-custom px-2 lg:px-3"
                      placeholder="Назва"
                      {...field}
                    />
                  </FormControl>
                </div>

                {/* <FormMessage /> */}
              </FormItem>
            )}
          />
          {/** Category Field */}
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem className="w-full">
                <div className="flex w-full justify-between gap-4 lg:justify-end lg:gap-8">
                  <FormLabel htmlFor="category" className="title-h6">
                    Категорія*
                  </FormLabel>
                  <FormControl className="">
                    <CustomSelect
                      className="standart bg-background-white w-[70%] px-4 lg:w-[237px]"
                      value={field.value}
                      onChange={field.onChange}
                      options={categories} // array of category objects
                      getOptionValue={(c) => c.categoryId}
                      getOptionLabel={(c) => c.name}
                      placeholder="Категорія бізнесу"
                      error={form.formState.errors.category?.message as string}
                    />
                  </FormControl>
                </div>

                {/* <FormMessage /> */}
              </FormItem>
            )}
          />
        </div>
        {/* Images Field */}
        <ImagesBlock
          imagesState={imagesState}
          setImagesState={setImagesState}
        />
        {/* Special offers Field  and Descriprion new*/}
        <div className="container mb-10 w-full max-[1024px]:px-4 lg:flex lg:gap-6">
          <FormField
            control={form.control}
            name="specialOffers"
            render={({ field }) => (
              <FormItem className="mb-6 w-full lg:mb-0">
                <div className="flex w-full items-start justify-between gap-6 lg:gap-5">
                  <FormLabel
                    htmlFor="specialOffers"
                    className="flex flex-col items-start gap-2"
                  >
                    <span className="title-h6">Спеціальні пропозиції*</span>
                    <span className="caption">
                      Можете обрати будь-яку кількість, але на головній сторінці
                      каталогу буде видно перші 3 позиції
                    </span>
                  </FormLabel>
                  <FormControl className="shrink-0">
                    <OffersMultiSelect
                      className="lg:w-[260px]"
                      // className="placeholder:text-text-950-grey border-elements-grey-400 bg-background-white placeholder:text-xs"
                      offers={allSpecialOffers ?? []}
                      selectedOfferIds={field.value ?? []}
                      onChange={(offerId, checked) => {
                        let newValue = field.value ?? [];
                        if (checked) {
                          newValue = [...newValue, offerId];
                        } else {
                          newValue = newValue.filter((id) => id !== offerId);
                        }
                        field.onChange(newValue);
                      }}
                      // error={form.formState.errors.specialOffers?.message as string}
                    />
                  </FormControl>
                </div>

                {/* <FormMessage /> */}
              </FormItem>
            )}
          />

          {/* Description Field */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="w-full">
                <div className="flex w-full justify-between gap-4 lg:gap-5">
                  <FormLabel
                    htmlFor="description"
                    className="title-h6 flex flex-col items-start gap-1"
                  >
                    <p className="title-h6">Опис*</p>
                    <p className="caption">Максимальний розмір 3000 знаків</p>
                  </FormLabel>
                  <FormControl className="w-[70%] shrink-0">
                    <Textarea
                      id="description"
                      maxLength={3000}
                      className="input-custom h-23 px-2 lg:h-[148px] lg:px-3"
                      placeholder="Коротко опишіть ваші головні переваги, унікальні торгові пропозиціі"
                      {...field}
                    />
                  </FormControl>
                  {/* <FormDescription>Description.</FormDescription> */}
                  {/* <FormMessage /> */}
                </div>
              </FormItem>
            )}
          />
        </div>

        {/* Big Location block */}
        <div className="bg-background-grey-50 mb-15 w-full py-5 lg:py-10">
          <div className="container mx-auto w-full max-[1024px]:px-4">
            {/* Online checkbox */}
            <div className="border-elements-grey-400 mb-4 border-[0.5px] p-4 lg:flex lg:items-center lg:justify-between lg:gap-20 lg:px-3 lg:py-5">
              <FormField
                control={form.control}
                name="isOnline"
                render={({ field }) => (
                  <FormItem className="mb-3 flex gap-2 lg:mb-0 lg:items-center">
                    <FormControl>
                      <Checkbox
                        className="border-icons-grey-950"
                        checked={field.value}
                        onCheckedChange={(val) => field.onChange(val)}
                      />
                    </FormControl>
                    <FormLabel className="title-h5 lg:text-nowrap">
                      працюємо як он-лайн бізнес
                    </FormLabel>

                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Website Field */}
              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem className="w-full gap-1 lg:flex lg:gap-5">
                    <FormLabel className="title-h6">
                      Посилання на сайт/соцмережу
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="input-custom cursor-text px-2 lg:w-[325px] lg:px-3"
                        placeholder="Посилання"
                        {...field}
                      />
                    </FormControl>
                    {/* <FormDescription>Your website URL.</FormDescription>
                    <FormMessage /> */}
                  </FormItem>
                )}
              />
            </div>
            {/** Location Fields */}
            {/* ------ */}
            {form.formState.errors.locations && (
              <div className="mb-4 rounded bg-red-100 p-2 text-red-600">
                {form.formState.errors.locations.message}
              </div>
            )}
            <div className="w-full space-y-5">
              {fields.map((field, index) => (
                <div key={field.id}>
                  <p className="title-h6 mb-3">Адреса {index + 1}:</p>
                  <FormField
                    control={form.control}
                    name={`locations.${index}.city`}
                    render={({ field }) => (
                      <FormItem className="mb-2 w-full">
                        {/* <FormLabel>City</FormLabel> */}
                        <FormControl>
                          <CustomSelect
                            className="standart w-full px-4"
                            value={field.value}
                            onChange={field.onChange}
                            options={UKRAINE_REGIONAL_CENTERS}
                            getOptionValue={(o) => o.value}
                            getOptionLabel={(o) => o.label}
                            placeholder="Місто"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`locations.${index}.address`}
                    render={({ field }) => (
                      <FormItem className="w-full gap-1">
                        <FormLabel className="placeholder-small">
                          вулиця, будівля, приміщення
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Вулиця, будівля, приміщення"
                            className="input-custom mb-4 px-2 lg:px-3"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* {`locations.${index}.address` &&
                      `locations.${index}.address`.trim() !== "" && ( */}
                  <button
                    type="button"
                    className="placeholder-sm bg-elements-grey-200 border-background-main-300 mb-5 flex w-40 cursor-pointer items-center justify-center border-[0.5px] px-3 py-[6px]"
                    // onClick={() => checkAddress(index)}
                    onClick={() => handleOpenCheck(index)}
                    disabled={checkAddressMutation.isPending}
                  >
                    {checkAddressMutation.isPending
                      ? 'Перевіряємо...'
                      : 'Перевірити локацію'}
                  </button>
                  {/* )} */}
                  {fields[index]?.city?.trim() !== '' && (
                    <Button
                      type="button"
                      variant="destructive"
                      className="placeholder-sm rounded-none"
                      onClick={() => remove(index)}
                    >
                      <CrossIcon className="mr-2 size-4" />{' '}
                      <span>Видалити адресу</span>
                    </Button>
                  )}
                </div>
              ))}
            </div>
            {/* ------ */}
            {/* Map to check location- Opened with Btn */}
            {mapOpenIndex !== null && tempLatLng && (
              <div className="border-elements-grey-300 mb-5 w-full border">
                <BusinessMap
                  lat={tempLatLng.lat}
                  lng={tempLatLng.lng}
                  draggable
                  onDragEnd={(lat, lng) => setTempLatLng({ lat, lng })}
                  height={360}
                  isForm
                />
                <p className="placeholder-sm my-3 text-center">
                  Ви можете перетягувати маркер, щоб уточнити локацію.
                </p>
                <div className="flex justify-center gap-4">
                  <Button
                    type="button"
                    onClick={handleConfirmLocation}
                    className="placeholder-sm rounded-none"
                  >
                    Підтвердити локацію
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    className="border-background-main-300 placeholder-sm rounded-none border"
                    onClick={() => setMapOpenIndex(null)}
                  >
                    Закрити без збереження
                  </Button>
                </div>
              </div>
            )}
            <button
              className="placeholder-sm bg-background-white border-background-main-300 flex cursor-pointer items-center justify-center border px-3 py-[6px]"
              type="button"
              onClick={() => {
                append({ city: '', address: '' });
                setMapOpenIndex(null);
              }}
            >
              <Plus className="mr-2 size-4" /> <span>Додати ще</span>
            </button>
          </div>
        </div>

        <button className="btn-aprove px-3" type="submit">
          Передати на модерацію
        </button>
      </form>
    </Form>
  );
}

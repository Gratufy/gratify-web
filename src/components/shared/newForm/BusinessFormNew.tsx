'use client';
import React from 'react';
import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import { Plus } from 'lucide-react';
import CrossIcon from '@/assets/icons/general/icon-16-cross.svg';
import * as v from 'valibot';
import { valibotResolver } from '@hookform/resolvers/valibot';
import { useForm, useFieldArray } from 'react-hook-form';
import type { FieldErrors, UseFormReturn } from 'react-hook-form';
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
import { UKRAINE_REGIONAL_CENTERS_WITHOUT_ALL } from '@/const/regions';
import { useCheckAddress } from '@/hooks/useBusinessLocation';

import { useCreateBusiness, useUpdateBusiness } from '@/hooks/useBusinesses';
import { BusinessFormValues, BusinessImages, BusinessUpdate } from '@/types';
import { useUserStore } from '@/stores/useUserStore';

import dynamic from 'next/dynamic';

import { useAllSpecialOffers } from '@/hooks/useSpecialOffers';

import OffersMultiSelect from '../OffersMultiSelect';
import ImagesBlock from './ImagesBlock';
import { uploadBusinessImages } from '@/lib/actions/uploadBusinessImages';
import { businessFormSchema } from '@/shemas/businessFormSchema';
import { ensureOneCover } from '@/lib/helpers/ensureOneCover';
import { uploadImagesAndReturnUrls } from '@/lib/helpers/uploadImagesAndReturnUrls';
import { updateBusinessImagesOnServer } from '@/lib/helpers/updateBusinessImagesOnServer';
import { CustomToast } from '@/components/ui/CustomToast';

const BusinessMap = dynamic(() => import('@/components/shared/BusinessMap'), {
  ssr: false,
});

type FormValues = v.InferOutput<typeof businessFormSchema>;
interface PreviewImage {
  file: File | null;
  url: string | null;
  isCover: boolean;
}
type BusinessFormProps = {
  businessId?: string; // if edit
  defaultValues?: FormValues;
  existingImages?: BusinessImages;

  //onSuccess?: () => void;
};

export default function BusinessFormNew({
  defaultValues,
  businessId,
  existingImages,
}: BusinessFormProps) {
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
  // for button Перевірити
  const [checkingIndex, setCheckingIndex] = useState<number | null>(null);
  useEffect(() => {
    if (!existingImages?.length) return;

    const filled = existingImages.map((img) => ({
      file: null,
      url: img.url,
      isCover: img.isCover ?? false,
    }));

    const empty = Array.from({ length: MAX_PHOTOS - filled.length }, () => ({
      file: null,
      url: null,
      isCover: false,
    }));

    setImagesState([...filled, ...empty]);
  }, [existingImages]);

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
      ownOffers: [],
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
  console.log('tempLatLng', tempLatLng);
  useEffect(() => {
    if (!defaultValues && fields.length === 0) {
      append({ city: '', address: '' });
    }
  }, [defaultValues, fields.length, append]);

  function validateCity(index: number): boolean {
    const loc = form.getValues(`locations.${index}`);
    if (!loc.city || loc.city.trim() === '') {
      CustomToast({
        type: 'warning',
        content: (
          <>
            <p className="font-semibold">Будь ласка, вкажить спочатку місто</p>
          </>
        ),
      });
      return false;
    }
    return !!(loc.city && loc.city.trim() !== '');
  }
  function validateAdress(index: number): boolean {
    const loc = form.getValues(`locations.${index}`);
    if (!loc.address || loc.address.trim() === '') {
      CustomToast({
        type: 'warning',
        content: (
          <>
            <p className="font-semibold">
              Будь ласка, вкажить адресу перед перевіркою
            </p>
          </>
        ),
      });
      return false;
    }
    return !!(loc.address && loc.address.trim() !== '');
  }

  // open map and check location for a specific location index
  async function handleOpenCheck(index: number) {
    setCheckingIndex(index);
    setMapOpenIndex(null);
    const ifCityValid = validateCity(index);
    if (!ifCityValid) return;
    const ifAddressValid = validateAdress(index);
    if (!ifAddressValid) return;
    const loc = form.getValues(`locations.${index}`);
    if (!ifCityValid && ifAddressValid) {
      CustomToast({
        type: 'warning',
        content: (
          <>
            <p className="font-semibold">Будь ласка, вкажить спочатку місто</p>
          </>
        ),
      });
      return;
    }
    if (!loc.city || !loc.address) {
      return;
    }

    try {
      const res = await checkAddressMutation.mutateAsync({
        city: loc.city,
        address: loc.address,
      });

      if (!res) {
        CustomToast({
          type: 'error',
          content: (
            <>
              <p className="font-semibold">Адресу не знайдено.</p>
              <p>Будь ласка, уточніть введені дані.</p>
            </>
          ),
        });
        return;
      }

      setTempLatLng({ lat: res.latitude, lng: res.longitude });
      setMapOpenIndex(index);
    } catch (error) {
      console.error('Check address failed:', error);
      CustomToast({
        type: 'warning',
        content: (
          <>
            <p className="font-semibold">Не вдалося перевірити локацію.</p>
            <p>Можна продовжити без координат.</p>
            <p>Вони будуть додані пізніше автоматично.</p>
          </>
        ),
      });
    } finally {
      setCheckingIndex(null);
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
        // IMAGES
        const currentUserId = useUserStore.getState().profile?.userId;
        if (!currentUserId) throw new Error('No current user');
        const fixedImages = ensureOneCover(imagesState);

        // только новые файлы для Supabase
        const newFiles = fixedImages.filter((img) => img.file);
        const oldFiles = fixedImages
          .filter((img) => !img.file)
          .map((img) => ({
            url: img.url!,
            isCover: img.isCover,
          }));
        const uploadedImagesWithUrl = await uploadImagesAndReturnUrls(
          businessId,
          newFiles,
          currentUserId
        );
        const newFilesUploaded = uploadedImagesWithUrl.map((uploaded, i) => ({
          url: uploaded.url,
          isCover: newFiles[i].isCover,
        }));
        const finalPayload = [...oldFiles, ...newFilesUploaded];
        // const payload = buildClientPayload(finalPayload);
        await updateBusinessImagesOnServer(
          businessId,
          finalPayload,
          currentUserId
        );
        //
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
          ownOffers: data.ownOffers ?? [],
        };

        await updateBusinessMutation.mutateAsync({
          id: businessId,
          values: updateData,
        });

        CustomToast({
          type: 'success',
          content: (
            <>
              <p className="font-semibold">Супер!</p>
              <p>Зміни внесено.</p>
            </>
          ),
        });
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
          //ownOffers: ownOfferLocalArr,
          ownOffers: data.ownOffers,
        };

        // Create the business-user
        const { business, profile } =
          await createBusinessMutation.mutateAsync(newBusinessData);
        // Update Zustand profile
        useUserStore.getState().setProfile(profile);

        //IMAGES
        const notEmptyFiles = imagesState.filter((img) => img.file);
        if (notEmptyFiles.length) {
          const fixedImages = ensureOneCover(notEmptyFiles);
          const uploadedImagesWithUrl = await uploadImagesAndReturnUrls(
            business.id,
            fixedImages,
            profile.userId
          );
          //  Передаём URL в серверную функцию

          await uploadBusinessImages(
            business.id,
            uploadedImagesWithUrl,
            profile.userId
          );
        }
        //--------------------
        CustomToast({
          type: 'success',
          content: (
            <>
              <p className="font-semibold">Картка бізнесу створена</p>
              <p>Після модерації вона буде опублікована.</p>
            </>
          ),
        });
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
      CustomToast({
        type: 'error',
        content: (
          <>
            <p className="font-semibold">Щось пішло не так</p>
          </>
        ),
      });
    }
  }

  //for check validation
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
                <div className="flex w-full justify-between gap-4 lg:justify-start lg:gap-8 xl:gap-6">
                  <FormLabel htmlFor="name" className="title-h6">
                    Назва*
                  </FormLabel>
                  <FormControl className="w-[70%] shrink-0 lg:w-[237px] xl:w-[267px]">
                    <Input
                      id="name"
                      className="input-custom px-2 lg:px-3 xl:px-4"
                      placeholder="Назва"
                      {...field}
                    />
                  </FormControl>
                </div>

                <FormMessage className="placeholder-xs text-text-warning text-center" />
              </FormItem>
            )}
          />
          {/** Category Field */}
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem className="w-full">
                <div className="flex w-full justify-between gap-4 lg:justify-end lg:gap-8 xl:gap-6">
                  <FormLabel htmlFor="category" className="title-h6">
                    Категорія*
                  </FormLabel>
                  <FormControl className="">
                    <CustomSelect
                      className="standart bg-background-white w-[70%] px-4 lg:w-[237px] xl:w-[285px]"
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

                <FormMessage className="placeholder-xs text-text-warning text-center" />
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
                <div className="flex w-full items-start justify-between gap-6 lg:gap-5 xl:gap-6">
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
                      className="lg:w-[260px] xl:w-[364px]"
                      form={form as UseFormReturn<BusinessFormValues>}
                      // className="placeholder:text-text-950-grey border-elements-grey-400 bg-background-white placeholder:text-xs"
                      offers={allSpecialOffers ?? []}
                      selectedOfferIds={field.value ?? []}
                      // ownOfferLocalArr={ownOfferLocalArr}
                      // setOwnOfferLocalArr={setOwnOfferLocalArr}
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

                <FormMessage className="placeholder-xs text-text-warning text-center" />
              </FormItem>
            )}
          />

          {/* Description Field */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="w-full">
                <div className="flex w-full justify-between gap-4 lg:gap-5 xl:gap-6">
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
                      className="input-custom h-23 px-2 lg:h-[148px] lg:px-3 xl:px-4"
                      placeholder="Коротко опишіть ваші головні переваги, унікальні торгові пропозиціі"
                      {...field}
                    />
                  </FormControl>
                  {/* <FormDescription>Description.</FormDescription> */}
                </div>
                <FormMessage className="placeholder-xs text-text-warning text-center" />
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
                  <FormItem className="mb-3 lg:mb-0">
                    <div className="flex gap-2 lg:items-center">
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
                    </div>

                    {/* <FormMessage className="placeholder-xs text-text-warning mt-2 text-center" />*/}
                  </FormItem>
                )}
              />
              {/* Website Field */}
              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <div className="flex flex-col">
                    <FormItem className="w-full gap-1 lg:flex lg:justify-end lg:gap-5">
                      <FormLabel className="title-h6">
                        Посилання на сайт/соцмережу
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="input-custom cursor-text px-2 lg:w-[325px] lg:px-3 xl:w-[296px] xl:px-4"
                          placeholder="Посилання"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                    <FormMessage className="placeholder-xs text-text-warning mt-2 text-center" />
                  </div>
                )}
              />
            </div>
            {/** Location Fields */}
            {/* ------ */}
            {form.formState.errors.locations && (
              <div className="placeholder-sm bg-text-warning/10 text-text-warning mb-4 mt-2 rounded py-2 text-center">
                {form.formState.errors.locations.root?.message}
              </div>
            )}
            <div className="w-full space-y-5 xl:space-y-6">
              {fields.map((field, index) => (
                <div key={field.id}>
                  <div>
                    <p className="title-h6 mb-3 xl:mb-4">Адреса {index + 1}:</p>
                    <FormField
                      control={form.control}
                      name={`locations.${index}.city`}
                      render={({ field }) => (
                        <FormItem className="mb-2 w-full xl:mb-3">
                          {/* <FormLabel>City</FormLabel> */}
                          <FormControl>
                            <CustomSelect
                              className="standart w-full px-4"
                              value={field.value}
                              onChange={field.onChange}
                              options={UKRAINE_REGIONAL_CENTERS_WITHOUT_ALL}
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
                          <FormLabel className="placeholder-small xl:placeholder-sm">
                            вулиця, будівля, приміщення
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Вулиця, будівля, приміщення"
                              className="input-custom mb-4 px-2 lg:px-3 xl:mb-6 xl:px-4"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="mb-5 flex flex-col lg:flex-row lg:items-center lg:justify-between">
                      <div className="mb-5 flex items-center gap-4 lg:mb-0">
                        <span className="caption">
                          Можете перевірити локацію на мапі перед збереженням
                        </span>
                        <button
                          type="button"
                          className="placeholder-sm xl:placeholder-base bg-elements-grey-200 border-background-main-300 flex min-w-40 cursor-pointer items-center justify-center text-nowrap border-[0.5px] px-3 py-[6px] lg:mb-0 xl:px-5 xl:py-2"
                          // onClick={() => checkAddress(index)}
                          onClick={() => handleOpenCheck(index)}
                          disabled={checkingIndex === index}
                        >
                          {checkingIndex === index
                            ? 'Перевіряємо...'
                            : 'Перевірити локацію'}
                        </button>
                      </div>

                      {/* )} */}
                      {fields[index]?.city?.trim() !== '' && (
                        <button
                          type="button"
                          className="bg-icons-color-accent/60 btn-aprove max-[1024px]:w-40"
                          onClick={() => remove(index)}
                        >
                          <CrossIcon className="mr-2 size-4" />{' '}
                          <span>Видалити адресу</span>
                        </button>
                      )}
                    </div>
                    {/* Map to check location- Opened with Btn */}
                    {mapOpenIndex !== null &&
                      mapOpenIndex === index &&
                      tempLatLng && (
                        <div className="border-elements-grey-300 mb-5 w-full border-[0.5px] px-2 py-2">
                          <BusinessMap
                            lat={tempLatLng.lat}
                            lng={tempLatLng.lng}
                            draggable
                            onDragEnd={(lat, lng) =>
                              setTempLatLng({ lat, lng })
                            }
                            height={360}
                            isForm
                          />
                          <p className="placeholder-sm my-3 text-center">
                            Ви можете перетягувати маркер, щоб уточнити локацію.
                          </p>
                          <div className="flex flex-col items-center justify-center gap-4 lg:flex-row">
                            <Button
                              type="button"
                              onClick={handleConfirmLocation}
                              className="placeholder-sm xl:placeholder-base w-50 rounded-none"
                            >
                              Підтвердити локацію
                            </Button>
                            <Button
                              type="button"
                              variant="secondary"
                              className="border-background-main-300 placeholder-sm xl:placeholder-base w-50 rounded-none border"
                              onClick={() => setMapOpenIndex(null)}
                            >
                              Закрити без збереження
                            </Button>
                          </div>
                        </div>
                      )}
                  </div>
                  {index === fields.length - 1 && (
                    <button
                      className="btn-reject"
                      type="button"
                      onClick={() => {
                        const ifCity = validateCity(index);
                        if (!ifCity) return;
                        append({ city: '', address: '' });
                        setMapOpenIndex(null);
                      }}
                    >
                      <Plus className="mr-2 size-4" /> <span>Додати ще</span>
                    </button>
                  )}
                </div>
              ))}
            </div>
            {/* ------ */}
          </div>
        </div>

        <button className="btn-aprove" type="submit">
          Передати на модерацію
        </button>
      </form>
    </Form>
  );
}

// const uploadedImagesWithUrl: {
//   businessId: string;
//   url: string;
//   isCover: boolean;
// }[] = [];
// const supabase = createClient();

// const uploadedImages = imagesState
//   .filter((img) => img.file !== null)
//   .map((img) => ({
//     file: img.file!,
//     isCover: img.isCover,
//   }));
// for (const { file, isCover } of uploadedImages) {
//   const filePath = `${business.id}/${Date.now()}_${file.name}`;
//   const { error } = await supabase.storage
//     .from('business-images')
//     .upload(filePath, file);
//   if (error) {
//     console.error('Upload error:', error);
//     continue;
//   }

//   const {
//     data: { publicUrl },
//   } = supabase.storage.from('business-images').getPublicUrl(filePath);
//   uploadedImagesWithUrl.push({
//     businessId: business.id,
//     url: publicUrl,
//     isCover,
//   });
// }

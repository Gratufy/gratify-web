'use client';
import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { usePathname, useRouter } from 'next/navigation';

import * as v from 'valibot';
import { valibotResolver } from '@hookform/resolvers/valibot';

import { useForm, useFieldArray } from 'react-hook-form';
import type { FieldErrors, UseFormReturn } from 'react-hook-form';

import { uploadBusinessImages } from '@/lib/actions/uploadBusinessImages';
import { ensureOneCover } from '@/lib/helpers/ensureOneCover';
import { uploadImagesAndReturnUrls } from '@/lib/helpers/uploadImagesAndReturnUrls';
import { updateBusinessImagesOnServer } from '@/lib/helpers/updateBusinessImagesOnServer';

import { UKRAINE_REGIONAL_CENTERS_WITHOUT_ALL } from '@/const/regions';

import { businessFormSchema } from '@/shemas/businessFormSchema';

import { BusinessStatus } from '@/types/enums';
import {
  BusinessFormValues,
  BusinessImages,
  BusinessUpdate,
  LatLng,
} from '@/types';
import { PreviewImage } from '@/types/images';

import { useCheckAddress } from '@/hooks/useBusinessLocation';
import { useCreateBusiness, useUpdateBusiness } from '@/hooks/useBusinesses';
import { useBusinessCategories } from '@/hooks/useBusinessCategories';
import { useAllSpecialOffers } from '@/hooks/useSpecialOffers';

import { useUserStore } from '@/stores/useUserStore';

import CrossIcon from '@/assets/icons/general/icon-16-cross.svg';
import { Info, Plus, SquareCheck, SquareX, TriangleAlert } from 'lucide-react';

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

import CustomSelect from '@/components/ui/custom-ui/CustomSelect';
import { CustomToast } from '@/components/ui/custom-ui/CustomToast';

import OffersMultiSelect from '@/components/shared/filters/OffersMultiSelect';
import ImagesBlock from '@/components/shared/newForm/ImagesBlock';
import { getDistanceMeters } from '@/lib/helpers/getDistanceMeters';

const BusinessMap = dynamic(() => import('@/components/shared/BusinessMap'), {
  ssr: false,
});

type LocationWarning = {
  distance: number;
  type: 'none' | 'notice' | 'warning' | 'error'; // <300 — none, 300–1000 — warning, >1000 — error
};
type FormValues = v.InferOutput<typeof businessFormSchema>;

interface BusinessFormProps {
  businessId?: string; // if edit
  defaultValues?: FormValues;
  existingImages?: BusinessImages;
}

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

  // photo
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

  // hooks
  const { categories } = useBusinessCategories();
  const createBusinessMutation = useCreateBusiness();
  const updateBusinessMutation = useUpdateBusiness();
  const checkAddressMutation = useCheckAddress();
  const { data: allSpecialOffers } = useAllSpecialOffers();
  ///////
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
  //LOCATIONS
  const locationsInitializedRef = useRef(false);
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'locations',
  });

  // for button Перевірити Location
  const [checkingIndex, setCheckingIndex] = useState<number | null>(null);
  // local state for check
  const [mapOpenIndex, setMapOpenIndex] = useState<number | null>(null);
  // // то, что пользователь двигает на карте
  const [tempLatLng, setTempLatLng] = useState<LatLng | null>(null);
  // for distance check and this is from server or previous confirmed
  // const [initialLatLng, setInitialLatLng] = useState<{
  //   lat: number;
  //   lng: number;
  // } | null>(null);
  // ЭТАЛОН — координаты из адреса (геокодинг)
  const [addressLatLng, setAddressLatLng] = useState<LatLng | null>(null);
  const [locationWarnings, setLocationWarnings] = useState<LocationWarning[]>(
    []
  );

  useEffect(() => {
    if (fields.length === 0 && !locationsInitializedRef.current) {
      append({ city: '', address: '' });
      locationsInitializedRef.current = true;
    }
  }, [fields.length, append]);

  // validate city before check
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
      setCheckingIndex(null);
      return false;
    }
    return !!(loc.city && loc.city.trim() !== '');
  }
  // validate address
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
      setCheckingIndex(null);
      return false;
    }
    return !!(loc.address && loc.address.trim() !== '');
  }

  // open map and check location for a specific location index

  async function handleOpenCheck(index: number) {
    setCheckingIndex(index);
    setMapOpenIndex(null);
    //  проверки формы
    const ifCityValid = validateCity(index);
    if (!ifCityValid) return;
    const ifAddressValid = validateAdress(index);
    if (!ifAddressValid) return;

    const loc = form.getValues(`locations.${index}`);
    if (!loc.city || !loc.address) {
      setCheckingIndex(null);
      return;
    }

    try {
      // получаем эталон из адреса (геокодинг)
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
      const addressPoint = { lat: res.latitude, lng: res.longitude };
      setAddressLatLng(addressPoint);

      // 3️ tempLatLng
      // edit → берем сохранённые координаты
      // create → берём адрес
      const savedLat = form.getValues(`locations.${index}.latitude`);
      const savedLng = form.getValues(`locations.${index}.longitude`);
      if (savedLat != null && savedLng != null) {
        setTempLatLng({ lat: savedLat, lng: savedLng });
      } else {
        setTempLatLng(addressPoint);
      }
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
    if (!addressLatLng || !tempLatLng || mapOpenIndex === null) return;

    console.log('initialLatLng ', addressLatLng);
    console.log('tempLatLng', tempLatLng);
    const distance = getDistanceMeters(addressLatLng, tempLatLng);
    console.log('distance', distance);

    // Обновляем уведомление
    setLocationWarnings((prev) => {
      const newWarnings = [...prev];
      newWarnings[mapOpenIndex] = {
        distance,
        type:
          distance < 100
            ? 'none'
            : distance < 300
              ? 'notice'
              : distance <= 1000
                ? 'warning'
                : 'error',
      };
      return newWarnings;
    });

    if (distance > 300 && distance <= 1000) {
      CustomToast({
        type: 'warning',
        content: (
          <>
            <p className="font-semibold">
              Відстань між офіційною геолокацією та новою локацією занадто
              велика.
            </p>
            <p>
              Ви можете підтвердити локацію, якщо впевнені в правильності
              введених координат.
            </p>
          </>
        ),
      });
    }
    if (distance > 1000) {
      CustomToast({
        type: 'error',
        content: (
          <>
            <p className="font-semibold">
              Відстань між початковою та новою локацією занадто велика.
            </p>
            <p>Будь ласка, перевірте правильність введених координат.</p>
          </>
        ),
      });
      return;
    }

    //  сохраняем ТОЛЬКО tempLatLng
    form.setValue(`locations.${mapOpenIndex}.latitude`, tempLatLng.lat, {
      shouldValidate: true,
    });
    form.setValue(`locations.${mapOpenIndex}.longitude`, tempLatLng.lng, {
      shouldValidate: true,
    });

    setMapOpenIndex(null);
  }
  ////////// end Locations
  // on Submit
  async function onSubmit(data: FormValues, action?: string) {
    const nextStatus: BusinessStatus =
      action === 'submit' ? 'pending' : 'draft';

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
          newFiles
          // currentUserId
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
          // status: nextStatus,
        };

        await updateBusinessMutation.mutateAsync({
          id: businessId,
          values: updateData,
          status: nextStatus,
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
        const { business, profile } = await createBusinessMutation.mutateAsync({
          values: newBusinessData,
          status: nextStatus,
        });
        // Update Zustand profile
        useUserStore.getState().setProfile(profile);

        //IMAGES
        const notEmptyFiles = imagesState.filter((img) => img.file);
        if (notEmptyFiles.length) {
          const fixedImages = ensureOneCover(notEmptyFiles);
          const uploadedImagesWithUrl = await uploadImagesAndReturnUrls(
            business.id,
            fixedImages
            // profile.userId
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
        onSubmit={(e) => {
          const submitter = (e.nativeEvent as SubmitEvent)
            .submitter as HTMLButtonElement | null;

          const action = submitter?.dataset.action;

          form.handleSubmit((data) => onSubmit(data, action), onError)(e);
        }}
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
                  <FormLabel htmlFor="name-business" className="title-h6">
                    Назва*
                  </FormLabel>
                  <FormControl className="w-[70%] shrink-0 lg:w-[237px] xl:w-[267px]">
                    <Input
                      id="name-business"
                      minLength={2}
                      maxLength={70}
                      className="input-custom px-2 lg:px-3 xl:px-4"
                      placeholder="Назва"
                      {...field}
                      autoComplete="off"
                    />
                  </FormControl>
                </div>

                <FormMessage
                  id="name-business"
                  className="placeholder-xs text-text-warning lg:mr-auto"
                />
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
                  <div id="category-label" className="title-h6">
                    Категорія*
                  </div>
                  <FormControl
                    className=""
                    role="group"
                    aria-labelledby="category-label"
                  >
                    <CustomSelect
                      id="category-select" //name
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

                <FormMessage
                  id="category"
                  className="placeholder-xs text-text-warning lg:ml-auto"
                />
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
                  <div
                    id="special-offers-label"
                    className="flex flex-col items-start gap-2"
                  >
                    <span className="title-h6">Спеціальні пропозиції*</span>
                    <span className="caption">
                      Можете обрати будь-яку кількість, але на головній сторінці
                      каталогу буде видно перші 3 позиції
                    </span>
                  </div>
                  <FormControl
                    className="shrink-0"
                    role="group"
                    aria-labelledby="special-offers-label"
                  >
                    <OffersMultiSelect
                      className="lg:w-[260px] xl:w-[364px]"
                      form={form as UseFormReturn<BusinessFormValues>}
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
                    />
                  </FormControl>
                </div>

                <FormMessage className="placeholder-xs text-text-warning" />
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
                  <div className="shrink-0 max-[1024px]:w-[70%]">
                    <FormControl className="">
                      <Textarea
                        id="description"
                        minLength={20}
                        maxLength={1000}
                        className="input-custom h-23 mb-1 px-2 lg:h-[148px] lg:w-[315px] lg:px-3 xl:px-4"
                        placeholder="Коротко опишіть ваші головні переваги, унікальні торгові пропозиціі"
                        {...field}
                      />
                    </FormControl>
                    <p className="text-text-500-grey text-right text-xs">
                      {field.value.length} / 1000
                    </p>
                  </div>

                  {/* <FormDescription>Description.</FormDescription> */}
                </div>

                <FormMessage className="placeholder-xs text-text-warning" />
              </FormItem>
            )}
          />
        </div>

        {/* Big Location block */}
        <div className="bg-background-grey-50 mb-15 w-full py-5 lg:py-10">
          <div className="container mx-auto w-full max-[1024px]:px-4">
            {/* Online checkbox */}
            <div className="border-elements-grey-400 mb-8 border-[0.5px] p-4 lg:flex lg:items-center lg:justify-between lg:gap-20 lg:px-3 lg:py-5">
              <FormField
                control={form.control}
                name="isOnline"
                render={({ field }) => (
                  <FormItem className="mb-3 lg:mb-0">
                    <div className="flex gap-2 lg:items-center">
                      <FormControl>
                        <Checkbox
                          id="online-check"
                          name="isOnline"
                          className="border-icons-grey-950"
                          checked={field.value}
                          onCheckedChange={(val) => field.onChange(val)}
                          aria-labelledby="online-check-label"
                        />
                      </FormControl>
                      <FormLabel
                        className="title-h5 lg:text-nowrap"
                        htmlFor="online-check"
                        id="online-check-label"
                      >
                        працюємо як online бізнес
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
                      <FormLabel className="title-h6" htmlFor="website-link">
                        Посилання на сайт/соцмережу
                      </FormLabel>
                      <FormControl>
                        <Input
                          id="website-link"
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
              <div className="placeholder-sm bg-text-warning/10 text-text-warning mb-4 mt-2 px-3 py-2">
                {form.formState.errors.locations.root?.message}
              </div>
            )}

            <div className="bg-text-link/20 mb-2 flex items-center justify-center p-1">
              <Info className="text-text-link mr-2 h-4 w-4" aria-hidden />
              <span className="title-h6 text-text-700-grey">
                Якщо ваш бізнес працює тільки онлайн, можете пропустити
                наступний розділ
              </span>
            </div>
            <div className="w-full space-y-5 xl:space-y-6">
              {fields.map((field, index) => {
                const city = form.watch(`locations.${index}.city`);
                const address = form.watch(`locations.${index}.address`);

                const isOnlyEmptyLocation =
                  fields.length === 1 && !city?.trim() && !address?.trim();

                return (
                  <div key={field.id}>
                    <div>
                      <p className="title-h6 mb-3 xl:mb-4">
                        Адреса {index + 1}:
                      </p>
                      <div className="mb-1 flex items-center">
                        <Info
                          className="text-text-link mr-2 h-4 w-4"
                          aria-hidden
                        />
                        <span className="title-h6 text-text-500-grey">
                          Ви можете додати тільки місто але тоді ваша локація не
                          буде відображатися на мапі
                        </span>
                      </div>

                      <FormField
                        control={form.control}
                        name={`locations.${index}.city`}
                        render={({ field }) => (
                          <FormItem className="mb-2 w-full xl:mb-3">
                            <p
                              className="sr-only"
                              id={`locations.${index}.city-label`}
                            >
                              Місто
                            </p>
                            {/* <FormLabel>City</FormLabel> */}
                            <FormControl
                              role="group"
                              aria-labelledby={`locations.${index}.city-label`}
                            >
                              <CustomSelect
                                id={`locations.${index}.city-select`}
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
                            <FormLabel
                              className="placeholder-small xl:placeholder-sm"
                              htmlFor={`locations.${index}.address-input`}
                            >
                              вулиця, будівля, приміщення
                            </FormLabel>
                            <FormControl>
                              <Input
                                id={`locations.${index}.address-input`}
                                {...field}
                                maxLength={200}
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
                          {mapOpenIndex !== null && mapOpenIndex === index ? (
                            <button
                              className="btn-aprove hover:bg-elements-grey-200/60 focus:bg-elements-grey-200/60 bg-elements-grey-200 min-w-40 text-nowrap"
                              type="button"
                              onClick={() => setMapOpenIndex(null)}
                            >
                              Зачинити мапу
                            </button>
                          ) : (
                            <button
                              type="button"
                              className="btn-aprove bg-elements-grey-200/60 hover:bg-elements-grey-200 focus:bg-elements-grey-200 min-w-40 text-nowrap"
                              // onClick={() => checkAddress(index)}
                              onClick={() => handleOpenCheck(index)}
                              disabled={checkingIndex === index}
                            >
                              {checkingIndex === index
                                ? 'Перевіряємо...'
                                : 'Перевірити локацію'}
                            </button>
                          )}
                        </div>

                        {/* ................ */}

                        <button
                          type="button"
                          className="bg-icons-color-accent/60 btn-aprove disabled:cursor-not-allowed disabled:opacity-50 max-[1024px]:w-40"
                          disabled={fields.length === 1 && isOnlyEmptyLocation}
                          onClick={() => {
                            if (fields.length > 1) {
                              remove(index);
                            } else {
                              form.setValue(`locations.${index}.city`, '');
                              form.setValue(`locations.${index}.address`, '');
                              form.setValue(
                                `locations.${index}.latitude`,
                                undefined
                              );
                              form.setValue(
                                `locations.${index}.longitude`,
                                undefined
                              );
                            }
                            setMapOpenIndex(null);
                          }}
                        >
                          <CrossIcon
                            className="mr-2 size-4"
                            aria-hidden="true"
                          />{' '}
                          <span>Видалити адресу</span>
                        </button>
                        {/* )} */}
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
                              // isForm
                            />
                            <p className="placeholder-sm my-3 text-center">
                              Ви можете перетягувати маркер, щоб уточнити
                              локацію.
                            </p>

                            <div className="flex flex-col items-center justify-center gap-4 lg:flex-row">
                              <button
                                type="button"
                                onClick={handleConfirmLocation}
                                className="btn-aprove hover:bg-primary/90 focus:bg-primary/90 w-50 bg-primary border-primary text-text-50-grey text-nowrap"
                                // className="placeholder-sm xl:placeholder-base w-50 rounded-none"
                              >
                                Підтвердити координати
                              </button>
                              <button
                                type="button"
                                className="btn-aprove bg-elements-grey-200/60 hover:bg-elements-grey-200 focus:bg-elements-grey-200 w-50 text-nowrap"
                                onClick={() => setMapOpenIndex(null)}
                              >
                                Закрити без змін
                              </button>
                              {(tempLatLng.lat !== addressLatLng?.lat ||
                                tempLatLng.lng !== addressLatLng?.lng) && (
                                <button
                                  type="button"
                                  className="w-50 btn-reject text-nowrap"
                                  onClick={() => setTempLatLng(addressLatLng)}
                                >
                                  Початкові координати
                                </button>
                              )}
                            </div>
                          </div>
                        )}
                      {locationWarnings[index]?.type === 'notice' && (
                        <div className="mb-2 flex items-center text-blue-600">
                          <SquareCheck className="mr-2 h-4 w-4" aria-hidden />
                          <span className="placeholder-sm flex items-center gap-1">
                            Координати, які збережено, відрізняються від
                            офіційної геолокації для цього адреса на{' '}
                            {Math.round(locationWarnings[index].distance)}{' '}
                            метрів
                          </span>
                        </div>
                      )}
                      {locationWarnings[index]?.type === 'warning' && (
                        <div className="mb-2 flex items-center text-yellow-600">
                          <TriangleAlert className="mr-2 h-4 w-4" aria-hidden />
                          <span className="placeholder-sm flex items-center gap-1">
                            Координати, які збережено, відрізняються від
                            офіційної геолокації для цього адреса на{' '}
                            {Math.round(locationWarnings[index].distance)}{' '}
                            метрів
                          </span>
                        </div>
                      )}

                      {locationWarnings[index]?.type === 'error' && (
                        <div className="text-text-warning mb-2 flex items-center">
                          <SquareX className="mr-2 h-4 w-4" aria-hidden />
                          <span className="placeholder-sm flex items-center gap-1">
                            Координати змінені більше 1 км. Перевірте адресу
                          </span>
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
                        <Plus className="mr-2 size-4" aria-hidden="true" />{' '}
                        <span>Додати ще</span>
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
            {/* ------ */}
          </div>
        </div>
        <div className="mb-15 flex gap-6">
          <button
            className="btn-reject"
            type="submit"
            data-action="save"
            disabled={
              form.formState.isSubmitting ||
              createBusinessMutation.isPending ||
              updateBusinessMutation.isPending
            }
          >
            Зберегти зміни
          </button>
          <button
            className="btn-aprove"
            type="submit"
            data-action="submit"
            disabled={
              form.formState.isSubmitting ||
              createBusinessMutation.isPending ||
              updateBusinessMutation.isPending
            }
          >
            Передати на модерацію
          </button>
        </div>
      </form>
    </Form>
  );
}

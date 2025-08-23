"use client";

import * as v from "valibot";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { useForm } from "react-hook-form";
import type { FieldErrors } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import CustomSelect from "../ui/CustomSelect";
import { useBusinessCategories } from "@/hooks/useBusinessCategories";
import { UKRAINE_REGIONAL_CENTERS } from "@/const/regions";
import {
  useCheckAddress,
  useBusinessLocation,
  useUpdateBusinessLocation,
} from "@/hooks/useBusinessLocation";

import { useCreateBusiness, useUpdateBusiness } from "@/hooks/useBusinesses";
import { BusinessUpdate } from "@/types";
import { useUserStore } from "@/stores/useUserStore";
//import BusinessMap from "@/components/shared/BusinessMap";
import { useState } from "react";
import dynamic from "next/dynamic";
const BusinessMap = dynamic(() => import("@/components/shared/BusinessMap"), {
  ssr: false,
});

const emptyToUndefined = v.transform((value: unknown) => {
  if (typeof value === "string" && value.trim() === "") return undefined;
  return value;
});
type Location = {
  city?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
};
export const businessFormSchema = v.pipe(
  v.object({
    isOnline: v.boolean(), // checkbox for online status
    name: v.pipe(
      v.string(),
      v.nonEmpty("errors.name.required@@Please enter the business name.")
    ),
    description: v.pipe(
      v.string(),
      v.nonEmpty("errors.description.required@@Please enter a description.")
    ),
    website: v.pipe(
      v.any(),
      emptyToUndefined,
      v.optional(
        v.pipe(
          v.string(),
          v.url("errors.website.invalid@@Invalid website URL.")
        )
      )
    ),
    category: v.pipe(
      v.string(),
      v.nonEmpty("errors.category.required@@Please select a category.")
    ),
    locations: v.array(
      v.object({
        city: v.optional(v.string()),
        address: v.optional(v.string()),
        latitude: v.optional(v.number()),
        longitude: v.optional(v.number()),
      })
    ),
  }),
  // check 1: if online - true , website is required
  v.check(
    (data) => !(data.isOnline && !data.website),
    "errors.website.required@@Website is required for online businesses."
  ),
  // check 2: if offline or address is specified, city is required
  v.check(
    (data) =>
      data.isOnline ||
      data.locations.every(
        (loc: Location) => !loc.address || (loc.address && loc.city)
      ),
    "errors.city.required@@City is required for physical locations."
  )
);

type FormValues = v.InferOutput<typeof businessFormSchema>;
type BusinessFormProps = {
  businessId?: string; // if edit
  defaultValues?: FormValues;
  //onSuccess?: () => void;
};

// type BusinessFormProps = {
//   businessId?: string;
//   defaultValues?: Partial<FormValues>;
// };
export function BusinessForm({
  defaultValues,
  businessId,
}: //onSuccess,
BusinessFormProps) {
  const {
    categories,
    // isLoading: isCategoriesLoading,
    // isError: isCategoriesError,
  } = useBusinessCategories();
  const createBusinessMutation = useCreateBusiness();
  const updateBusinessMutation = useUpdateBusiness();
  const updateLocationMutation = useUpdateBusinessLocation();
  const checkAddressMutation = useCheckAddress();

  const form = useForm<FormValues>({
    resolver: valibotResolver(businessFormSchema),
    defaultValues: defaultValues ?? {
      name: "",
      description: "",
      website: "",
      category: "",
      city: "",
      district: "",
      address: "",
      latitude: undefined,
      longitude: undefined,
    },
  });
  // local state for check
  const [mapOpen, setMapOpen] = useState(false);
  const [tempLatLng, setTempLatLng] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [locationConfirmed, setLocationConfirmed] = useState(false);

  // if editing and you want to load the saved location by button - you can pull it here
  const { data: existingLoc } = useBusinessLocation(businessId ?? "");

  // open map and check location
  async function handleOpenCheck() {
    const city = form.getValues("city");
    const address = form.getValues("address");

    if (businessId && existingLoc) {
      // editing : if there are saved coordinates - show them
      setTempLatLng({ lat: existingLoc.latitude, lng: existingLoc.longitude });
      setMapOpen(true);
      setLocationConfirmed(false);
      return;
    }

    if (!city || !address) {
      alert("First specify the city and address");
      return;
    }

    const res = await checkAddressMutation.mutateAsync({ city, address });
    if (!res) {
      alert("Address not found");
      return;
    }
    setTempLatLng({ lat: res.latitude, lng: res.longitude });
    setMapOpen(true);
    setLocationConfirmed(false);
  }
  // to confirm location
  function handleConfirmLocation() {
    if (!tempLatLng) return;
    form.setValue("latitude", tempLatLng.lat, { shouldValidate: true });
    form.setValue("longitude", tempLatLng.lng, { shouldValidate: true });
    setLocationConfirmed(true);
    setMapOpen(false);
  }

  // on Submit
  async function onSubmit(data: FormValues) {
    try {
      if (!data.latitude || !data.longitude) {
        alert("Please check and confirm the location before saving.");
        return;
      }
      if (businessId) {
        // editing
        // Prepare data for the database
        const updateData: BusinessUpdate = {
          name: data.name,
          description: data.description,
          website: data.website ?? null,
          categoryId: data.category,
          city: data.city,
          district: data.district ?? null,
          address: data.address,
        };

        const updatedBusiness = await updateBusinessMutation.mutateAsync({
          id: businessId,
          values: updateData,
        });

        // then update location
        await updateLocationMutation.mutateAsync({
          businessId,
          latitude: data.latitude,
          longitude: data.longitude,
        });

        alert("Business edited successfully!");
        // Reset form
        form.reset({
          name: updatedBusiness.name,
          description: updatedBusiness.description,
          website: updatedBusiness.website ?? undefined, // null → undefined
          category: updatedBusiness.categoryId, // categoryId → category
          city: updatedBusiness.city,
          district: updatedBusiness.district ?? undefined,
          address: updatedBusiness.address,
        });
      } else {
        // Creating a new business
        const newBusinessData = {
          name: data.name,
          description: data.description,
          website: data.website ?? null,
          categoryId: data.category,
          city: data.city,
          district: data.district ?? null,
          address: data.address,
          latitude: data.latitude,
          longitude: data.longitude,
        };
        //{ business, profile }
        const { profile } = await createBusinessMutation.mutateAsync(
          newBusinessData
        );
        // Update Zustand profile
        useUserStore.getState().setProfile(profile);
        alert("Business created successfully!");
        // Reset form
        form.reset();
        setTempLatLng(null);
        setLocationConfirmed(false);
      }

      // If we need to do something on success
      // onSuccess?.();
    } catch (error) {
      console.error("Error creating/updating business:", error);
      alert("Something went wrong");
    }
  }
  const onError = (
    errors: FieldErrors<v.InferOutput<typeof businessFormSchema>>
  ) => {
    console.log("❌ Form Error", errors);
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, onError)}
        className="space-y-8 w-2/3 flex flex-col justify-center items-center"
      >
        {/* Name Field */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {/** Category Field */}
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <FormControl>
                <CustomSelect
                  value={field.value}
                  onChange={field.onChange}
                  options={categories} // массив объектов или строк
                  getOptionValue={(c) => c.categoryId}
                  getOptionLabel={(c) => c.name}
                  placeholder="Оберіть категорію"
                  error={form.formState.errors.category?.message as string}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/** City Field */}
        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>City</FormLabel>
              <FormControl>
                <CustomSelect
                  value={field.value}
                  onChange={field.onChange}
                  options={UKRAINE_REGIONAL_CENTERS}
                  getOptionValue={(option) => option.value}
                  getOptionLabel={(option) => option.label}
                  placeholder="Оберіть місто"
                  error={form.formState.errors.city?.message as string}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Description Field */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
              </FormControl>
              <FormDescription>Description.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Website Field */}
        <FormField
          control={form.control}
          name="website"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Website</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
              </FormControl>
              <FormDescription>Your website URL.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* District Field */}
        <FormField
          control={form.control}
          name="district"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>District</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
              </FormControl>
              <FormDescription>Your district.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Address Field */}
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
              </FormControl>
              <FormDescription>Your address.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Кнопка проверки локации */}
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="secondary"
            onClick={handleOpenCheck}
            disabled={checkAddressMutation.isPending}
          >
            {checkAddressMutation.isPending ? "Checking..." : "Check location"}
          </Button>

          {locationConfirmed &&
          form.getValues("latitude") &&
          form.getValues("longitude") ? (
            <span className="text-sm text-muted-foreground">
              Location confirmed: {form.getValues("latitude")?.toFixed(6)},{" "}
              {form.getValues("longitude")?.toFixed(6)}
            </span>
          ) : (
            <span className="text-sm text-muted-foreground">
              Location not confirmed
            </span>
          )}
        </div>
        {/* Map to check location- Opened with Btn */}
        {mapOpen && tempLatLng && (
          <div className="rounded-xl border p-3 space-y-3">
            <BusinessMap
              lat={tempLatLng.lat}
              lng={tempLatLng.lng}
              draggable
              onDragEnd={(lat, lng) => setTempLatLng({ lat, lng })}
              height={360}
              isForm
            />
            <div className="flex gap-3">
              <Button type="button" onClick={handleConfirmLocation}>
                Submit Location
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setMapOpen(false)}
              >
                Cancel
              </Button>
              <div className="ml-auto text-sm text-muted-foreground">
                Current: {tempLatLng.lat.toFixed(6)},{" "}
                {tempLatLng.lng.toFixed(6)}
              </div>
            </div>
          </div>
        )}
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}

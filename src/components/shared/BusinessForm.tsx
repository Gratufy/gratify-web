"use client";

import { usePathname, useRouter } from "next/navigation";

import * as v from "valibot";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { useForm, useFieldArray } from "react-hook-form";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import CustomSelect from "../ui/CustomSelect";
import { useBusinessCategories } from "@/hooks/useBusinessCategories";
import { UKRAINE_REGIONAL_CENTERS } from "@/const/regions";
import { useCheckAddress } from "@/hooks/useBusinessLocation";

import { useCreateBusiness, useUpdateBusiness } from "@/hooks/useBusinesses";
import { BusinessUpdate } from "@/types";
import { useUserStore } from "@/stores/useUserStore";
import { useState } from "react";
import dynamic from "next/dynamic";
import { saveBusinessLocations } from "@/lib/actions/businessLocation";
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
    name: v.pipe(v.string(), v.nonEmpty("Please enter a name")),
    description: v.pipe(v.string(), v.nonEmpty("Please enter a description")),
    website: v.pipe(
      v.any(),
      emptyToUndefined,
      v.optional(v.pipe(v.string(), v.url("Invalid website URL")))
    ),
    // website: v.union([
    //   v.undefined_(),
    //   v.pipe(
    //     v.string(),
    //     v.url("Invalid website URL"),
    //     v.nonEmpty("Website is required for online businesses.")
    //   ),
    //]),
    category: v.pipe(v.string(), v.nonEmpty("Please select a category.")),
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
  v.forward(
    v.partialCheck(
      [["isOnline"], ["website"]],
      (data) => {
        // if online but no website -> error
        return !(data.isOnline && !data.website);
      },
      "Website is required for online businesses."
    ),
    ["website"]
  ),

  // check 2: if offline or address is specified, city is required
  // v.forward(
  //   v.partialCheck(
  //     [["isOnline"], ["locations"]],
  //     (data) => {
  //       if (data.isOnline) return true; // онлайн → не проверяем
  //       // офлайн → у каждой локации, где есть адрес, должен быть city
  //       return data.locations.every(
  //         (loc: Location) => !loc.address || (loc.address && loc.city)
  //       );
  //     },
  //     "City is required for physical locations."
  //   ),
  //   ["locations"]
  // )
  // v.check(
  //   (data) =>
  //     data.isOnline ||
  //     (data.locations.length > 0 &&
  //       data.locations.every((loc) => loc.city && loc.city.trim() !== "")),
  //   "Offline businesses must have at least one city specified."
  // )
  v.forward(
    v.partialCheck(
      [["isOnline"], ["locations"]],
      (data) => {
        if (data.isOnline) return true; // онлайн → не проверяем

        // офлайн → должна быть хотя бы одна локация с городом
        return (
          data.locations.length > 0 &&
          data.locations.every(
            (loc: Location) => loc.city && loc.city.trim() !== ""
          )
        );
      },
      "At least one location with a city is required for offline businesses."
    ),
    ["locations"]
  )
);

type FormValues = v.InferOutput<typeof businessFormSchema>;

type BusinessFormProps = {
  businessId?: string; // if edit
  defaultValues?: FormValues;

  //onSuccess?: () => void;
};

export function BusinessForm({
  defaultValues,
  businessId,
}: //onSuccess,
BusinessFormProps) {
  const router = useRouter();
  const pathname = usePathname();

  const {
    categories,
    // isLoading: isCategoriesLoading,
    // isError: isCategoriesError,
  } = useBusinessCategories();
  const createBusinessMutation = useCreateBusiness();
  const updateBusinessMutation = useUpdateBusiness();

  const checkAddressMutation = useCheckAddress();

  const form = useForm<FormValues>({
    resolver: valibotResolver(businessFormSchema),
    defaultValues: defaultValues ?? {
      name: "",
      description: "",
      website: "",
      category: "",

      isOnline: false,
      locations: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "locations",
  });

  // local state for check
  const [mapOpenIndex, setMapOpenIndex] = useState<number | null>(null);
  const [tempLatLng, setTempLatLng] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  // open map and check location for a specific location index
  async function handleOpenCheck(index: number) {
    setMapOpenIndex(null);
    const loc = form.getValues(`locations.${index}`);
    if (!loc.city) {
      alert("Please specify a city first");
      return;
    }

    if (!loc.address) {
      alert("Please specify an address");
      return;
    }
    const res = await checkAddressMutation.mutateAsync({
      city: loc.city,
      address: loc.address,
    });

    if (!res) {
      alert("Address not found. Please refine your input.");
      return;
    }

    setTempLatLng({ lat: res.latitude, lng: res.longitude });
    setMapOpenIndex(index);
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
        };

        await updateBusinessMutation.mutateAsync({
          id: businessId,
          values: updateData,
        });

        // update all locations at once
        await saveBusinessLocations(businessId, locationsWithCoords, true);
        alert("Business edited successfully!");
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
        };
        // Create the business-user
        const { profile } = await createBusinessMutation.mutateAsync(
          newBusinessData
        );
        // Update Zustand profile
        useUserStore.getState().setProfile(profile);
        alert("Business created successfully!");
        // Reset form
        form.reset();
        // setTempLatLng(null);
        // setLocationConfirmed(false);
      }

      if (pathname.startsWith("/admin")) {
        router.push("/admin/business");
      } else {
        router.push("/dashboard/business");
      }
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
        {/* Online checkbox */}
        <FormField
          control={form.control}
          name="isOnline"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Online business</FormLabel>
              <FormControl>
                {/* <input
                  type="checkbox"
                  checked={field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                /> */}
                <Checkbox
                  checked={field.value}
                  onCheckedChange={(val) => field.onChange(val)}
                />
              </FormControl>
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
        {/* ------ */}
        {form.formState.errors.locations && (
          <div className="p-2 mb-4 text-red-600 bg-red-100 rounded">
            {form.formState.errors.locations.message}
          </div>
        )}
        {/* location*/}
        <div className="space-y-4 w-full">
          {fields.map((field, index) => (
            <div key={field.id} className="p-4 border rounded space-y-2">
              <FormField
                control={form.control}
                name={`locations.${index}.city`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <CustomSelect
                        value={field.value}
                        onChange={field.onChange}
                        options={UKRAINE_REGIONAL_CENTERS}
                        getOptionValue={(o) => o.value}
                        getOptionLabel={(o) => o.label}
                        placeholder="Оберіть місто"
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
                  <FormItem>
                    <FormLabel>Address (optional)</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Address" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* {`locations.${index}.address` &&
                `locations.${index}.address`.trim() !== "" && ( */}
              <Button
                type="button"
                variant="secondary"
                // onClick={() => checkAddress(index)}
                onClick={() => handleOpenCheck(index)}
                disabled={checkAddressMutation.isPending}
              >
                {checkAddressMutation.isPending
                  ? "Checking..."
                  : "Check location"}
              </Button>
              {/* )} */}
              <Button
                type="button"
                variant="destructive"
                onClick={() => remove(index)}
              >
                Remove location
              </Button>
            </div>
          ))}

          <Button
            type="button"
            onClick={() => {
              append({ city: "", address: "" });
              setMapOpenIndex(null);
            }}
          >
            Add location
          </Button>
        </div>
        {/* ------ */}
        {/* Map to check location- Opened with Btn */}
        {mapOpenIndex !== null && tempLatLng && (
          <div className="rounded-xl border p-3 space-y-3 w-full">
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
                onClick={() => setMapOpenIndex(null)}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}

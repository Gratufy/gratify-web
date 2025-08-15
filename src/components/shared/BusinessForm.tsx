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

export const businessFormSchema = v.object({
  name: v.pipe(
    v.string(),
    v.nonEmpty("errors.name.required@@Please enter the business name.")
  ),
  description: v.pipe(
    v.string(),
    v.nonEmpty("errors.description.required@@Please enter a description.")
  ),
  website: v.optional(
    v.pipe(
      v.string(),
      v.regex(
        /^https?:\/\/.+\..+/,
        "errors.website.invalid@@Invalid website URL."
      )
    )
  ),
  category: v.pipe(
    v.string(),
    v.nonEmpty("errors.category.required@@Please select a category.")
  ),
  city: v.pipe(
    v.string(),
    v.nonEmpty("errors.city.required@@Please select a city.")
  ),
  district: v.optional(v.string()),
  address: v.pipe(
    v.string(),
    v.nonEmpty("errors.address.required@@Please enter the address.")
  ),
});

export function BusinessForm() {
  const {
    categories,
    // isLoading: isCategoriesLoading,
    // isError: isCategoriesError,
  } = useBusinessCategories();
  const form = useForm<v.InferOutput<typeof businessFormSchema>>({
    resolver: valibotResolver(businessFormSchema),
    defaultValues: {
      name: "",
      description: "",
      website: "",
      category: "",
      city: "",
      district: "",
      address: "",
    },
  });

  function onSubmit(data: v.InferOutput<typeof businessFormSchema>) {
    // await fetch("/api/businesses", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(data),
    // });
    alert("Form submitted successfully!");
    console.log("Form submitted with data:", data);
  }
  const onError = (
    errors: FieldErrors<v.InferOutput<typeof businessFormSchema>>
  ) => {
    console.log("❌ Ошибки формы", errors);
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, onError)}
        className="space-y-8"
      >
        {/* Name Field */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
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
            <FormItem>
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
            <FormItem>
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
            <FormItem>
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
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
              </FormControl>
              <FormDescription>Your address.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}

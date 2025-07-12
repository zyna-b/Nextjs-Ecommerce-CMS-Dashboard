"use client";

import * as z from "zod";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Billboard, Category } from "@prisma/client";
import React from "react";
import { useParams, useRouter } from "next/navigation";

import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertModal } from "@/components/modals/alert-modal";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

// Form schema for validation
const formSchema = z.object({
  name: z.string().min(1),
  billboardId: z.string().min(1),
});

// Type for form values based on the schema
// This will ensure that the form values match the schema defined above
type CategoryFormValues = z.infer<typeof formSchema>;

interface CategoryFormProps {
  initialData: Category | null;
  billboards: Billboard[]; // Assuming Billboard is a type defined in your Prisma schema
}

// COMPONENT
// This component is responsible for rendering the settings form
const CategoryForm: React.FC<CategoryFormProps> = ({
  initialData,
  billboards,
}) => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const title = initialData ? "Edit Category" : "Create Category";
  const description = initialData
    ? "Edit your category settings"
    : "Add a new category to your store";
  //   const toastMessage = initialData ? "Category updated successfully" : "Category created successfully";
  const action = initialData ? "Save changes" : "Create";
  const toastMessage = initialData
    ? "Category updated successfully"
    : "Category created successfully";

  // Initialize the form with react-hook-form
  // Use the zodResolver to integrate Zod validation with react-hook-form
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
      billboardId: "",
    },
  });

  const onSubmit = async (data: CategoryFormValues) => {
    try {
      setLoading(true);

      if (initialData) {
        await axios.patch(
          `/api/${params.storeId}/categories/${params.categoryId}`,
          data
        );
      } else {
        await axios.post(`/api/${params.storeId}/categories`, data);
      }

      // 2. This line is KEY! 🔑        //  This ensures the UI is updated with the latest data by re-rendering the all server components
      router.refresh(); // ← This is the magic! ✨
      router.push(`/${params.storeId}/categories`); // Redirect to the categories page after creation or update
      // Show success toast message
      toast.success(toastMessage);
    } catch (error) {
      console.error("Error updating store settings:", error);
    } finally {
      setLoading(false);
    }
  };

  // On delete
  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(
        `/api/${params.storeId}/categories/${params.categoryId}`
      );

      // 2. This line is KEY! 🔑        //  This ensures the UI is updated with the latest data by re-rendering the all server components
      router.refresh(); // ← This is the magic! ✨
      router.push(`/${params.storeId}/categories`); // Redirect to the home page after deletion
      toast.success("Category deleted.");
    } catch {
      toast.error(
        "Make sure you remove all products and categories first"
      );
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />

      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />

        {initialData && (
          <Button
            disabled={loading}
            variant={"destructive"}
            size={"sm"}
            onClick={() => setOpen(true)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Separator />

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Category Name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="billboardId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Billboard</FormLabel>

                  <Select
                    disabled={loading}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder="Select a billboard"
                          defaultValue={field.value}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {billboards.map((billboard) => (
                        <SelectItem key={billboard.id} value={billboard.id}>
                          {billboard.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
      <Separator />
    </>
  );
};

export default CategoryForm;

"use client";

import * as z from "zod";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Billboard } from "@prisma/client";
import React from "react";
import { useParams, useRouter } from "next/navigation";

import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertModal } from "@/components/modals/alert-modal";
import ImageUpload from "@/components/ui/image-upload";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

// Form schema for validation
const formSchema = z.object({
  label: z.string().min(1),
  imageUrl: z.string().min(1, "Image URL is required"),
});

// Type for form values based on the schema
// This will ensure that the form values match the schema defined above
type BillboardFormValues = z.infer<typeof formSchema>;

interface BillboardFormProps {
  initialData: Billboard | null;
}

// COMPONENT
// This component is responsible for rendering the settings form
const BillboardForm: React.FC<BillboardFormProps> = ({ initialData }) => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const title = initialData ? "Edit Billboard" : "Create Billboard";
  const description = initialData
    ? "Edit your billboard settings"
    : "Add a new billboard to your store";
  //   const toastMessage = initialData ? "Billboard updated successfully" : "Billboard created successfully";
  const action = initialData ? "Save changes" : "Create";
  const toastMessage = initialData
    ? "Billboard updated successfully"
    : "Billboard created successfully";

  // Initialize the form with react-hook-form
  // Use the zodResolver to integrate Zod validation with react-hook-form
  const form = useForm<BillboardFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      label: "",
      imageUrl: "",
    },
  });

  const onSubmit = async (data: BillboardFormValues) => {
    try {
      setLoading(true);

      if(initialData) {
        await axios.patch(`/api/${params.storeId}/billboards/${params.billboardId}`, data);
      }
      else {
        await axios.post(`/api/${params.storeId}/billboards`, data);
      }

      // 2. This line is KEY! 🔑        //  This ensures the UI is updated with the latest data by re-rendering the all server components
      router.refresh(); // ← This is the magic! ✨
      router.push(`/${params.storeId}/billboards`); // Redirect to the billboards page after creation or update
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
      await axios.delete(`/api/${params.storeId}/billboards/${params.billboardId}`);

      // 2. This line is KEY! 🔑        //  This ensures the UI is updated with the latest data by re-rendering the all server components
      router.refresh(); // ← This is the magic! ✨
      router.push(`/${params.storeId}/billboards`); // Redirect to the home page after deletion
      toast.success("Billboard deleted.");
    } catch {
      toast.error("Make sure you remove all products and categories using this billboard first");
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

          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Background Image</FormLabel>
                <FormControl>
                  <ImageUpload 
                  value={field.value ? [field.value]: []}
                  disabled={loading}
                  onChange={(url) => {
                    field.onChange(url);
                  }}
                  onRemove={() => {
                    field.onChange("");
                  }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Label</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Billboard label"
                      {...field}
                    />
                  </FormControl>
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

export default BillboardForm;

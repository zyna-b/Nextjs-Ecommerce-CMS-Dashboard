"use client";

import * as z from "zod";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Color } from "@prisma/client";
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

// Form schema for validation
const formSchema = z.object({
  name: z.string().min(1),
  value: z.string().min(4).regex(/^#/, {
    message: "Color must be a valid hex code",
  }),
});

// Type for form values based on the schema
// This will ensure that the form values match the schema defined above
type ColorFormValues = z.infer<typeof formSchema>;

interface ColorFormProps {
  initialData: Color | null;
}

// COMPONENT
// This component is responsible for rendering the settings form
const ColorForm: React.FC<ColorFormProps> = ({ initialData }) => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const title = initialData ? "Edit Color" : "Create Color";
  const description = initialData
    ? "Edit your color settings"
    : "Add a new color to your store";
  //   const toastMessage = initialData ? "Color updated successfully" : "Color created successfully";
  const action = initialData ? "Save changes" : "Create";
  const toastMessage = initialData
    ? "Color updated successfully"
    : "Color created successfully";

  // Initialize the form with react-hook-form
  // Use the zodResolver to integrate Zod validation with react-hook-form
  const form = useForm<ColorFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
      value: "",
    },
  });

  const onSubmit = async (data: ColorFormValues) => {
    try {
      setLoading(true);

      if (initialData) {
        await axios.patch(
          `/api/${params.storeId}/colors/${params.colorId}`,
          data
        );
      } else {
        await axios.post(`/api/${params.storeId}/colors`, data);
      }

      // 2. This line is KEY! 🔑        //  This ensures the UI is updated with the latest data by re-rendering the all server components
      router.refresh(); // ← This is the magic! ✨
      router.push(`/${params.storeId}/colors`); // Redirect to the colors page after creation or update
      // Show success toast message
      toast.success(toastMessage);
    } catch (error) {
      console.error("Error updating color settings:", error);
    } finally {
      setLoading(false);
    }
  };

  // On delete
  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/${params.storeId}/colors/${params.colorId}`);

      // 2. This line is KEY! 🔑        //  This ensures the UI is updated with the latest data by re-rendering the all server components
      router.refresh(); // ← This is the magic! ✨
      router.push(`/${params.storeId}/colors`); // Redirect to the colors page after deletion
      toast.success("Color deleted.");
    } catch {
      toast.error("Make sure you remove all products using this color first");
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
                      placeholder="Color name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Value</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-x-4">
                      <Input
                        disabled={loading}
                        placeholder="Color value"
                        {...field}
                      />

                      <div
                        className="h-4 w-4 rounded-full"
                        style={{ backgroundColor: field.value }}
                      />
                    </div>
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

export default ColorForm;

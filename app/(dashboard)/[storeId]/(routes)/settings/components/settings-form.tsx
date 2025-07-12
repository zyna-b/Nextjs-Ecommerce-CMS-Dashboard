"use client";

import * as z from "zod";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Store } from "@prisma/client";
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
import { ApiAlert } from "@/components/ui/api-alert";
import { useOrigin } from "@/hooks/use-origin";

interface SettingsFormProps {
  initialData: Store;
}

// Form schema for validation
const formSchema = z.object({
  name: z.string().min(1),
});

// Type for form values based on the schema
// This will ensure that the form values match the schema defined above
type SettingsFormValues = z.infer<typeof formSchema>;

// COMPONENT
// This component is responsible for rendering the settings form
const SettingsForm: React.FC<SettingsFormProps> = ({ initialData }) => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const origin = useOrigin(); // Get the origin URL for API alerts

  // Initialize the form with react-hook-form
  // Use the zodResolver to integrate Zod validation with react-hook-form
  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });

  const onSubmit = async (data: SettingsFormValues) => {
    try {
      setLoading(true);
      await axios.patch(`/api/stores/${params.storeId}`, data);

      // 2. This line is KEY! 🔑        //  This ensures the UI is updated with the latest data by re-rendering the all server components
      router.refresh(); // ← This is the magic! ✨

      toast.success("Store updated successfully");
    } catch (error) {
      console.error("Error updating store settings:", error);
    } finally {
      setLoading(false);
    }
  };

  // On delelte
  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/stores/${params.storeId}`);

      // 2. This line is KEY! 🔑        //  This ensures the UI is updated with the latest data by re-rendering the all server components
      router.refresh(); // ← This is the magic! ✨
      router.push("/"); // Redirect to the home page after deletion
      toast.success("Store deleted.");

    } catch {
      toast.error("Make sure you remove all products and categories first");
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
        <Heading title="Settings" description="Manage store preferences" />

        <Button
          disabled={loading}
          variant={"destructive"}
          size={"sm"}
          onClick={() => setOpen(true)}
        >
          <Trash className="h-4 w-4" />
        </Button>
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
                      placeholder="Store name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={loading} className="ml-auto" type="submit">
            Save changes
          </Button>
        </form>
      </Form>
      <Separator />
      <ApiAlert title='NEXT_PUBLIC_API_URL'
       description= {`${origin}/api/${params.storeId}`} 
       variant="public"/>
    </>
  );
};

export default SettingsForm;

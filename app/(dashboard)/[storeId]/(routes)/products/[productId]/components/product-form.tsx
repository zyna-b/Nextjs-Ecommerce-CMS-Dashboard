// ProductForm.tsx
"use client";

import * as z from "zod";
import axios from "axios";
import { toast } from "react-hot-toast";
import {
  Product,
  Image as PrismaImage,
  Category,
  Color,
  Size,
} from "@prisma/client";
import Image from "next/image";
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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

// Form schema for validation
const formSchema = z.object({
  name: z.string().min(1),
  images: z.object({ url: z.string().min(1) }).array(),
  price: z.coerce.number().min(1),
  categoryId: z.string().min(1),
  colorId: z.string().min(1),  // Changed from colorsId to colorId
  sizeId: z.string().min(1),
  isFeatured: z.boolean().default(false).optional(),
  isArchived: z.boolean().default(false).optional(),
});

type ProductFormValues = z.infer<typeof formSchema>;

interface ProductFormProps {
  initialData:
    | (Product & {
        images: PrismaImage[];
      })
    | null;
  categories: Category[];
  colors: Color[];
  sizes: Size[];
}

const ProductForm: React.FC<ProductFormProps> = ({
  initialData,
  categories,
  colors,
  sizes,
}) => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const title = initialData ? "Edit Product" : "Create Product";
  const description = initialData
    ? "Edit your product settings"
    : "Add a new product to your store";
  const action = initialData ? "Save changes" : "Create";
  const toastMessage = initialData
    ? "Product updated successfully"
    : "Product created successfully";

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          ...initialData,
          // Ensure images has the correct format
          images: initialData.images || [],
        }
      : {
          name: "",
          images: [],
          price: 0,
          categoryId: "",
          colorId: "",  // Changed from colorsId to colorId
          sizeId: "",
          isFeatured: false,
          isArchived: false,
        },
  });

  const onSubmit = async (data: ProductFormValues) => {
    try {
      setLoading(true);
      
      console.log("Submitting data:", data);
      console.log("Form validation passed");

      if (initialData) {
        await axios.patch(
          `/api/${params.storeId}/products/${params.productId}`,
          data
        );
      } else {
        console.log("Creating new product with data:", data);
        await axios.post(`/api/${params.storeId}/products`, data);
      }

      router.refresh();
      router.push(`/${params.storeId}/products`);
      toast.success(toastMessage);
    } catch (error) {
      console.error("Error updating product:", error);
      // console.error("Error details:", error.response?.data);
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/${params.storeId}/products/${params.productId}`);

      router.refresh();
      router.push(`/${params.storeId}/products`);
      toast.success("Product deleted.");
    } catch {
      toast.error("Something went wrong.");
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
            name="images"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Images</FormLabel>
                <FormControl>
                  <div>
                    <div className="mb-4 flex flex-wrap items-center gap-4">
                      {field.value.map((image) => (
                        <div
                          key={image.url}
                          className="relative w-[200px] h-[200px] rounded-md overflow-hidden border"
                        >
                          <div className="z-10 absolute top-2 right-2">
                            <Button
                              type="button"
                              onClick={() => {
                                const newImages = field.value.filter(
                                  (img) => img.url !== image.url
                                );
                                console.log("Removing image:", image.url);
                                console.log("New images array:", newImages);
                                field.onChange(newImages);
                              }}
                              variant="destructive"
                              size="icon"
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                          <Image
                            fill
                            className="object-cover"
                            alt="Product image"
                            src={image.url}
                          />
                        </div>
                      ))}
                    </div>

                    <ImageUpload
                      value={[]} // We're handling the display separately above
                      disabled={loading}
                      onChange={(url) => {
                        console.log("Adding image to form:", url);

                        // Get current value from the form
                        const currentImages = form.getValues("images") || [];
                        console.log("Current images from form:", currentImages);

                        // Prevent duplicates and add the new image
                        if (!currentImages.find((img) => img.url === url)) {
                          const newImages = [...currentImages, { url }];
                          console.log("Updated images:", newImages);
                          form.setValue("images", newImages, {
                            shouldDirty: true,
                          });
                        } else {
                          console.log(
                            "Duplicate image detected, skipping:",
                            url
                          );
                        }
                      }}
                      onRemove={() => {}} // We're handling removal separately
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Other form fields for name, price, category, color, size, featured, archived */}
          {/* ... (unchanged from your original code) */}

          <div className="grid grid-cols-3 gap-8">
            {/* Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Product name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Price */}
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      disabled={loading}
                      placeholder="9.99"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Category */}
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    disabled={loading}
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Color */}
            <FormField
              control={form.control}
              name="colorId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Color</FormLabel>
                  <Select
                    disabled={loading}
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a color" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {colors.map((color) => (
                        <SelectItem key={color.id} value={color.id}>
                          {color.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Size */}
            <FormField
              control={form.control}
              name="sizeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Size</FormLabel>
                  <Select
                    disabled={loading}
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a size" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {sizes.map((size) => (
                        <SelectItem key={size.id} value={size.id}>
                          {size.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Featured */}
            <FormField
              control={form.control}
              name="isFeatured"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={loading}
                    />
                  </FormControl>
                  <div className="space-y-1">
                    <FormLabel className="font-normal">Featured</FormLabel>
                    <p>This product will appear on the home page</p>
                  </div>
                </FormItem>
              )}
            />
            {/* Archived */}
            <FormField
              control={form.control}
              name="isArchived"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={loading}
                    />
                  </FormControl>
                  <div className="space-y-1">
                    <FormLabel className="font-normal">Archived</FormLabel>
                    <p>This product will not appear anywhere in the store</p>
                  </div>
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

export default ProductForm;

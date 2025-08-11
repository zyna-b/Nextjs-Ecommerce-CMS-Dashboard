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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// Form schema for validation
const formSchema = z.object({
  name: z.string().min(1),
  images: z.object({ url: z.string().min(1) }).array(),
  price: z.coerce.number().min(1),
  quantity: z.coerce.number().min(0),
  categoryId: z.string().min(1),
  colorIds: z.array(z.string()).min(1), // We can have multiple colors of a product
  sizeIds: z.array(z.string()).min(1), // We can have multiple sizes of a product
  description: z.string().min(10, "Description is required"),
  isFeatured: z.boolean().default(false).optional(),
  isArchived: z.boolean().default(false).optional(),
});

type ProductFormValues = z.infer<typeof formSchema>;

interface ProductFormProps {
  initialData:
    | (Product & {
        images: PrismaImage[];
        productColors?: { colorId: string }[];
        productSizes?: { sizeId: string }[];
      })
    | null;
  categories: Category[];
  colors: Color[];
  sizes: Size[];
  description: string; // Optional description prop for the form
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
  const Description = initialData
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
          images: initialData.images || [],
          colorIds: initialData.productColors?.map((pc) => pc.colorId) || [],
          sizeIds: initialData.productSizes?.map((ps) => ps.sizeId) || [],
        }
      : {
          name: "",
          images: [],
          price: 0,
          quantity: 0,
          categoryId: "",
          colorIds: [],
          sizeIds: [],
          description: "",
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
          {
            ...data,
            colorIds: data.colorIds,
            sizeIds: data.sizeIds,
          }
        );
      } else {
        await axios.post(`/api/${params.storeId}/products`, {
          ...data,
          colorIds: data.colorIds,
          sizeIds: data.sizeIds,
        });
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
        <Heading title={title} description={Description} />

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
            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <textarea
                      disabled={loading}
                      placeholder="Product description"
                      {...field}
                      className="w-full min-h-[100px] border rounded-md p-2"
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
            {/* Quantity */}
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantity</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      disabled={loading}
                      placeholder="1"
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
                      <SelectTrigger className="w-full">
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
              name="colorIds"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Color</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full justify-start"
                      >
                        {field.value.length === 0
                          ? "Select colors"
                          : colors
                              .filter((c) => field.value.includes(c.id))
                              .map((c) => c.name)
                              .join(", ")}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-100 p-2">
                      <div className="flex flex-col gap-y-3">
                        {colors.map((color) => (
                          <label
                            key={color.id}
                            className="flex gap-x-4 items-center cursor-pointer"
                          >
                            <Checkbox
                              disabled={loading}
                              checked={field.value.includes(color.id)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  field.onChange([...field.value, color.id]);
                                } else {
                                  field.onChange(
                                    field.value.filter((id) => id !== color.id)
                                  );
                                }
                              }}
                            />
                            <span
                              className="w-6 h-6 rounded-full border mt-1"
                              style={{ backgroundColor: color.value }}
                              title={color.name}
                            />
                            <span className="text-xs mt-1">{color.name}</span>
                          </label>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Size */}
            <FormField
              control={form.control}
              name="sizeIds"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Size</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full justify-start"
                      >
                        {field.value.length === 0
                          ? "Select sizes"
                          : sizes
                              .filter((s) => field.value.includes(s.id))
                              .map((s) => s.name)
                              .join(", ")}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-100 p-2">
                      <div className="flex flex-col gap-y-3">
                        {sizes.map((size) => (
                          <label
                            key={size.id}
                            className="flex gap-x-4 items-center cursor-pointer"
                          >
                            <Checkbox
                              disabled={loading}
                              checked={field.value.includes(size.id)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  field.onChange([...field.value, size.id]);
                                } else {
                                  field.onChange(
                                    field.value.filter((id) => id !== size.id)
                                  );
                                }
                              }}
                            />
                            <span className="text-xs mt-1">{size.name}</span>
                          </label>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>
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

"use client";

import React, { useEffect, useState } from "react";
import { Button } from "./button";
import { ImagePlus, Trash } from "lucide-react";
import Image from "next/image";
import { CldUploadWidget } from "next-cloudinary";

interface ImageUploadProps {
  disabled?: boolean;
  onChange: (value: string) => void;
  onRemove: (url: string) => void;
  value: string[];
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  disabled,
  onChange,
  onRemove,
  value = [],
}) => {
  const [isMounted, setIsMounted] = useState(false); // Creates state to track if component is mounted in the browser
  // This prevents hydration errors by not rendering until component is mounted

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Handle successful upload event
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onUploadSuccess = (result: any) => {
    console.log("Upload result:", result);

    if (result?.info && typeof result.info === 'object' && 'secure_url' in result.info) {
      const url = result.info.secure_url as string;
      console.log("Adding new image URL:", url);
      
      // Always use the single upload handler - it handles duplicates anyway
      onChange(url);
    } else {
      console.error("Invalid upload result format:", result);
    }
  };

  if (!isMounted) return null;

  return (
    <div>
      {value.length > 0 && (
        <div className="mb-4 flex items-center gap-4 flex-wrap">
          {value.map((url) => (
            <div
              key={url}
              className="relative w-[200px] h-[200px] rounded-md overflow-hidden"
            >
              <div className="z-10 absolute top-2 right-2">
                <Button
                  type="button"
                  onClick={() => onRemove(url)}
                  variant={"destructive"}
                  size="icon"
                >
                  <Trash />
                </Button>
              </div>
              <Image
                fill
                className="object-cover"
                src={url}
                alt="Uploaded image"
                sizes="200px"
              />
            </div>
          ))}
        </div>
      )}

      <CldUploadWidget 
        uploadPreset="wle1gc7n" 
        onSuccess={onUploadSuccess} 
        options={{
          maxFiles: 10,
          sources: ['local', 'url', 'camera', 'unsplash'],
          multiple: true,  // Enable multiple file selection
          clientAllowedFormats: ['png', 'jpg', 'jpeg', 'gif', 'webp'],
          maxFileSize: 10000000, // 10MB
        }}
      >
        {({ open }) => (
          <div className="w-full p-4 border-2 border-dashed border-gray-300 rounded-md text-center">
            <Button
              type="button"
              disabled={disabled}
              variant="secondary"
              onClick={() => open()}
              className="w-full md:w-auto"
            >
              <ImagePlus className="h-4 w-4 mr-2" />
              Upload Multiple Images
            </Button>
            <p className="text-sm text-muted-foreground mt-2">
              Select multiple images at once. All will be added to your product.
            </p>
          </div>
        )}
      </CldUploadWidget>
    </div>
  );
};

export default ImageUpload;

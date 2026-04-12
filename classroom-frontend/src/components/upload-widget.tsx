import { useRef, useState, type ChangeEvent } from "react";
import { toast } from "sonner";
import { ImagePlus, Loader2, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  ALLOWED_TYPES,
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_UPLOAD_PRESET,
  CLOUDINARY_UPLOAD_URL,
  MAX_FILE_SIZE,
} from "@/constants";
import type { UploadWidgetProps } from "@/types";

const fallbackUploadUrl = CLOUDINARY_CLOUD_NAME
  ? `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`
  : undefined;

const uploadUrl = CLOUDINARY_UPLOAD_URL ?? fallbackUploadUrl;

type CloudinaryUploadResponse = {
  secure_url?: string;
  public_id?: string;
  error?: {
    message?: string;
  };
};

const UploadWidget = ({ value, onChange, disabled = false }: UploadWidgetProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleSelectClick = () => {
    if (disabled || isUploading) {
      return;
    }

    inputRef.current?.click();
  };

  const resetInput = () => {
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const validateFile = (file: File) => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error("Please upload a PNG, JPG, JPEG, or WEBP image.");
      return false;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast.error("Image size must be 3MB or smaller.");
      return false;
    }

    return true;
  };

  const uploadFile = async (file: File) => {
    if (!uploadUrl || !CLOUDINARY_UPLOAD_PRESET) {
      toast.error("Cloudinary upload is not configured.");
      resetInput();
      return;
    }

    if (!validateFile(file)) {
      resetInput();
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    setIsUploading(true);

    try {
      const response = await fetch(uploadUrl, {
        method: "POST",
        body: formData,
      });

      const data = (await response.json()) as CloudinaryUploadResponse;

      if (!response.ok || !data.secure_url || !data.public_id) {
        throw new Error(data.error?.message ?? "Upload failed.");
      }

      onChange?.({
        url: data.secure_url,
        publicId: data.public_id,
      });

      toast.success("Image uploaded successfully.");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to upload image.";
      toast.error(message);
    } finally {
      setIsUploading(false);
      resetInput();
    }
  };

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    await uploadFile(file);
  };

  const handleRemove = () => {
    if (disabled || isUploading) {
      return;
    }

    onChange?.(null);
    resetInput();
  };

  return (
    <div className="space-y-3">
      <input
        ref={inputRef}
        type="file"
        accept={ALLOWED_TYPES.join(",")}
        className="hidden"
        onChange={handleFileChange}
        disabled={disabled || isUploading}
      />

      {value?.url ? (
        <div className="upload-preview">
          <img src={value.url} alt="Uploaded banner preview" className="max-h-64" />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            onClick={handleRemove}
            disabled={disabled || isUploading}
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      ) : null}

      <button
        type="button"
        className="upload-dropzone"
        onClick={handleSelectClick}
        disabled={disabled || isUploading}
      >
        <div className="upload-prompt">
          {isUploading ? (
            <Loader2 className="icon animate-spin" />
          ) : (
            <ImagePlus className="icon" />
          )}

          <div>
            <p>{isUploading ? "Uploading image..." : "Click to upload banner image"}</p>
            <p>PNG, JPG, JPEG, or WEBP up to 3MB</p>
          </div>
        </div>
      </button>
    </div>
  );
};

export default UploadWidget;

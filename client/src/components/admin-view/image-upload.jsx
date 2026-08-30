import { FileIcon, UploadCloudIcon, XIcon } from "lucide-react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useEffect, useRef } from "react";
import { Button } from "../ui/button";
import axios from "axios";
import { Skeleton } from "../ui/skeleton";
import { buildApiUrl } from "@/config";

function ProductImageUpload({
  imageFile,
  setImageFile,
  imageLoadingState,
  uploadedImageUrl,
  setUploadedImageUrl,
  setImageLoadingState,
  onImageUploadError,
  isEditMode,
  isCustomStyling = false,
}) {
  const inputRef = useRef(null);

  function handleImageFileChange(event) {
    const selectedFile = event.target.files?.[0];

    if (selectedFile) setImageFile(selectedFile);
  }

  function handleDragOver(event) {
    event.preventDefault();
  }

  function handleDrop(event) {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files?.[0];
    if (droppedFile) setImageFile(droppedFile);
  }

  function handleRemoveImage() {
    setImageFile(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  async function uploadImageFile() {
    setImageLoadingState(true);
    const data = new FormData();
    data.append("my_file", imageFile);
    const uploadEndpoint = isCustomStyling
      ? buildApiUrl("/api/common/feature/upload-image")
      : buildApiUrl("/api/admin/products/upload-image");

    try {
      const response = await axios.post(uploadEndpoint, data);

      if (!response?.data?.success || !response?.data?.result?.url) {
        throw new Error(response?.data?.message || "Image upload failed");
      }

      setUploadedImageUrl(response.data.result.url);
    } catch (error) {
      onImageUploadError?.(
        error?.response?.data?.message || error.message || "Image upload failed"
      );
    } finally {
      setImageLoadingState(false);
    }
  }

  useEffect(() => {
    if (imageFile !== null) uploadImageFile();
  }, [imageFile]);

  function handleImageUrlChange(e) {
    const url = e.target.value;
    setUploadedImageUrl(url);
  }

  function isValidImageUrl(url) {
    const trimmedUrl = url?.trim();
    if (!trimmedUrl || trimmedUrl.length > 2048 || /\s/.test(trimmedUrl)) return false;

    try {
      const parsedUrl = new URL(trimmedUrl);
      return parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:";
    } catch {
      return !/^[a-z][a-z\d+.-]*:/i.test(trimmedUrl);
    }
  }

  return (
    <div
      className={`w-full  mt-4 ${isCustomStyling ? "" : "max-w-md mx-auto"}`}
    >
      <Label className="text-lg font-semibold mb-2 block">Upload Image</Label>
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`${
          isEditMode ? "opacity-60" : ""
        } border-2 border-dashed rounded-lg p-4`}
      >
        <Input
          id="image-upload"
          type="file"
          className="hidden"
          ref={inputRef}
          onChange={handleImageFileChange}
          disabled={isEditMode}
        />
        <div className="mt-4">
          <Label className="text-sm">Image URL</Label>
          <Input
            placeholder="Paste image URL (optional)"
            value={uploadedImageUrl || ""}
            onChange={handleImageUrlChange}
          />
          {uploadedImageUrl ? (
            <div className="mt-2">
              {uploadedImageUrl.trim().length > 2048 ? (
                <p className="text-red-500 text-sm">
                  Image URL must be 2048 characters or less.
                </p>
              ) : isValidImageUrl(uploadedImageUrl) ? (
                <img
                  src={uploadedImageUrl}
                  alt="preview"
                  className="w-32 h-32 object-cover rounded"
                />
              ) : (
                <p className="text-red-500 text-sm">Invalid image URL</p>
              )}
            </div>
          ) : null}
        </div>
        {!imageFile ? (
          <Label
            htmlFor="image-upload"
            className={`${
              ""
            } flex flex-col items-center justify-center h-32 cursor-pointer`}
          >
            <UploadCloudIcon className="w-10 h-10 text-muted-foreground mb-2" />
            <span>Drag & drop or click to upload image</span>
          </Label>
        ) : imageLoadingState ? (
          <Skeleton className="h-10 bg-gray-100" />
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FileIcon className="w-8 text-primary mr-2 h-8" />
            </div>
            <p className="text-sm font-medium">{imageFile.name}</p>
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-foreground"
              onClick={handleRemoveImage}
            >
              <XIcon className="w-4 h-4" />
              <span className="sr-only">Remove File</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductImageUpload;

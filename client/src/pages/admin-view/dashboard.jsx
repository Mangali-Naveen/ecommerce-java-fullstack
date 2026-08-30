import ProductImageUpload from "@/components/admin-view/image-upload";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {
  addFeatureImage,
  deleteFeatureImage,
  getFeatureImages,
  updateFeatureImage,
} from "@/store/common-slice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

function AdminDashboard() {
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const [editingFeatureId, setEditingFeatureId] = useState(null);
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { featureImageList } = useSelector((state) => state.commonFeature);

  function handleUploadFeatureImage() {
    if (!uploadedImageUrl.trim()) {
      toast({ title: "Please enter an image URL." });
      return;
    }

    const request = editingFeatureId
      ? dispatch(updateFeatureImage({ id: editingFeatureId, image: uploadedImageUrl }))
      : dispatch(addFeatureImage(uploadedImageUrl));

    request.then((data) => {
      if (data?.payload?.success) {
        dispatch(getFeatureImages());
        setImageFile(null);
        setUploadedImageUrl("");
        setEditingFeatureId(null);
        toast({
          title: editingFeatureId
            ? "Banner updated successfully."
            : "Banner added successfully.",
        });
      } else {
        toast({ title: data?.payload?.message || "Unable to save banner." });
      }
    });
  }

  function handleEditFeatureImage(featureImage) {
    setEditingFeatureId(featureImage.id);
    setUploadedImageUrl(featureImage.image);
  }

  function handleDeleteFeatureImage(id) {
    if (!window.confirm("Are you sure you want to delete this banner?")) {
      return;
    }

    dispatch(deleteFeatureImage(id)).then((data) => {
      if (data?.payload?.success) {
        dispatch(getFeatureImages());
        if (editingFeatureId === id) {
          setEditingFeatureId(null);
          setUploadedImageUrl("");
        }
        toast({ title: "Banner deleted successfully." });
      } else {
        toast({ title: data?.payload?.message || "Unable to delete banner." });
      }
    });
  }

  useEffect(() => {
    dispatch(getFeatureImages());
  }, [dispatch]);

  return (
    <div>
      <ProductImageUpload
        imageFile={imageFile}
        setImageFile={setImageFile}
        uploadedImageUrl={uploadedImageUrl}
        setUploadedImageUrl={setUploadedImageUrl}
        setImageLoadingState={setImageLoadingState}
        imageLoadingState={imageLoadingState}
        onImageUploadError={(message) => toast({ title: message })}
        isCustomStyling={true}
        // isEditMode={currentEditedId !== null}
      />
      <Button onClick={handleUploadFeatureImage} className="mt-5 w-full">
        Upload
      </Button>
      <div className="flex flex-col gap-4 mt-5">
        {featureImageList && featureImageList.length > 0
          ? featureImageList.map((featureImgItem) => (
              <div key={featureImgItem.id} className="relative">
                <img
                  src={featureImgItem.image}
                  className="w-full h-[300px] object-cover rounded-t-lg"
                />
                <div className="flex gap-2 mt-2">
                  <Button
                    variant="outline"
                    onClick={() => handleEditFeatureImage(featureImgItem)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleDeleteFeatureImage(featureImgItem.id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))
          : null}
      </div>
    </div>
  );
}

export default AdminDashboard;

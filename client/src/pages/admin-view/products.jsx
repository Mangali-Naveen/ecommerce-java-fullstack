import ProductImageUpload from "@/components/admin-view/image-upload";
import AdminProductTile from "@/components/admin-view/product-tile";
import CommonForm from "@/components/common/form";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useToast } from "@/components/ui/use-toast";
import { addProductFormElements } from "@/config";
import {
  addNewProduct,
  deleteProduct,
  editProduct,
  fetchAllProducts,
} from "@/store/admin/products-slice";
import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const initialFormData = {
  image: null,
  title: "",
  description: "",
  category: "",
  brand: "",
  price: "",
  salePrice: "",
  totalStock: "",
  averageReview: 0,
  sizes: [],
  imageUrl: "",
};

function AdminProducts() {
  const [openCreateProductsDialog, setOpenCreateProductsDialog] =
    useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentEditedId, setCurrentEditedId] = useState(null);

  const { productList } = useSelector((state) => state.adminProducts);
  const dispatch = useDispatch();
  const { toast } = useToast();

  function onSubmit(event) {
    event.preventDefault();

    // basic validation
    if (!formData.title || !formData.description || !formData.category || !formData.brand) {
      toast({ title: "Please fill required fields" });
      return;
    }

    const imageToUse = uploadedImageUrl || formData.imageUrl;
    if (!imageToUse) {
      toast({ title: "Please provide product image (upload or URL)" });
      return;
    }

    const priceVal = parseFloat(formData.price);
    const saleVal = parseFloat(formData.salePrice || 0);
    const stockVal = parseInt(formData.totalStock, 10);

    if (isNaN(priceVal) || priceVal < 0) {
      toast({ title: "Invalid price" });
      return;
    }

    if (!Number.isInteger(stockVal) || stockVal < 0) {
      toast({ title: "Invalid total stock" });
      return;
    }

    if (!isNaN(saleVal) && saleVal > priceVal) {
      toast({ title: "Sale price cannot exceed original price" });
      return;
    }

    const brandToSend = formData.brandCustom
      ? formData.brandCustom
      : formData.brand === "__other__"
      ? ""
      : formData.brand;

    const categoryToSend = formData.categoryCustom
      ? formData.categoryCustom
      : formData.category === "__other__"
      ? ""
      : formData.category;

    const payload = {
      image: imageToUse,
      title: formData.title,
      description: formData.description,
      brand: brandToSend,
      category: categoryToSend,
      sizes: formData.sizes || [],
      price: parseFloat(priceVal),
      salePrice: !isNaN(saleVal) ? parseFloat(saleVal) : 0.0,
      totalStock: stockVal,
    };

    setIsSubmitting(true);
    const isEditMode = currentEditedId != null;
    const requestUrl = isEditMode
      ? buildApiUrl(`/api/admin/products/edit/${currentEditedId}`)
      : buildApiUrl("/api/admin/products/add");

    if (isEditMode) {
      dispatch(editProduct({ id: currentEditedId, formData: payload })).then((data) => {
        setIsSubmitting(false);
        if (data?.payload?.success) {
          dispatch(fetchAllProducts());
          setFormData(initialFormData);
          setOpenCreateProductsDialog(false);
          setCurrentEditedId(null);
          toast({ title: "Product updated successfully" });
        }
      });
    } else {
      dispatch(addNewProduct(payload)).then((data) => {
        setIsSubmitting(false);
        if (data?.payload?.success) {
          dispatch(fetchAllProducts());
          setOpenCreateProductsDialog(false);
          setImageFile(null);
          setFormData(initialFormData);
          setUploadedImageUrl("");
          toast({ title: "Product added successfully" });
        }
      });
    }
  }

  function handleDelete(getCurrentProductId) {
    dispatch(deleteProduct(getCurrentProductId)).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchAllProducts());
      } else {
        toast({
          title: data?.payload?.message || "Unable to delete product",
          variant: "destructive",
        });
      }
    });
  }

  function isFormValid() {
    const required = [
      "title",
      "description",
      "category",
      "brand",
      "price",
      "totalStock",
    ];

    const hasRequired = required.every((k) => formData[k] !== "" && formData[k] !== null);
    const hasImage = uploadedImageUrl || formData.imageUrl;

    // if category/brand is set to other, ensure custom values are provided
    const categoryValid = formData.category === "__other__" ? !!formData.categoryCustom : true;
    const brandValid = formData.brand === "__other__" ? !!formData.brandCustom : true;

    return hasRequired && hasImage && categoryValid && brandValid;
  }

  useEffect(() => {
    dispatch(fetchAllProducts());
  }, [dispatch]);

  return (
    <Fragment>
      <div className="mb-5 w-full flex justify-end">
        <Button
          onClick={() => {
            // ensure opening in Add mode: reset edited id and form
            setCurrentEditedId(null);
            setFormData(initialFormData);
            setImageFile(null);
            setUploadedImageUrl("");
            setOpenCreateProductsDialog(true);
          }}
        >
          Add New Product
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
        {productList && productList.length > 0
          ? productList.map((productItem) => (
              <AdminProductTile
                setFormData={setFormData}
                setOpenCreateProductsDialog={setOpenCreateProductsDialog}
                setUploadedImageUrl={setUploadedImageUrl}
                setCurrentEditedId={setCurrentEditedId}
                product={productItem}
                handleDelete={handleDelete}
              />
            ))
          : null}
      </div>
      <Sheet
        open={openCreateProductsDialog}
        onOpenChange={(open) => {
          // when opening the sheet, ensure form is reset for Add mode
          setOpenCreateProductsDialog(open);
          if (open) {
            setCurrentEditedId(null);
            setFormData(initialFormData);
            setImageFile(null);
            setUploadedImageUrl("");
          }
          // when closing, keep currentEditedId cleared
          if (!open) {
            setCurrentEditedId(null);
          }
        }}
      >
        <SheetContent side="right" className="overflow-auto">
          <SheetHeader>
            <SheetTitle>
              {currentEditedId != null ? "Edit Product" : "Add New Product"}
            </SheetTitle>
          </SheetHeader>
          <ProductImageUpload
            imageFile={imageFile}
            setImageFile={setImageFile}
            uploadedImageUrl={uploadedImageUrl}
            setUploadedImageUrl={setUploadedImageUrl}
            setImageLoadingState={setImageLoadingState}
            imageLoadingState={imageLoadingState}
            isEditMode={currentEditedId != null}
          />
          <div className="py-6">
              <CommonForm
              onSubmit={onSubmit}
              formData={formData}
              setFormData={setFormData}
                buttonText={currentEditedId != null ? "Edit" : "Add"}
              formControls={addProductFormElements}
              isBtnDisabled={!isFormValid() || isSubmitting}
            />
          </div>
        </SheetContent>
      </Sheet>
    </Fragment>
  );
}

export default AdminProducts;

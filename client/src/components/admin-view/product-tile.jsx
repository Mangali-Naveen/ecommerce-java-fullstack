import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";
import { formatINR } from "@/lib/utils";

function AdminProductTile({
  product,
  setFormData,
  setOpenCreateProductsDialog,
  setCurrentEditedId,
  setUploadedImageUrl,
  handleDelete,
}) {
  return (
    <Card className="w-full max-w-sm mx-auto">
      <div>
        <div className="relative">
          <img
            src={product?.image}
            alt={product?.title}
            className="w-full h-[300px] object-cover rounded-t-lg"
          />
          {product?.salePrice > 0 ? (
            <span className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 text-xs rounded">
              Sale
            </span>
          ) : null}
        </div>
        <CardContent>
          <h2 className="text-xl font-bold mb-2 mt-2">{product?.title}</h2>
          <div className="flex justify-between items-center mb-2">
            <span className={`${product?.salePrice > 0 ? "line-through" : ""} text-lg font-semibold text-primary`}>
              {formatINR(product?.price || 0)}
            </span>
            {product?.salePrice > 0 ? (
              <span className="text-lg font-bold">{formatINR(product?.salePrice)}</span>
            ) : null}
          </div>
          <div className="mb-2">
            <strong className="mr-2">Sizes:</strong>
            {(product?.sizes || []).map((s) => (
              <span key={s} className="inline-block bg-gray-100 px-2 py-1 text-sm rounded mr-1">
                {s}
              </span>
            ))}
          </div>
          <div className="mb-2 text-sm text-muted-foreground">Stock: {product?.totalStock || 0}</div>
        </CardContent>
        <CardFooter className="flex justify-between items-center">
          <Button
            onClick={() => {
              setOpenCreateProductsDialog(true);
              setCurrentEditedId(product?.id);
              setFormData({
                ...product,
                price: product?.price,
                salePrice: product?.salePrice,
                imageUrl: product?.image,
              });
              if (setUploadedImageUrl) setUploadedImageUrl(product?.image || "");
            }}
          >
            Edit
          </Button>
          <Button onClick={() => handleDelete(product?.id)}>Delete</Button>
        </CardFooter>
      </div>
    </Card>
  );
}

export default AdminProductTile;

import { Card, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { brandOptionsMap, categoryOptionsMap } from "@/config";
import { Badge } from "../ui/badge";
import { Heart } from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addToWishlist,
  removeFromWishlist,
} from "@/store/shop/wishlist-slice";
import GuestAccessDialog from "../common/auth-guard-dialog";
import { formatINR } from "@/lib/utils";

function ShoppingProductTile({
  product,
  handleGetProductDetails,
  handleAddtoCart,
  isWishlistPage = false,
}) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { wishlistItems } = useSelector((state) => state.shopWishlist);
  const [showGuestDialog, setShowGuestDialog] = useState(false);

  // Compute if product is in wishlist from Redux state
  const isInWishlist =
    wishlistItems?.some(
      (item) => item.product?.id === product?.id
    ) || false;

  function handleWishlistToggle(e) {
    e.stopPropagation();

    // If not authenticated, show guest dialog
    if (!user?.id) {
      setShowGuestDialog(true);
      return;
    }

    // Toggle wishlist
    if (isInWishlist) {
      dispatch(removeFromWishlist(product?.id));
    } else {
      dispatch(addToWishlist(product?.id));
    }
  }

  // Calculate discount percentage when applicable
  const hasDiscount = product?.salePrice > 0 && product?.salePrice < product?.price;
  const discountPercentage = hasDiscount 
    ? Math.round(((product?.price - product?.salePrice) / product?.price) * 100)
    : 0;

  return (
    <>
      <Card className="w-full max-w-sm mx-auto group transition-shadow hover:shadow-lg">
        <div onClick={() => handleGetProductDetails(product?.id)} className="cursor-pointer">
          {/* Image Container with Hover Zoom Effect */}
          <div className="relative overflow-hidden rounded-t-lg bg-gray-100">
            <img
              src={product?.image}
              alt={product?.title}
              className="w-full h-[300px] object-cover transition-transform duration-300 group-hover:scale-105"
            />
            
            {/* Stock/Sale Status Badge */}
            {product?.totalStock === 0 ? (
              <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
                Out Of Stock
              </Badge>
            ) : product?.totalStock < 10 ? (
              <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
                {`Only ${product?.totalStock} items left`}
              </Badge>
            ) : hasDiscount ? (
              <Badge className="absolute top-2 left-2 bg-green-600 hover:bg-green-700 text-white font-bold">
                {`-${discountPercentage}%`}
              </Badge>
            ) : null}

            {/* Wishlist Heart Icon */}
            <button
              onClick={handleWishlistToggle}
              className="absolute top-2 right-2 bg-white rounded-full p-2 hover:bg-gray-100 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <Heart
                size={20}
                className={`transition-all duration-200 ${
                  isInWishlist
                    ? "fill-red-500 text-red-500"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              />
            </button>
          </div>

          <CardContent className="p-3 sm:p-4">
            {/* Product Title */}
            <h2 className="text-sm sm:text-base md:text-lg font-bold mb-3 line-clamp-2 leading-snug">
              {product?.title}
            </h2>

            {/* Category and Brand */}
            <div className="flex justify-between items-center gap-2 mb-3 text-xs sm:text-sm">
              <span className="text-muted-foreground truncate">
                {categoryOptionsMap[product?.category]}
              </span>
              <span className="text-muted-foreground truncate">
                {brandOptionsMap[product?.brand]}
              </span>
            </div>

            {/* Price Display with Better Hierarchy */}
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                {product?.salePrice > 0 ? (
                  <>
                    <span className="text-xs sm:text-sm line-through text-gray-400 font-medium">
                      {formatINR(product?.price)}
                    </span>
                    <span className="text-base sm:text-lg font-bold text-green-600">
                      {formatINR(product?.salePrice)}
                    </span>
                  </>
                ) : (
                  <span className="text-base sm:text-lg font-bold text-primary">
                    {formatINR(product?.price)}
                  </span>
                )}
              </div>
            </div>
          </CardContent>
        </div>

        {/* Add to Cart Button */}
        <CardFooter className="p-3 sm:p-4 pt-0">
          {product?.totalStock === 0 ? (
            <Button 
              className="w-full opacity-60 cursor-not-allowed" 
              disabled
            >
              Out Of Stock
            </Button>
          ) : (
            <Button
              onClick={() => handleAddtoCart(product?.id, product?.totalStock)}
              className="w-full transition-all hover:shadow-md"
            >
              Add to cart
            </Button>
          )}
        </CardFooter>
      </Card>

      {/* Guest Access Dialog */}
      <GuestAccessDialog
        open={showGuestDialog}
        onOpenChange={setShowGuestDialog}
      />
    </>
  );
}

export default ShoppingProductTile;

import { StarIcon, Heart } from "lucide-react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "../ui/dialog";
import { Separator } from "../ui/separator";
import { Input } from "../ui/input";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { useToast } from "../ui/use-toast";
import { setProductDetails } from "@/store/shop/products-slice";
import { Label } from "../ui/label";
import StarRatingComponent from "../common/star-rating";
import { useEffect, useState } from "react";
import { addReview, getReviews } from "@/store/shop/review-slice";
import GuestAccessDialog from "@/components/common/auth-guard-dialog";
import { addToWishlist, removeFromWishlist } from "@/store/shop/wishlist-slice";
import { formatINR } from "@/lib/utils";

function ProductDetailsDialog({ open, setOpen, productDetails }) {
  const [reviewMsg, setReviewMsg] = useState("");
  const [rating, setRating] = useState(0);
  const [showGuestDialog, setShowGuestDialog] = useState(false);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { reviews } = useSelector((state) => state.shopReview);
  const { wishlistItems } = useSelector((state) => state.shopWishlist);

  const { toast } = useToast();

  const isInWishlist =
    wishlistItems?.some(
      (item) => item.product?.id === productDetails?.id
    ) || false;

  function handleWishlistToggle(e) {
    e.stopPropagation();
    if (!user?.id) {
      setShowGuestDialog(true);
      return;
    }

    if (isInWishlist) {
      dispatch(removeFromWishlist(productDetails?.id));
    } else {
      dispatch(addToWishlist(productDetails?.id));
    }
  }

  function handleRatingChange(getRating) {
    setRating(getRating);
  }

  function handleAddToCart(getCurrentProductId, getTotalStock) {
    if (!user?.id) {
      toast({ title: "Please login to continue shopping." });
      setShowGuestDialog(true);
      return;
    }

    let getCartItems = cartItems.items || [];

    if (getCartItems.length) {
      const indexOfCurrentItem = getCartItems.findIndex(
        (item) => item.productId === getCurrentProductId
      );
      if (indexOfCurrentItem > -1) {
        const getQuantity = getCartItems[indexOfCurrentItem].quantity;
        if (getQuantity + 1 > getTotalStock) {
          toast({
            title: `Only ${getQuantity} quantity can be added for this item`,
            variant: "destructive",
          });

          return;
        }
      }
    }
    dispatch(
      addToCart({
        userId: user?.id,
        productId: getCurrentProductId,
        quantity: 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
        toast({
          title: "Product is added to cart",
        });
      }
    });
  }

  function handleDialogClose() {
    setOpen(false);
    dispatch(setProductDetails());
    setRating(0);
    setReviewMsg("");
  }

  function handleAddReview() {
    if (!user?.id) {
      toast({ title: "Please login to continue shopping." });
      setShowGuestDialog(true);
      return;
    }

    dispatch(
      addReview({
        productId: productDetails?.id,
        userId: user?.id,
        userName: user?.userName,
        reviewMessage: reviewMsg,
        reviewValue: rating,
      })
    ).then((data) => {
      if (data.payload.success) {
        dispatch(fetchCartItems(user?.id));
        setRating(0);
        setReviewMsg("");
        dispatch(getReviews(productDetails?.id));
        toast({
          title: "Review added successfully!",
        });
      }
    });
  }

  useEffect(() => {
    if (productDetails !== null) dispatch(getReviews(productDetails?.id));
  }, [productDetails]);

  const averageReview =
    reviews && reviews.length > 0
      ? reviews.reduce((sum, reviewItem) => sum + reviewItem.reviewValue, 0) /
        reviews.length
      : 0;

  return (
    <>
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 p-5 sm:p-8 md:p-10 max-h-[90vh] overflow-y-auto max-w-[95vw] sm:max-w-[85vw] md:max-w-[80vw] lg:max-w-[70vw]">
        <DialogTitle className="sr-only">
          {productDetails?.title || "Product details"}
        </DialogTitle>
        <DialogDescription className="sr-only">
          {productDetails?.description || "Product details dialog"}
        </DialogDescription>
        
        {/* Left Column: Image wrapper */}
        <div className="relative overflow-hidden rounded-xl border border-gray-100 bg-gray-50 flex items-center justify-center h-fit">
          <img
            src={productDetails?.image}
            alt={productDetails?.title}
            width={600}
            height={600}
            className="aspect-square w-full object-cover shadow-sm transition-transform duration-300 hover:scale-[1.02]"
          />
        </div>

        {/* Right Column: Information & Reviews */}
        <div className="flex flex-col">
          {/* Header & Wishlist */}
          <div className="flex justify-between items-start gap-4 mb-2">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight leading-tight">
              {productDetails?.title}
            </h1>
            <button
              onClick={handleWishlistToggle}
              className="bg-white rounded-full p-2.5 hover:bg-gray-50 text-gray-400 hover:text-gray-600 transition-all duration-200 shadow-sm border border-gray-200/80 flex-shrink-0"
              aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
            >
              <Heart
                size={18}
                className={`transition-all duration-200 ${
                  isInWishlist
                    ? "fill-red-500 text-red-500"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              />
            </button>
          </div>

          {/* Stock Badge */}
          <div className="mb-4">
            {productDetails?.totalStock === 0 ? (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-800">
                Out of Stock
              </span>
            ) : productDetails?.totalStock <= 5 ? (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
                Only {productDetails?.totalStock} left
              </span>
            ) : (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                In Stock
              </span>
            )}
          </div>

          {/* Pricing & Rating Info */}
          <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
            <div className="flex items-baseline gap-3">
              {productDetails?.salePrice > 0 ? (
                <>
                  <span className="text-2xl sm:text-3xl font-extrabold text-green-600">
                    {formatINR(productDetails?.salePrice)}
                  </span>
                  <span className="text-sm sm:text-base text-gray-400 font-normal line-through">
                    {formatINR(productDetails?.price)}
                  </span>
                </>
              ) : (
                <span className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                  {formatINR(productDetails?.price)}
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5 py-1 px-2.5 rounded-lg bg-gray-50 border border-gray-100">
              <StarRatingComponent rating={averageReview} />
              <span className="text-xs sm:text-sm font-semibold text-gray-600">
                {averageReview.toFixed(1)}
              </span>
            </div>
          </div>

          {/* Product Description */}
          <p className="text-xs sm:text-sm leading-relaxed text-gray-600 mb-6">
            {productDetails?.description}
          </p>

          {/* Sizes */}
          {productDetails?.sizes && productDetails?.sizes.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xs sm:text-sm font-bold text-gray-900 mb-2">Available Sizes</h3>
              <div className="flex flex-wrap gap-2">
                {productDetails?.sizes.map((s) => (
                  <span
                    key={s}
                    className="inline-flex items-center justify-center border border-gray-200 rounded-md px-3 py-1.5 text-xs sm:text-sm font-medium text-gray-800 bg-white hover:border-gray-900 transition-colors duration-150 cursor-pointer"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Add To Cart */}
          <div className="mb-6">
            {productDetails?.totalStock === 0 ? (
              <Button className="w-full opacity-60 cursor-not-allowed" disabled>
                Out of Stock
              </Button>
            ) : (
              <Button
                className="w-full transition-all hover:shadow-md py-6 text-sm sm:text-base"
                onClick={() =>
                  handleAddToCart(
                    productDetails?.id,
                    productDetails?.totalStock
                  )
                }
              >
                Add to Cart
              </Button>
            )}
          </div>

          {/* Separator & Reviews Feed */}
          <Separator className="bg-gray-100" />
          
          <div className="pt-6 mt-6">
            <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-4">
              Customer Reviews ({reviews?.length || 0})
            </h2>
            
            <div className="max-h-[250px] overflow-y-auto space-y-3 pr-2 mb-6 scrollbar-thin">
              {reviews && reviews.length > 0 ? (
                reviews.map((reviewItem, index) => (
                  <div
                    key={reviewItem?.id ?? reviewItem?.reviewId ?? reviewItem?.userId ?? index}
                    className="p-4 rounded-lg bg-gray-50/50 border border-gray-100 flex gap-4 transition-all duration-200 hover:bg-gray-50"
                  >
                    <Avatar className="w-9 h-9 border border-gray-200/80 flex-shrink-0">
                      <AvatarFallback className="bg-gray-200 text-gray-700 font-semibold text-sm">
                        {reviewItem?.userName?.[0]?.toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <h3 className="font-semibold text-sm text-gray-900 truncate">
                          {reviewItem?.userName}
                        </h3>
                      </div>
                      <div className="flex items-center gap-0.5 mb-2">
                        <StarRatingComponent rating={reviewItem?.reviewValue} />
                      </div>
                      <p className="text-xs sm:text-sm text-gray-600 leading-relaxed break-words">
                        {reviewItem.reviewMessage}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 px-4 border border-dashed border-gray-200 rounded-lg">
                  <p className="text-sm font-semibold text-gray-900 mb-0.5">
                    No reviews yet
                  </p>
                  <p className="text-xs text-gray-500">
                    Be the first to share your thoughts!
                  </p>
                </div>
              )}
            </div>
            
            {/* Submit Review Box */}
            <div className="border-t border-gray-100 pt-6 space-y-4">
              <h3 className="text-sm sm:text-base font-bold text-gray-900">
                Write a review
              </h3>
              <div className="space-y-3 p-4 rounded-xl border border-gray-100 bg-white">
                <div className="flex flex-col gap-1.5">
                  <Label className="text-xs font-semibold text-gray-600">Overall Rating</Label>
                  <div className="flex gap-1 py-0.5">
                    <StarRatingComponent
                      rating={rating}
                      handleRatingChange={handleRatingChange}
                    />
                  </div>
                </div>
                
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="reviewMsg" className="text-xs font-semibold text-gray-600">Your Review</Label>
                  <Input
                    id="reviewMsg"
                    name="reviewMsg"
                    value={reviewMsg}
                    onChange={(event) => setReviewMsg(event.target.value)}
                    placeholder="What did you like or dislike? Write your review here..."
                    className="bg-gray-50/50 border-gray-200 focus:bg-white focus:ring-1 focus:ring-primary focus:border-primary transition-all text-sm h-10"
                  />
                </div>

                <Button
                  onClick={handleAddReview}
                  disabled={reviewMsg.trim() === ""}
                  className="w-full mt-2 transition-all hover:shadow-sm"
                >
                  Submit Review
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
    <GuestAccessDialog open={showGuestDialog} onOpenChange={setShowGuestDialog} />
    </>
  );
}

export default ProductDetailsDialog;

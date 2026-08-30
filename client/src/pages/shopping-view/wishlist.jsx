import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import ProductDetailsDialog from "@/components/shopping-view/product-details";
import GuestAccessDialog from "@/components/common/auth-guard-dialog";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { fetchProductDetails } from "@/store/shop/products-slice";
import { fetchWishlist } from "@/store/shop/wishlist-slice";

function WishlistPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { user } = useSelector((state) => state.auth);
  const { wishlistItems } = useSelector((state) => state.shopWishlist);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { productDetails } = useSelector((state) => state.shopProducts);

  const products = wishlistItems?.map((wishlistItem) => wishlistItem.product) || [];

  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [showGuestDialog, setShowGuestDialog] = useState(false);

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchWishlist());
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);

  function handleGetProductDetails(getCurrentProductId) {
    dispatch(fetchProductDetails(getCurrentProductId));
  }

  function handleAddtoCart(getCurrentProductId, getTotalStock) {
    if (!user?.id) {
      toast({ title: "Please login to continue shopping." });
      setShowGuestDialog(true);
      return;
    }

    let getCartItems = cartItems?.items || [];

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
    )
      .then((data) => {
        dispatch(fetchCartItems(user?.id));
        toast({
          title: "Product is added to cart",
        });
      })
      .catch(() => {});
  }

  if (!wishlistItems || wishlistItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center">
        <div className="bg-red-50 p-4 rounded-full mb-4">
          <Heart className="w-12 h-12 text-red-500 fill-red-500 animate-pulse" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Your wishlist is empty</h2>
        <p className="text-muted-foreground mb-6 max-w-sm">
          Browse products and save your favourites.
        </p>
        <Button onClick={() => navigate("/shop/listing")} className="px-6 py-2">
          Continue Shopping
        </Button>
        <GuestAccessDialog open={showGuestDialog} onOpenChange={setShowGuestDialog} />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-extrabold mb-8 flex items-center gap-2">
        <Heart className="text-red-500 fill-red-500" /> My Wishlist
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((productItem) => (
          <ShoppingProductTile
            key={productItem?.id}
            product={productItem}
            handleGetProductDetails={handleGetProductDetails}
            handleAddtoCart={handleAddtoCart}
            isWishlistPage={true}
          />
        ))}
      </div>
      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
      />
      <GuestAccessDialog open={showGuestDialog} onOpenChange={setShowGuestDialog} />
    </div>
  );
}

export default WishlistPage;

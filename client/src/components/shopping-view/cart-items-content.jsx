import { Minus, Plus, Trash } from "lucide-react";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { deleteCartItem, updateCartQuantity } from "@/store/shop/cart-slice";
import { useToast } from "../ui/use-toast";
import { useNavigate } from "react-router-dom";
import { fetchProductDetails } from "@/store/shop/products-slice";
import { formatINR } from "@/lib/utils";

function UserCartItemsContent({ cartItem, setOpenCartSheet }) {
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { productList } = useSelector((state) => state.shopProducts);
  const dispatch = useDispatch();
  const { toast } = useToast();
  const navigate = useNavigate();

  function handleProductClick() {
    if (setOpenCartSheet) {
      setOpenCartSheet(false);
    }
    dispatch(fetchProductDetails(cartItem?.product?.id));
    navigate("/shop/listing");
  }

  function handleUpdateQuantity(getCartItem, typeOfAction) {
    if (typeOfAction == "plus") {
      let getCartItems = cartItems.items || [];

      if (getCartItems.length) {
        const indexOfCurrentCartItem = getCartItems.findIndex(
          (item) => item.productId === getCartItem?.product?.id
        );

        const getCurrentProductIndex = productList.findIndex(
          (product) => product.id === getCartItem?.product?.id
        );
        const getTotalStock = productList[getCurrentProductIndex].totalStock;

        if (indexOfCurrentCartItem > -1) {
          const getQuantity = getCartItems[indexOfCurrentCartItem].quantity;
          if (getQuantity + 1 > getTotalStock) {
            toast({
              title: `Only ${getQuantity} quantity can be added for this item`,
              variant: "destructive",
            });

            return;
          }
        }
      }
    }

    dispatch(
      updateCartQuantity({
        userId: user?.id,
        productId: getCartItem?.product?.id,
        quantity:
          typeOfAction === "plus"
            ? getCartItem?.quantity + 1
            : getCartItem?.quantity - 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        toast({
          title: "Cart item is updated successfully",
        });
      }
    });
  }

  function handleCartItemDelete(getCartItem) {
    dispatch(
      deleteCartItem({ userId: user?.id, productId: getCartItem?.product?.id })
    ).then((data) => {
      if (data?.payload?.success) {
        toast({
          title: "Cart item is deleted successfully",
        });
      }
    });
  }

  return (
    <div className="flex items-center space-x-3 sm:space-x-4 border-b border-gray-100 pb-4 last:border-0 last:pb-0">
      {/* Product Image Thumbnail */}
      <img
        src={cartItem?.product?.image}
        alt={cartItem?.product?.title}
        onClick={handleProductClick}
        className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg border border-gray-100 bg-gray-50 object-cover cursor-pointer hover:opacity-90 transition-opacity flex-shrink-0"
      />
      
      {/* Product Details Middle Container */}
      <div className="flex-1 min-w-0">
        <h3
          onClick={handleProductClick}
          className="text-xs sm:text-sm font-bold text-gray-900 leading-snug hover:text-primary transition-colors cursor-pointer line-clamp-2"
        >
          {cartItem?.product?.title}
        </h3>
        
        {/* Quantity Controls Container */}
        <div className="flex items-center border border-gray-200 rounded-lg p-0.5 bg-gray-50/50 w-fit mt-1.5 sm:mt-2">
          <Button
            variant="ghost"
            className="h-6 w-6 sm:h-7 sm:w-7 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100/80 disabled:opacity-30 transition-all"
            size="icon"
            disabled={cartItem?.quantity === 1}
            onClick={() => handleUpdateQuantity(cartItem, "minus")}
          >
            <Minus className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            <span className="sr-only">Decrease</span>
          </Button>
          <span className="text-[11px] sm:text-xs font-semibold px-2 text-gray-800 select-none min-w-[16px] text-center">
            {cartItem?.quantity}
          </span>
          <Button
            variant="ghost"
            className="h-6 w-6 sm:h-7 sm:w-7 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100/80 transition-all"
            size="icon"
            onClick={() => handleUpdateQuantity(cartItem, "plus")}
          >
            <Plus className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            <span className="sr-only">Increase</span>
          </Button>
        </div>
      </div>

      {/* Pricing & Delete Control Right Container */}
      <div className="flex flex-col items-end justify-between h-16 sm:h-20 flex-shrink-0 self-start pt-0.5">
        <span className="text-xs sm:text-sm font-bold text-gray-900">
          {formatINR(
            (cartItem?.product?.salePrice > 0 ? cartItem?.product?.salePrice : cartItem?.product?.price) *
            cartItem?.quantity
          )}
        </span>
        <button
          onClick={() => handleCartItemDelete(cartItem)}
          className="text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md p-1 sm:p-1.5 transition-all duration-200 cursor-pointer"
          aria-label="Remove item"
        >
          <Trash size={15} />
        </button>
      </div>
    </div>
  );
}

export default UserCartItemsContent;

import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import UserCartItemsContent from "./cart-items-content";
import { useSelector } from "react-redux";
import { useToast } from "../ui/use-toast";
import { ShoppingBag } from "lucide-react";
import { formatINR } from "@/lib/utils";

function UserCartWrapper({ cartItems, setOpenCartSheet }) {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { toast } = useToast();

  const totalCartAmount =
    cartItems && cartItems.length > 0
      ? cartItems.reduce(
          (sum, currentItem) =>
            sum +
            (currentItem?.salePrice > 0
              ? currentItem?.salePrice
              : currentItem?.price) *
              currentItem?.quantity,
          0
        )
      : 0;

  return (
    <SheetContent className="sm:max-w-md flex flex-col h-full bg-white p-5 sm:p-6">
      <SheetHeader className="border-b border-gray-100 pb-4">
        <SheetTitle className="text-lg font-extrabold text-gray-900 tracking-tight">
          Your Cart
        </SheetTitle>
        <p className="text-xs text-muted-foreground mt-0.5">
          Review your selected items
        </p>
      </SheetHeader>

      {/* Cart items list or Empty cart state */}
      <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1 scrollbar-thin">
        {cartItems && cartItems.length > 0 ? (
          cartItems.map((item) => (
            <UserCartItemsContent
              key={item?.productId || item?.product?.id}
              cartItem={item}
              setOpenCartSheet={setOpenCartSheet}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-full py-12 px-4 text-center">
            <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mb-4 border border-gray-100">
              <ShoppingBag className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-base font-bold text-gray-900 mb-1">
              Your cart is empty
            </h3>
            <p className="text-xs text-gray-500 max-w-[220px] mb-6 leading-relaxed">
              Looks like you haven't added anything yet.
            </p>
            <Button
              onClick={() => {
                setOpenCartSheet(false);
                navigate("/shop/home");
              }}
              variant="outline"
              size="sm"
              className="text-xs font-semibold px-6 hover:bg-gray-50/80 transition-colors"
            >
              Continue Shopping
            </Button>
          </div>
        )}
      </div>

      {/* Summary and Action buttons */}
      {cartItems && cartItems.length > 0 && (
        <div className="border-t border-gray-100 pt-4 mt-auto space-y-4 bg-white">
          <div className="flex justify-between items-center">
            <span className="text-sm font-semibold text-gray-600">Subtotal</span>
            <span className="text-lg font-extrabold text-gray-900">
              {formatINR(totalCartAmount)}
            </span>
          </div>

          <Button
            onClick={() => {
              if (!user?.id) {
                toast({ title: "Please login to continue shopping." });
                navigate("/auth/login", {
                  state: {
                    from: "/shop/checkout",
                    message: "Please login to continue shopping.",
                  },
                });
                setOpenCartSheet(false);
                return;
              }
              navigate("/shop/checkout");
              setOpenCartSheet(false);
            }}
            className="w-full py-6 font-semibold transition-all hover:shadow-md"
          >
            Checkout
          </Button>
        </div>
      )}
    </SheetContent>
  );
}

export default UserCartWrapper;

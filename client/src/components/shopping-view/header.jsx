
import { LogOut, Menu, ShoppingBag, ShoppingCart, UserCog } from "lucide-react";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { shoppingViewHeaderMenuItems } from "@/config";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { logoutUser } from "@/store/auth-slice";
import UserCartWrapper from "./cart-wrapper";
import { useEffect, useState } from "react";
import { fetchCartItems } from "@/store/shop/cart-slice";
import { Label } from "../ui/label";


function MenuItems() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { wishlistItems } = useSelector((state) => state.shopWishlist);
  const categoryParam = searchParams.get("category");

  function handleNavigate(getCurrentMenuItem) {
    sessionStorage.removeItem("filters");
    const currentFilter =
      getCurrentMenuItem.id !== "home" &&
        getCurrentMenuItem.id !== "products" &&
        getCurrentMenuItem.id !== "search"
        ? {
          category: [getCurrentMenuItem.id],
        }
        : null;

    sessionStorage.setItem("filters", JSON.stringify(currentFilter));

    location.pathname.includes("listing") && currentFilter !== null
      ? setSearchParams(
        new URLSearchParams(`?category=${getCurrentMenuItem.id}`)
      )
      : navigate(getCurrentMenuItem.path);
  }

  return (
    <nav className="flex flex-col mb-3 lg:mb-0 lg:items-center gap-6 lg:flex-row">
      {shoppingViewHeaderMenuItems.map((menuItem) => {
        const isActive =
          menuItem.id === "home"
            ? location.pathname === "/shop/home"
            : menuItem.id === "search"
            ? location.pathname === "/shop/search"
            : menuItem.id === "wishlist"
            ? location.pathname === "/shop/wishlist"
            : menuItem.id === "products"
            ? location.pathname === "/shop/listing" && !categoryParam
            : location.pathname === "/shop/listing" && categoryParam === menuItem.id;

        return (
          <Label
            onClick={() => handleNavigate(menuItem)}
            className={`text-sm font-medium cursor-pointer transition-colors duration-200 ${
              isActive
                ? "text-primary font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
            key={menuItem.id}
          >
            <span className="flex items-center gap-1.5 relative py-1">
              {menuItem.label}
              {menuItem.id === "wishlist" ? (
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                  {wishlistItems.length}
                </span>
              ) : null}
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full hidden lg:block animate-in fade-in slide-in-from-bottom-1 duration-200" />
              )}
            </span>
          </Label>
        );
      })}
    </nav>
  );
}

function HeaderRightContent() {
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);

  const [openCartSheet, setOpenCartSheet] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  function handleLogout() {
    dispatch(logoutUser());
    navigate("/shop/home", { replace: true });
  }

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchCartItems(user.id));
    }
  }, [dispatch, user]);

  const totalCartQuantity = (cartItems?.items || []).reduce(
    (total, item) => total + (Number(item?.quantity) || 0),
    0
  );

  return (
    <div className="flex lg:items-center lg:flex-row flex-col gap-4">
      <Sheet open={openCartSheet} onOpenChange={setOpenCartSheet}>
        <Button
          onClick={() => setOpenCartSheet(true)}
          variant="outline"
          size="icon"
          className="relative hover:bg-gray-50/80 transition-colors"
        >
          <ShoppingCart className="w-5 h-5 text-gray-700" />

          <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white shadow-sm ring-2 ring-background">
            {totalCartQuantity}
          </span>

          <span className="sr-only">User Cart</span>
        </Button>

        <UserCartWrapper
          setOpenCartSheet={setOpenCartSheet}
          cartItems={cartItems?.items || []}
        />
      </Sheet>

      {user?.id ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="bg-black cursor-pointer ring-2 ring-transparent hover:ring-primary/50 transition-all duration-200">
              <AvatarFallback className="bg-black text-white font-extrabold">
                {user?.userName?.[0]?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>

        <DropdownMenuContent side="right" className="w-56">
          <DropdownMenuLabel>
            Logged in as {user?.userName || "Guest"}
          </DropdownMenuLabel>

          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={() => navigate("/shop/account")}>
            <UserCog className="mr-2 h-4 w-4" />
            Account
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      ) : (
        <div className="flex flex-col sm:flex-row gap-2">
          <Button asChild variant="outline" size="sm" className="transition-all hover:bg-gray-50">
            <Link to="/auth/login">Login</Link>
          </Button>
          <Button asChild variant="default" size="sm" className="transition-all hover:opacity-90">
            <Link to="/auth/register">Register</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
function ShoppingHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">

        <Link to="/shop/home" className="flex items-center gap-2 group transition-all duration-200">
          <ShoppingBag className="h-6 w-6 text-primary group-hover:scale-105 transition-transform duration-200" />
          <span className="font-extrabold tracking-tight text-xl text-gray-900 group-hover:text-primary transition-colors duration-200">
            ShopNest
          </span>
        </Link>

        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="lg:hidden"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>

          <SheetContent side="left" className="w-full max-w-xs flex flex-col gap-6 pt-10">
            <div className="flex items-center gap-2 pb-4 border-b border-gray-100">
              <ShoppingBag className="h-6 w-6 text-primary" />
              <span className="font-extrabold tracking-tight text-xl text-gray-900">
                ShopNest
              </span>
            </div>
            <div className="flex-1 overflow-y-auto">
              <MenuItems />
            </div>
            <div className="pt-4 border-t border-gray-100">
              <HeaderRightContent />
            </div>
          </SheetContent>
        </Sheet>

        <div className="hidden lg:block">
          <MenuItems />
        </div>

        <div className="hidden lg:block">
          <HeaderRightContent />
        </div>

      </div>
    </header>
  );
}

export default ShoppingHeader;
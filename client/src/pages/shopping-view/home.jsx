import { Button } from "@/components/ui/button";
import bannerOne from "../../assets/banner-1.webp";
import bannerTwo from "../../assets/banner-2.webp";
import bannerThree from "../../assets/banner-3.webp";
import {
  Airplay,
  BabyIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CloudLightning,
  Heater,
  Images,
  Shirt,
  ShirtIcon,
  ShoppingBasket,
  UmbrellaIcon,
  WashingMachine,
  WatchIcon,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllFilteredProducts,
  fetchProductDetails,
} from "@/store/shop/products-slice";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { useNavigate } from "react-router-dom";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { useToast } from "@/components/ui/use-toast";
import ProductDetailsDialog from "@/components/shopping-view/product-details";
import { getFeatureImages } from "@/store/common-slice";
import GuestAccessDialog from "@/components/common/auth-guard-dialog";
import { fetchWishlist } from "@/store/shop/wishlist-slice";

const categoriesWithIcon = [
  { id: "men", label: "Men", icon: ShirtIcon },
  { id: "women", label: "Women", icon: CloudLightning },
  { id: "kids", label: "Kids", icon: BabyIcon },
  { id: "accessories", label: "Accessories", icon: WatchIcon },
  { id: "footwear", label: "Footwear", icon: UmbrellaIcon },
];

const brandsWithIcon = [
  { id: "nike", label: "Nike", icon: Shirt },
  { id: "adidas", label: "Adidas", icon: WashingMachine },
  { id: "puma", label: "Puma", icon: ShoppingBasket },
  { id: "levi", label: "Levi's", icon: Airplay },
  { id: "zara", label: "Zara", icon: Images },
  { id: "h&m", label: "H&M", icon: Heater },
];

function ShoppingHome() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const { productList, productDetails, isLoading } = useSelector(
    (state) => state.shopProducts,
  );

  const { featureImageList } = useSelector((state) => state.commonFeature);

  // Use dynamic feature images if available,
  // otherwise fall back to static banners
  const slides =
    featureImageList && featureImageList.length > 0
      ? featureImageList
      : [{ image: bannerOne }, { image: bannerTwo }, { image: bannerThree }];

  const activeSlideIndex =
    slides.length > 0 ? Math.min(currentSlide, slides.length - 1) : 0;

  const activeSlide = slides[activeSlideIndex];

  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [showGuestDialog, setShowGuestDialog] = useState(false);

  const { user } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  function handleNavigateToListingPage(getCurrentItem, section) {
    sessionStorage.removeItem("filters");

    const currentFilter = {
      [section]: [getCurrentItem.id],
    };

    sessionStorage.setItem("filters", JSON.stringify(currentFilter));

    navigate(`/shop/listing`);
  }

  function handleGetProductDetails(getCurrentProductId) {
    dispatch(fetchProductDetails(getCurrentProductId));
  }

  function handleAddtoCart(getCurrentProductId) {
    if (!user?.id) {
      toast({
        title: "Please login to continue shopping.",
      });

      setShowGuestDialog(true);
      return;
    }

    dispatch(
      addToCart({
        userId: user?.id,
        productId: getCurrentProductId,
        quantity: 1,
      }),
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id));

        toast({
          title: "Product is added to cart",
        });
      }
    });
  }

  useEffect(() => {
    if (productDetails !== null) {
      setOpenDetailsDialog(true);
    }
  }, [productDetails]);

  useEffect(() => {
    setCurrentSlide(0);
  }, [featureImageList]);

  useEffect(() => {
    if (slides.length <= 1) {
      return undefined;
    }

    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [slides.length]);

  useEffect(() => {
    dispatch(
      fetchAllFilteredProducts({
        filterParams: {},
        sortParams: "price-lowtohigh",
      }),
    );
  }, [dispatch]);

  useEffect(() => {
    dispatch(getFeatureImages());
  }, [dispatch]);

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchWishlist());
    }
  }, [dispatch, user]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* ==================== HERO CAROUSEL ==================== */}
      <div>
        <div className="relative w-full h-[220px] sm:h-[300px] md:h-[400px] lg:h-[500px] xl:h-[600px] overflow-hidden">
          {activeSlide ? (
            <picture>
              <source
                media="(max-width: 639px)"
                srcSet={
                  activeSlide.mobileImage ||
                  activeSlide.tabletImage ||
                  activeSlide.desktopImage ||
                  activeSlide.image
                }
              />

              <source
                media="(min-width: 640px) and (max-width: 1023px)"
                srcSet={
                  activeSlide.tabletImage ||
                  activeSlide.desktopImage ||
                  activeSlide.image
                }
              />

              <source
                media="(min-width: 1024px)"
                srcSet={activeSlide.desktopImage || activeSlide.image}
              />

              <img
                src={
                  activeSlide.mobileImage ||
                  activeSlide.tabletImage ||
                  activeSlide.desktopImage ||
                  activeSlide.image
                }
                alt="ShopNest banner"
                className="w-full h-full object-cover banner-fade"
              />
            </picture>
          ) : null}

          {/* Previous Button */}
          {slides.length > 1 && (
            <Button
              variant="outline"
              size="icon"
              onClick={() =>
                setCurrentSlide(
                  (prevSlide) =>
                    (prevSlide - 1 + slides.length) % slides.length,
                )
              }
              className="absolute top-1/2 left-2 sm:left-4 -translate-y-1/2 bg-white/90 hover:bg-white shadow-md"
              aria-label="Previous banner"
            >
              <ChevronLeftIcon className="w-5 h-5 sm:w-6 sm:h-6" />
            </Button>
          )}

          {/* Next Button */}
          {slides.length > 1 && (
            <Button
              variant="outline"
              size="icon"
              onClick={() =>
                setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length)
              }
              className="absolute top-1/2 right-2 sm:right-4 -translate-y-1/2 bg-white/90 hover:bg-white shadow-md"
              aria-label="Next banner"
            >
              <ChevronRightIcon className="w-5 h-5 sm:w-6 sm:h-6" />
            </Button>
          )}
        </div>

        {/* Carousel Indicators */}
        {slides.length > 1 && (
          <div className="flex justify-center items-center gap-3 py-4">
            {slides.map((slide, index) => (
              <button
                key={slide?.id ?? index}
                type="button"
                aria-label={`Go to banner ${index + 1}`}
                onClick={() => setCurrentSlide(index)}
                className={`rounded-full transition-all duration-300 ${
                  index === activeSlideIndex
                    ? "h-3 w-7 bg-primary"
                    : "h-3 w-3 bg-gray-300 hover:bg-gray-400"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* ==================== CATEGORIES ==================== */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-center text-gray-900 tracking-tight mb-8 md:mb-12">
            Shop by category
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 lg:gap-6">
            {categoriesWithIcon.map((categoryItem) => (
              <Card
                key={categoryItem.id}
                onClick={() =>
                  handleNavigateToListingPage(categoryItem, "category")
                }
                className="group cursor-pointer bg-white border border-gray-100 rounded-xl hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 ease-out"
              >
                <CardContent className="flex flex-col items-center justify-center p-4 sm:p-6 min-h-[140px] sm:min-h-[160px]">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gray-50 flex items-center justify-center mb-4 transition-all duration-300 group-hover:bg-primary/10">
                    <categoryItem.icon className="w-7 h-7 sm:w-8 sm:h-8 text-gray-500 transition-all duration-300 group-hover:text-primary group-hover:scale-110" />
                  </div>

                  <span className="text-sm sm:text-base font-semibold text-gray-800 tracking-tight transition-colors duration-300 group-hover:text-primary">
                    {categoryItem.label}
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== BRANDS ==================== */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-center text-gray-900 tracking-tight mb-8 md:mb-12">
            Shop by Brand
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {brandsWithIcon.map((brandItem) => (
              <Card
                key={brandItem.id}
                onClick={() => handleNavigateToListingPage(brandItem, "brand")}
                className="group cursor-pointer bg-white border border-gray-200/70 rounded-lg hover:border-gray-400 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 ease-out"
              >
                <CardContent className="flex items-center justify-center gap-3 p-4 sm:p-5">
                  <brandItem.icon className="w-5 h-5 text-gray-400 group-hover:text-gray-900 transition-all duration-300" />
                  <span className="text-sm sm:text-base font-semibold text-gray-700 transition-colors duration-300 group-hover:text-gray-900">
                    {brandItem.label}
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== FEATURED PRODUCTS ==================== */}
      <section className="py-16 md:py-24 bg-slate-50/30 border-t border-gray-100/70">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10 md:mb-16 max-w-xl mx-auto">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight mb-2 sm:mb-3">
              Featured Products
            </h2>
            <p className="text-sm sm:text-base text-gray-500 font-medium">
              Discover products picked for you
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
            {isLoading ? (
              [1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="w-full max-w-sm mx-auto rounded-lg border bg-white overflow-hidden shadow-sm"
                >
                  <Skeleton className="h-[300px] w-full" />

                  <div className="p-3 sm:p-4 space-y-3">
                    <Skeleton className="h-5 w-3/4" />
                    <div className="flex justify-between items-center gap-2">
                      <Skeleton className="h-4 w-1/4" />
                      <Skeleton className="h-4 w-1/4" />
                    </div>
                    <Skeleton className="h-6 w-1/3" />
                  </div>

                  <div className="p-3 sm:p-4 pt-0">
                    <Skeleton className="h-10 w-full" />
                  </div>
                </div>
              ))
            ) : productList && productList.length > 0 ? (
              productList.map((productItem) => (
                <ShoppingProductTile
                  key={productItem.id}
                  handleGetProductDetails={handleGetProductDetails}
                  product={productItem}
                  handleAddtoCart={handleAddtoCart}
                />
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center py-16 px-4 text-center bg-white border border-gray-100 rounded-2xl max-w-md mx-auto shadow-sm">
                <div className="text-6xl mb-6">🛍️</div>

                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  No products available
                </h3>

                <p className="text-sm sm:text-base text-gray-500">
                  Please check back later for new products.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ==================== PRODUCT DETAILS ==================== */}
      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
      />

      {/* ==================== GUEST ACCESS ==================== */}
      <GuestAccessDialog
        open={showGuestDialog}
        onOpenChange={setShowGuestDialog}
      />
    </div>
  );
}

export default ShoppingHome;

import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

function CheckAuth({ children }) {
  const location = useLocation();
  const { isAuthenticated, user, isLoading } = useSelector(
    (state) => state.auth
  );

  if (isLoading) {
    return <Skeleton className="w-full min-h-[600px] bg-black" />;
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/auth/login"
        replace
        state={{
          from: location.pathname + location.search,
          message: "Please login to continue.",
        }}
      />
    );
  }

  if (!user || user.role !== "ADMIN") {
    return <Navigate to="/shop/home" replace />;
  }

  return <>{children}</>;
}

export default CheckAuth;
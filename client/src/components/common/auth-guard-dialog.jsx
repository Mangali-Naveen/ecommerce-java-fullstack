import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { useLocation, useNavigate } from "react-router-dom";

function GuestAccessDialog({ open, onOpenChange }) {
  const navigate = useNavigate();
  const location = useLocation();

  function handleLogin() {
    onOpenChange(false);
    navigate("/auth/login", {
      state: {
        from: location.pathname + location.search,
        message: "Please login to continue shopping.",
      },
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Login Required</DialogTitle>
          <DialogDescription>
            Please login to continue shopping.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex gap-2 sm:justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Continue Browsing
          </Button>
          <Button onClick={handleLogin}>Login</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default GuestAccessDialog;

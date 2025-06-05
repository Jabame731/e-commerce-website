"use client";

import { Button } from "@/components/ui/button";
import { removeItemFromCart } from "@/lib/actions/cart.actions";
import { CartItem } from "@/types";
import { MinusIcon } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";

const RemoveItemCartButton = ({ item }: { item: CartItem }) => {
  const [isPending, startTransition] = useTransition();
  return (
    <Button
      disabled={isPending}
      variant="outline"
      type="button"
      onClick={() =>
        startTransition(async () => {
          const res = await removeItemFromCart(item.productId);

          if (!res.success) {
            toast.error(res.message);
          }
        })
      }
    >
      <MinusIcon className="w-4 h-4" />
    </Button>
  );
};

export default RemoveItemCartButton;

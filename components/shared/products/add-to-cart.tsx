"use client";

import { Button } from "@/components/ui/button";

import { CartItem } from "@/types";
import { CheckIcon, PlusIcon } from "lucide-react";
import { toast } from "sonner";
import { addItemToCart } from "@/lib/actions/cart.actions";
import { useRouter } from "next/navigation";

const AddToCart = ({ item }: { item: CartItem }) => {
  const router = useRouter();

  const handleAddToCard = async () => {
    const res = await addItemToCart(item);

    if (!res.success) {
      toast.error(res.message);

      return;
    }

    //handle success add to cart
    toast.success(res.message, {
      icon: (
        <CheckIcon className="text-green-500 w-5 h-5 rounded-full bg-green-100" />
      ),
      action: (
        <Button
          className="bg-primary cursor-pointer text-white hover:bg-gray-800 "
          onClick={() => router.push("/cart")}
        >
          Go to Cart
        </Button>
      ),
    });
  };

  return (
    <Button
      className="w-full cursor-pointer "
      type="button"
      onClick={handleAddToCard}
    >
      <PlusIcon />
      Add To Cart
    </Button>
  );
};

export default AddToCart;

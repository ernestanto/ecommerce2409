import { useMemo } from "react";
import { useSelector } from "react-redux";
import { selectCart } from "../features/cartSlice";

const useCartSummary = () => {
  const cart = useSelector(selectCart);

  const { totalItems, totalPrice } = useMemo(() => {
    let totalItems = 0;
    let totalPrice = 0;

    cart.forEach((item) => {
      // ----- Normalise values -----
      const qty   = Number(item.quantity) || 1;            // default 1
      const price = Number(item.price);                    // convert string → number

      // ----- Accumulate safely -----
      if (!isNaN(price)) {
        totalItems += qty;
        totalPrice += qty * price;
      }
    });

    return { totalItems, totalPrice };
  }, [cart]);

  return { totalItems, totalPrice };
};

export default useCartSummary;



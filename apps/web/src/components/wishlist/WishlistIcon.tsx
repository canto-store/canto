import { Heart } from "lucide-react";
import React from "react";

const WishlistIcon: React.FC = () => {
  const count = 0;
  return (
    <span className="inline-block">
      <Heart className="h-5 w-5" />
      {count > 0 && (
        <span className="bg-secondary text-secondary-foreground absolute top-3 right-1.5 flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold shadow">
          {count}
        </span>
      )}
    </span>
  );
};

export default WishlistIcon;

import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin } from "lucide-react";
import { PopularFoodItem } from "@/types/database";

interface FoodCardProps {
  item: PopularFoodItem;
}

const FoodCard = ({ item }: FoodCardProps) => {
  return (
    <Link to={`/food/${item.food_item_id}`}>
      <Card className="group overflow-hidden border-border hover:shadow-hover transition-all duration-300 cursor-pointer">
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={item.image_url || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800"}
            alt={item.food_item_name}
            className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-card" />
          <div className="absolute top-3 right-3 flex gap-2">
            {item.is_vegetarian && (
              <Badge className="bg-green-500 text-white border-0">Veg</Badge>
            )}
            {item.is_vegan && (
              <Badge className="bg-green-600 text-white border-0">Vegan</Badge>
            )}
          </div>
          <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-background/90 backdrop-blur px-2 py-1 rounded-full">
            <Star className="h-4 w-4 fill-primary text-primary" />
            <span className="font-semibold text-sm">{item.average_rating.toFixed(1)}</span>
            <span className="text-xs text-muted-foreground">({item.review_count})</span>
          </div>
        </div>
        <div className="p-4">
          <h3 className="font-bold text-lg mb-1 line-clamp-1">{item.food_item_name}</h3>
          <div className="flex items-center text-sm text-muted-foreground mb-2">
            <MapPin className="h-3 w-3 mr-1" />
            <span className="line-clamp-1">{item.location_name}</span>
          </div>
          {item.average_price && (
            <p className="font-semibold text-primary">₹{item.average_price.toFixed(0)}</p>
          )}
        </div>
      </Card>
    </Link>
  );
};

export default FoodCard;

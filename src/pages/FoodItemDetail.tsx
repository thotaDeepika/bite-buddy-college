import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { FoodItemWithDetails, Review } from "@/types/database";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Star, MapPin, Heart, ArrowLeft, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import ReviewForm from "@/components/ReviewForm";
import ReviewList from "@/components/ReviewList";

const FoodItemDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [foodItem, setFoodItem] = useState<FoodItemWithDetails | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    checkUser();
    fetchFoodItem();
    fetchReviews();
  }, [id]);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
    if (user) {
      checkFavorite(user.id);
    }
  };

  const checkFavorite = async (userId: string) => {
    const { data } = await supabase
      .from('favorites')
      .select('*')
      .eq('user_id', userId)
      .eq('food_item_id', id)
      .single();
    
    setIsFavorite(!!data);
  };

  const fetchFoodItem = async () => {
    try {
      const { data, error } = await supabase
        .from('food_items')
        .select(`
          *,
          locations (
            location_name,
            address,
            location_type
          ),
          food_categories (
            category_name
          )
        `)
        .eq('food_item_id', id)
        .single();

      if (error) throw error;
      setFoodItem(data);
    } catch (error: any) {
      toast({
        title: "Error loading food item",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          user:users (
            username,
            avatar_url
          )
        `)
        .eq('food_item_id', id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReviews(data || []);
    } catch (error: any) {
      console.error("Error loading reviews:", error);
    }
  };

  const toggleFavorite = async () => {
    if (!user) {
      navigate('/auth');
      return;
    }

    try {
      if (isFavorite) {
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('food_item_id', id);

        if (error) throw error;
        setIsFavorite(false);
        toast({ title: "Removed from favorites" });
      } else {
        const { error } = await supabase
          .from('favorites')
          .insert({
            user_id: user.id,
            food_item_id: id,
          });

        if (error) throw error;
        setIsFavorite(true);
        toast({ title: "Added to favorites" });
      }
    } catch (error: any) {
      toast({
        title: "Error updating favorites",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  const calculateAveragePrice = () => {
    const reviewsWithPrice = reviews.filter(r => r.price_paid);
    if (reviewsWithPrice.length === 0) return null;
    const sum = reviewsWithPrice.reduce((acc, review) => acc + (review.price_paid || 0), 0);
    return (sum / reviewsWithPrice.length).toFixed(0);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8 animate-pulse">
          <div className="bg-muted h-96 rounded-lg mb-8" />
          <div className="space-y-4">
            <div className="bg-muted h-8 w-3/4 rounded" />
            <div className="bg-muted h-6 w-1/2 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!foodItem) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Food item not found</h1>
          <Button onClick={() => navigate('/')} aria-label="Go back to home page">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  const avgRating = calculateAverageRating();
  const avgPrice = calculateAveragePrice();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)} 
          className="mb-4"
          aria-label="Go back to previous page"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Image Section */}
          <div className="relative aspect-square rounded-lg overflow-hidden shadow-card bg-muted">
            {foodItem.image_url ? (
              <img
                src={foodItem.image_url}
                alt={foodItem.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground text-lg">
                No image available
              </div>
            )}
          </div>

          {/* Info Section */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">{foodItem.name}</h1>
              <div className="flex items-center gap-2 text-muted-foreground mb-4">
                <MapPin className="h-5 w-5" />
                <span className="text-lg">{foodItem.locations?.location_name}</span>
              </div>
              
              <div className="flex items-center gap-6 mb-4">
                <div className="flex items-center gap-2">
                  <Star className="h-6 w-6 fill-accent text-accent" />
                  <span className="text-2xl font-semibold">{avgRating}</span>
                  <span className="text-muted-foreground">({reviews.length} reviews)</span>
                </div>
                {avgPrice && (
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-muted-foreground" />
                    <span className="text-xl font-semibold">₹{avgPrice}</span>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {foodItem.food_categories && (
                  <Badge variant="secondary">{foodItem.food_categories.category_name}</Badge>
                )}
                {foodItem.is_vegetarian && <Badge className="bg-green-500">Vegetarian</Badge>}
                {foodItem.is_vegan && <Badge className="bg-green-600">Vegan</Badge>}
                {foodItem.spice_level && (
                  <Badge variant="outline">🌶️ Level {foodItem.spice_level}</Badge>
                )}
              </div>

              <Button 
                onClick={toggleFavorite}
                variant={isFavorite ? "default" : "outline"}
                size="lg"
                className="w-full"
                aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
              >
                <Heart className={`mr-2 h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
                {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
              </Button>
            </div>

            {foodItem.description && (
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-muted-foreground">{foodItem.description}</p>
                </CardContent>
              </Card>
            )}

            {foodItem.allergens && (
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-2 text-destructive">Allergens</h3>
                  <p className="text-sm">{foodItem.allergens}</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Reviews Section */}
        <div className="space-y-8">
          <div>
            <h2 className="text-3xl font-bold mb-6">Reviews</h2>
            {user ? (
              <ReviewForm 
                foodItemId={id!} 
                onReviewSubmitted={() => {
                  fetchReviews();
                  fetchFoodItem();
                }} 
              />
            ) : (
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="mb-4 text-muted-foreground">Sign in to write a review</p>
                  <Button onClick={() => navigate('/auth')} aria-label="Sign in to write a review">
                    Sign In
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          <ReviewList reviews={reviews} onReviewDeleted={fetchReviews} />
        </div>
      </div>
    </div>
  );
};

export default FoodItemDetail;

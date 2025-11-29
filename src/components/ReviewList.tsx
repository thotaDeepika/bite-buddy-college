import { Review } from "@/types/database";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, DollarSign, Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";

interface ReviewListProps {
  reviews: Review[];
  onReviewDeleted: () => void;
}

const ReviewList = ({ reviews, onReviewDeleted }: ReviewListProps) => {
  const { toast } = useToast();
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setCurrentUserId(user?.id || null);
  };

  const handleDelete = async (reviewId: string) => {
    try {
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', reviewId);

      if (error) throw error;

      toast({ title: "Review deleted" });
      onReviewDeleted();
    } catch (error: any) {
      toast({
        title: "Error deleting review",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  if (reviews.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6 text-center">
          <p className="text-muted-foreground">
            No reviews yet. Be the first to review this item!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <Card key={review.id}>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={review.user?.avatar_url} />
                  <AvatarFallback>
                    {review.user?.username?.[0]?.toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{review.user?.username || 'Anonymous'}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(review.created_at)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < review.rating
                          ? "fill-accent text-accent"
                          : "text-muted-foreground"
                      }`}
                    />
                  ))}
                </div>
                
                {currentUserId === review.user_id && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(review.id)}
                    aria-label="Delete review"
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                )}
              </div>
            </div>

            <p className="text-foreground mb-3">{review.review_text}</p>

            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              {review.price_paid && (
                <div className="flex items-center gap-1">
                  <DollarSign className="h-4 w-4" />
                  <span>₹{review.price_paid}</span>
                </div>
              )}
              {review.portion_size && (
                <div className="flex items-center gap-1">
                  <span className="capitalize">{review.portion_size} portion</span>
                </div>
              )}
              {review.wait_time_minutes && (
                <div className="flex items-center gap-1">
                  <span>{review.wait_time_minutes} min wait</span>
                </div>
              )}
            </div>

            {review.image_url && (
              <div className="mt-4">
                <img
                  src={review.image_url}
                  alt="Review"
                  className="rounded-lg max-h-64 object-cover"
                />
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ReviewList;

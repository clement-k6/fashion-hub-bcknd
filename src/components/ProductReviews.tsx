import React, { useState, useEffect, useRef } from 'react';

interface Review {
  name: string;
  rating: number;
  comment: string;
  date: string;
}

function getReviews(productId: string): Review[] {
  const data = localStorage.getItem(`reviews_${productId}`);
  return data ? JSON.parse(data) : [];
}

function saveReview(productId: string, review: Review) {
  const reviews = getReviews(productId);
  reviews.push(review);
  localStorage.setItem(`reviews_${productId}`, JSON.stringify(reviews));
}

function deleteReview(productId: string, name: string) {
  let reviews = getReviews(productId);
  reviews = reviews.filter(r => r.name.trim().toLowerCase() !== name.trim().toLowerCase());
  localStorage.setItem(`reviews_${productId}`, JSON.stringify(reviews));
}

function timeAgo(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)} day${Math.floor(diff / 86400) > 1 ? 's' : ''} ago`;
  return date.toLocaleDateString();
}

function getAvatarColor(name: string) {
  // Simple hash to color
  const colors = ['bg-blue-500','bg-green-500','bg-purple-500','bg-pink-500','bg-yellow-500','bg-red-500','bg-indigo-500'];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

const StarRating: React.FC<{ rating: number; setRating?: (n: number) => void; size?: number; readOnly?: boolean; }> = ({ rating, setRating, size = 22, readOnly }) => (
  <div className="flex items-center gap-0.5">
    {[1,2,3,4,5].map(n => (
      <svg
        key={n}
        onClick={() => setRating && !readOnly && setRating(n)}
        className={`cursor-pointer ${n <= rating ? 'text-yellow-400' : 'text-gray-300'} ${readOnly ? 'pointer-events-none' : ''}`}
        width={size} height={size} viewBox="0 0 20 20" fill="currentColor"
      >
        <polygon points="10,2 12.4,7.5 18,7.7 13.5,11.6 15,17 10,13.8 5,17 6.5,11.6 2,7.7 7.6,7.5" />
      </svg>
    ))}
  </div>
);

const ProductReviews: React.FC<{ productId: string }> = ({ productId }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [name, setName] = useState('');
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState<number | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [toast, setToast] = useState('');
  const [deleting, setDeleting] = useState(false);
  const reviewsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setReviews(getReviews(productId));
  }, [productId]);

  useEffect(() => {
    if (highlightIndex !== null && reviewsEndRef.current) {
      reviewsEndRef.current.scrollIntoView({ behavior: 'smooth' });
      const timeout = setTimeout(() => setHighlightIndex(null), 1200);
      return () => clearTimeout(timeout);
    }
  }, [highlightIndex]);

  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(''), 1800);
      return () => clearTimeout(t);
    }
  }, [toast]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !comment.trim() || rating < 1) {
      setError('Please fill all fields and select a rating.');
      return;
    }
    if (reviews.some(r => r.name.trim().toLowerCase() === name.trim().toLowerCase())) {
      setError('You have already submitted a review for this product.');
      return;
    }
    setSubmitting(true);
    const review: Review = {
      name: name.trim(),
      rating,
      comment: comment.trim(),
      date: new Date().toISOString(),
    };
    setTimeout(() => {
      saveReview(productId, review);
      const updated = getReviews(productId);
      setReviews(updated);
      setName('');
      setRating(0);
      setComment('');
      setError('');
      setSubmitting(false);
      setHighlightIndex(0); // highlight the newest review
    }, 600);
  };

  // Sort reviews by newest first
  const sortedReviews = [...reviews].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const avgRating = reviews.length ? (reviews.reduce((a, r) => a + r.rating, 0) / reviews.length) : 0;

  // Only allow delete for the review matching the current name input (simulating 'your' review)
  const yourReviewIndex = sortedReviews.findIndex(r => r.name.trim().toLowerCase() === name.trim().toLowerCase());

  const handleDelete = () => {
    setDeleting(true);
    setTimeout(() => {
      deleteReview(productId, name);
      setReviews(getReviews(productId));
      setShowDialog(false);
      setDeleting(false);
      setToast('Review deleted');
    }, 700);
  };

  return (
    <section className="mt-8">
      <h2 className="text-xl font-semibold mb-2">Customer Reviews</h2>
      <div className="flex items-center gap-2 mb-4">
        <StarRating rating={avgRating} readOnly size={20} />
        <span className="text-sm text-gray-600">{avgRating.toFixed(1)} / 5 ({reviews.length} review{reviews.length !== 1 ? 's' : ''})</span>
      </div>
      <form onSubmit={handleSubmit} className="mb-6 bg-gray-50 p-4 rounded-lg shadow-sm">
        <div className="flex flex-col gap-2 mb-2">
          <input
            className="border rounded px-3 py-2 text-sm"
            placeholder="Your name"
            value={name}
            onChange={e => setName(e.target.value)}
            maxLength={32}
            disabled={submitting}
          />
          <StarRating rating={rating} setRating={setRating} />
          <textarea
            className="border rounded px-3 py-2 text-sm"
            placeholder="Write your review..."
            value={comment}
            onChange={e => setComment(e.target.value)}
            rows={3}
            maxLength={300}
            disabled={submitting}
          />
        </div>
        {error && <div className="text-red-500 text-xs mb-2">{error}</div>}
        <div className="flex items-center gap-2">
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm disabled:opacity-60" disabled={submitting}>Submit Review</button>
          {yourReviewIndex !== -1 && (
            <button
              type="button"
              className="ml-2 text-xs text-red-600 hover:underline disabled:opacity-60"
              onClick={() => setShowDialog(true)}
              disabled={submitting || deleting}
            >
              Delete your review
            </button>
          )}
        </div>
      </form>
      {/* Confirmation Dialog */}
      {showDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-lg shadow-lg p-6 w-80 animate-fade-in">
            <h3 className="font-semibold mb-2">Delete your review?</h3>
            <p className="text-sm text-gray-600 mb-4">This action cannot be undone.</p>
            <div className="flex gap-2 justify-end">
              <button
                className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-700"
                onClick={() => setShowDialog(false)}
                disabled={deleting}
              >Cancel</button>
              <button
                className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700 disabled:opacity-60"
                onClick={handleDelete}
                disabled={deleting}
              >{deleting ? 'Deleting...' : 'Delete'}</button>
            </div>
          </div>
        </div>
      )}
      {/* Toast */}
      {toast && (
        <div className="fixed bottom-8 right-8 z-50 bg-blue-600 text-white px-4 py-2 rounded shadow animate-fade-in">
          {toast}
        </div>
      )}
      <div className="space-y-4">
        {sortedReviews.length === 0 && <div className="text-gray-500">No reviews yet. Be the first to review!</div>}
        {sortedReviews.map((r, i) => (
          <div
            key={i}
            className={`bg-white rounded-lg p-4 shadow border border-gray-100 flex items-start gap-3 transition-all duration-500 ${highlightIndex === i ? 'ring-2 ring-blue-400' : ''}`}
            ref={i === 0 ? reviewsEndRef : undefined}
            style={{ opacity: (yourReviewIndex === i && deleting) ? 0.5 : 1 }}
          >
            {/* Avatar */}
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-lg ${getAvatarColor(r.name)}`}>{r.name[0]?.toUpperCase() || '?'}</div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-gray-800">{r.name}</span>
                <StarRating rating={r.rating} readOnly size={16} />
                <span className="text-xs text-gray-400 ml-auto">{timeAgo(r.date)}</span>
              </div>
              <div className="text-gray-700 text-sm">{r.comment}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProductReviews; 
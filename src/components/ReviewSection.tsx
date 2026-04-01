import React, { useState, useEffect } from 'react';
import { collection, query, where, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { Review, UserProfile } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { Card, Button, Input } from './ui';
import { Star, User, MessageSquare, Send } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ReviewSectionProps {
  serviceId: string;
}

export const ReviewSection: React.FC<ReviewSectionProps> = ({ serviceId }) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const q = query(
      collection(db, 'reviews'),
      where('serviceId', '==', serviceId),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const revs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Review));
      setReviews(revs);
    });

    return unsubscribe;
  }, [serviceId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('Você precisa estar logado para avaliar.');
      return;
    }

    if (!comment.trim()) {
      toast.error('Por favor, escreva um comentário.');
      return;
    }

    setSubmitting(true);
    try {
      await addDoc(collection(db, 'reviews'), {
        serviceId,
        userId: user.uid,
        userName: user.displayName,
        userPhoto: user.photoURL,
        rating,
        comment,
        createdAt: serverTimestamp(),
      });
      setComment('');
      setRating(5);
      toast.success('Avaliação enviada com sucesso!');
    } catch (error) {
      console.error(error);
      toast.error('Erro ao enviar avaliação.');
    } finally {
      setSubmitting(false);
    }
  };

  const averageRating = reviews.length > 0
    ? reviews.reduce((acc, rev) => acc + rev.rating, 0) / reviews.length
    : 0;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-white flex items-center gap-2">
          <MessageSquare className="w-6 h-6 text-orange-500" />
          Avaliações ({reviews.length})
        </h3>
        {reviews.length > 0 && (
          <div className="flex items-center gap-2 bg-zinc-900 px-3 py-1 rounded-full border border-zinc-800">
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            <span className="text-white font-bold">{averageRating.toFixed(1)}</span>
          </div>
        )}
      </div>

      {user && (
        <Card className="p-6 bg-zinc-900/50 border-zinc-800">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-zinc-400">Sua nota:</span>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="focus:outline-none transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= rating ? 'text-yellow-500 fill-yellow-500' : 'text-zinc-700'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
            <div className="relative">
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Conte sua experiência com este serviço..."
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-4 text-white placeholder-zinc-600 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none min-h-[100px] resize-none"
              />
              <Button
                type="submit"
                disabled={submitting}
                className="absolute bottom-4 right-4 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2"
              >
                {submitting ? 'Enviando...' : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Avaliar
                  </>
                )}
              </Button>
            </div>
          </form>
        </Card>
      )}

      <div className="space-y-4">
        {reviews.length === 0 ? (
          <div className="text-center py-12 bg-zinc-900/30 rounded-2xl border border-dashed border-zinc-800">
            <MessageSquare className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
            <p className="text-zinc-500">Ainda não há avaliações para este serviço.</p>
            <p className="text-zinc-600 text-sm">Seja o primeiro a avaliar!</p>
          </div>
        ) : (
          reviews.map((review) => (
            <Card key={review.id} className="p-6 bg-zinc-900/30 border-zinc-800">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  {review.userPhoto ? (
                    <img src={review.userPhoto} alt={review.userName} className="w-10 h-10 rounded-full border border-zinc-800" referrerPolicy="no-referrer" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center">
                      <User className="w-5 h-5 text-zinc-500" />
                    </div>
                  )}
                  <div>
                    <div className="font-medium text-white">{review.userName}</div>
                    <div className="text-xs text-zinc-500">
                      {review.createdAt ? format(review.createdAt.toDate(), "dd 'de' MMMM, yyyy", { locale: ptBR }) : 'Recentemente'}
                    </div>
                  </div>
                </div>
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${
                        star <= review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-zinc-800'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <p className="mt-4 text-zinc-300 leading-relaxed">{review.comment}</p>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Button } from "./Button";

interface StarRatingProps {
  value: number;
  onClick: (value: number) => void;
  disabled: boolean;
}

const StarRating = ({ value, onClick, disabled }: StarRatingProps) => {
  const stars = Array.from({ length: 5 }, (_, index) => index + 1);

  return (
    <div className="flex">
      {stars.map((star) => (
        <span
          key={star}
          onClick={() => {
            if (!disabled) onClick(star);
          }}
          className={`${disabled ? "cursor-default" : "cursor-pointer"} ${
            star <= value ? "text-yellow-500" : "text-gray-300"
          } text-3xl`}
        >
          ★
        </span>
      ))}
    </div>
  );
};

interface FeedbackProps {
  playlistId: number;
  onFeedbackSent?: () => void;
}

export default function Feedback({
  playlistId,
  onFeedbackSent,
}: FeedbackProps) {
  const [rating, setRating] = useState(-1);
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const session = useSession();

  const sendFeedback = async () => {
    if (loading) return;
    try {
      setLoading(true);
      const response = await fetch(`/api/feedback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          playlistId: String(playlistId),
          rating,
        }),
      });
      if (response.ok) {
        toast.success("Feedback enviado exitosamente");
        const data = await response.json();
        setFeedbackSent(true);
        onFeedbackSent?.();
      } else {
        console.log(response.status);
        toast.error("No se pudo enviar el feedback");
      }
    } catch (error) {
      console.error("Error al enviar el feedback", error);
      toast.error("No se pudo enviar el feedback");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2 items-center mt-4 text-center p-2 rounded-sm">
      {session.data && (
        <>
          {!feedbackSent && (
            <p className="">¡Haznos saber qué tan buena fue la playlist!</p>
          )}
          {feedbackSent && (
            <p className="">Gracias por tu retroalimentacion!</p>
          )}
          <StarRating
            disabled={feedbackSent}
            value={rating}
            onClick={setRating}
          />
          <Button
            isDisabled={rating == -1 || feedbackSent}
            onPress={sendFeedback}
            className="bg-gray-800 disabled:text-gray-600 text-white px-4 py-2 rounded cursor-pointer disabled:cursor-auto mt-2"
          >
            {loading
              ? "Enviando..."
              : feedbackSent
              ? "Feedback enviada"
              : "Enviar Feedback"}
          </Button>
        </>
      )}
      {!session.data && <p>Necesitas tener sesion iniciada 👊</p>}
    </div>
  );
}

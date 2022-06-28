import { useEffect, useState } from "react";
import { database } from "../services/firebase";

type FeedbackType = {
    id: string;
    comment: string;
    screenshot: string;
    type: string;
}

type FirebaseFeedbacks = Record<string, {
    comment: string;
    screenshot: string;
    type: string;
}>

export function useRoom(code: string) {
    const [feedbacks, setFeedbacks] = useState<FeedbackType[]>([]);

    useEffect(() => {
        const roomRef = database.ref(`feedbacks/${code}`);

        roomRef.on('value',  room => {
            const databaseRoom = room.val();
            const firebaseFeedbacks: FirebaseFeedbacks = databaseRoom.feedbackCard ?? {};

            const parsedFeedbacks = Object.entries(firebaseFeedbacks).map(([key, value]) => {
                return {
                    id: key,
                    comment: value.comment,
                    screenshot: value.screenshot,
                    type: value.type,
                };
            })

            setFeedbacks(parsedFeedbacks);
        })

        return () => {
            roomRef.off('value');
        };
    }, [code]);

    return { feedbacks }
}
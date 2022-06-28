import { ArrowLeft } from "phosphor-react";
import { FormEvent, useContext, useState } from "react";
import { FeedbackTypeProps, feedbackTypes } from "..";
import { AuthContext } from "../../../contexts/AuthContext";
import { api } from "../../../lib/api";
import { database } from "../../../services/firebase";
import { CloseButton } from "../../CloseButton";
import { Loading } from "../../Loading";
import { ScreenshotButton } from "../ScreenshotButton";

type FeedbackContentStepProps = {
    feedbackType: FeedbackTypeProps;
    onFeedbackRestartRequested: () => void;
    onFeedbackSent: () => void;
}

export function FeedbackContentStep({ 
    feedbackType,
    onFeedbackRestartRequested,
    onFeedbackSent,
}: FeedbackContentStepProps) {
    const [ screenshot, setScreenshot ] = useState<string | null>(null);
    const [ comment, setComment ] = useState('');
    const [ isSendingFeedback, setIsSendingFeedback ] = useState(false);

    const feedbackTypeInfo = feedbackTypes[feedbackType];

    const { user, signInWithGoogle } = useContext(AuthContext);

    async function handleSubmitFeedback(event: FormEvent, user: {id: string, avatar: string, name: string} | undefined) {
        event.preventDefault();

        if (!user) {
            await signInWithGoogle();
        }

        setIsSendingFeedback(true);

        const feedback = {
            type: feedbackType,
            comment,
            screenshot,
        };

        await api.post('/feedbacks', feedback);

        setIsSendingFeedback(false);
        onFeedbackSent();

        await database.ref(`feedbacks/${user?.id}`).update({
            author: user,
        });

        await database.ref(`feedbacks/${user?.id}/feedbackCard`).push(feedback);
    }

    return (
        <>
            <header>
                <button 
                    type="button" 
                    className="top-5 left-5 absolute text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-100"
                    onClick={onFeedbackRestartRequested}
                >
                    <ArrowLeft weight="bold" className="w-4 h-4" />
                </button>

                <span className="text-xl leading-6 flex items-center gap-2">
                    <img src={feedbackTypeInfo.image.source} alt={feedbackTypeInfo.image.alt} className="w-6 h-6"/>
                    {feedbackTypeInfo.title}
                </span>
                <CloseButton />
            </header>

            <form onSubmit={(e) => handleSubmitFeedback(e, user)} action="" className="my-4 w-full">
                <textarea 
                    className="min-w-[304px] w-full min-h-[112px] text-sm placeholder-zinc-500 dark:placeholder-zinc-400 text-zinc-800 dark:text-zinc-100 border-zinc-300 dark:border-zinc-600 bg-transparent rounded-md focus:border-brand-500 focus:ring-brand-500 focus:ring-1 focus:outline-none resize-none scrollbar scrollbar-thumb-zinc-200 dark:scrollbar-thumb-zinc-700 scrollbar-track-transparent"
                    placeholder="Conte com detalhes o que está acontecendo..."
                    onChange= {event => setComment(event.target.value)}
                />

                <footer className="flex gap-2 mt-2 p-0 bg-white dark:bg-zinc-900">
                    <ScreenshotButton 
                        screenshot={screenshot}
                        onScreenshotTaken={setScreenshot}
                    />
                  
                    <button
                        type="submit"
                        disabled={comment.length === 0 || isSendingFeedback}
                        className="p-2 bg-brand-500 rounded-md border-transparent flex-1 flex justify-center items-center text-sm hover:bg-brand-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-zinc-900 focus:ring-brand-500 transition-colors disabled:opacity-50 disabled:hover:bg-brand-500"
                    >
                        {isSendingFeedback ? <Loading /> : 'Enviar Feedback' }
                    </button>
                </footer>
            </form>
        </>
    );
}
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

import bugImage from '../../assets/bug.svg';
import ideaImage from '../../assets/idea.svg';
import thoughtImage from '../../assets/thought.svg';
import { FeedbackTypeStep } from "./Steps/FeedbackTypeStep";
import { FeedbackContentStep } from "./Steps/FeedbackContentStep";
import { FeedbackSuccessStep } from "./Steps/FeedbackSuccessStep";
import { useAuth } from "../../hooks/useAuth";
import { database } from '../../services/firebase';

type RoomParams = {
    id: string;
}

export const feedbackTypes = {
    BUG: {
        title: 'Problema',
        image: {
            source: bugImage,
            alt: 'Imagem de um inseto',
        }
    },
    IDEA: {
        title: 'Ideia',
        image: {
            source: ideaImage,
            alt: 'Imagem de uma lâmpada',
        }
    },
    OTHER: {
        title: 'Outro',
        image: {
            source: thoughtImage,
            alt: 'Imagem de um balão de pensamento',
        }
    },
};

export type FeedbackTypeProps = keyof typeof feedbackTypes;

export function WidgetForm() {
    const navigate = useNavigate();
    const { user } = useAuth();

    const [ feedbackType, setFeedbackType] = useState<FeedbackTypeProps | null>(null);
    const [ feedbackSent, setFeedbackSent ] = useState(false);

    function handleRestartFeedback() {
        setFeedbackSent(false);
        setFeedbackType(null);
    }
    
    function handleGoToFeedbackPage() {
        navigate(`/feedbacks/${user?.id}`);
    }

    return (
        <div className="bg-white dark:bg-zinc-900 p-4 relative rounded-2xl mb-4 flex flex-col items-center shadow-lg w-[calc(100vw-2rem)] lg:w-auto text-zinc-800 dark:text-zinc-100" >
            
            { feedbackSent ? (
                <FeedbackSuccessStep onFeedbackRestartRequested={handleRestartFeedback} onGoToFeedbackPageRequested={handleGoToFeedbackPage}/>
            ) : (
                <>
                    { !feedbackType ? (
                        <FeedbackTypeStep onFeedbackTypeChanged={setFeedbackType} />
                    ) : (
                        <FeedbackContentStep
                            feedbackType={feedbackType}
                            onFeedbackRestartRequested={handleRestartFeedback}
                            onFeedbackSent={() => setFeedbackSent(true)}
                        />
                    )}
                </>
            )}

            <footer className="text-xs text-neutral-500 dark:text-neutral-400 bg-white dark:bg-zinc-900 h-4 p-0">
                Feito com ♥ pela <a className="underline underline-offset-2" href="https://rocketseat.com.br" target="_blank" >Rocketseat</a>
            </footer>
        </div>
    );
}
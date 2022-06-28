import { ChatTeardropDots } from 'phosphor-react';
import { Popover } from '@headlessui/react';
import { WidgetForm } from './WidgetForm';
import { useAuth } from '../hooks/useAuth';


export function Widget() {

    const { user, signInWithGoogle} = useAuth();

    async function handleBeginFeedback() {
        if (!user) {
            await signInWithGoogle()
        }
    }

    return (
        <Popover className='fixed bottom-4 right-4 flex flex-col items-end md:bottom-8 md:right-8'>
            <Popover.Panel>
                <WidgetForm />
            </Popover.Panel>

            <Popover.Button 
                onClick={handleBeginFeedback}
                className='bg-brand-500 rounded-full px-3 h-12  dark:text-white text-zinc-800 flex items-center group'
            >
                <ChatTeardropDots className='w-6 h-6'/>

                <span className='max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 ease-linear'>
                    <span className='pl-1'></span>
                    Feedback
                </span>
            </Popover.Button>
        </Popover>
    )
}
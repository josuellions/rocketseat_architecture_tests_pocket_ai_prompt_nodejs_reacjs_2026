'use client';

import Link from 'next/link';
import { toast } from 'sonner';
import { useState } from 'react';
import { motion } from 'motion/react';
import { useRouter } from 'next/navigation';
import {
  TrashIcon as DeleteIcon,
  Loader2Icon as LoadingIcon,
} from 'lucide-react';

import { Button } from '../ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../ui/alert-dialog';

import { PromptSummary } from '@/core/domain/prompts/prompt.entity';
import { deletePromptAction } from '@/app/actions/prompt.actions';

export type PromptCardProps = {
  prompt: PromptSummary;
};

export const PromptCard = ({ prompt }: PromptCardProps) => {
  const [isDeliting, setIsDeliting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setIsDeliting(true);

    try {
      const result = await deletePromptAction(prompt?.id);

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
      router.refresh();
    } catch (error) {
      const _error = error as Error;
      toast.error(_error.message);
    } finally {
      setIsDeliting(false);
    }
  };

  return (
    <motion.li
      className="p-3 rounded-lg transition-all duration-200 group relative hover:bg-gray-700"
      aria-label={prompt.title}
      initial={{ opacity: 1, height: 'auto' }}
      exit={{
        transition: { duration: -0.3, ease: 'easeInOut' },
        marginBottom: 0,
        opacity: 0,
        height: 0,
      }}
    >
      <header className="flex items-start justify-between">
        <Link href={`/${prompt.id}`} prefetch className="flex-1 min-w-0">
          <h3 className="font-medium text-sm text-white group-hover:text-accent-300 transition-colors">
            {prompt.title}
          </h3>
          <p className="text-xs text-gray-400 mt-1 line-clamp-2">
            {prompt.content}
          </p>
        </Link>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              type="button"
              variant="destructive"
              title="Remover prompt"
              aria-label="Remover prompt"
              className="text-red-400"
            >
              <DeleteIcon className="w-3 h-3" />
            </Button>
          </AlertDialogTrigger>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Remover prompt</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja remover este prompt? Está ação não pode
                ser revertida.
              </AlertDialogDescription>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  disabled={isDeliting}
                  className="bg-red-400"
                >
                  {isDeliting && (
                    <LoadingIcon className="w-4 h-4 mr-2 animate-spin" />
                  )}
                  Confirmar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogHeader>
          </AlertDialogContent>
        </AlertDialog>
      </header>
    </motion.li>
  );
};

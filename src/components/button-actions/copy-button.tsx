'use client';

import { useEffect, useState, useRef } from 'react';
import { Check, Copy } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner';

import { Button } from '../ui/button';

export type CopyButtonProps = {
  content: string;
};

export const CopyButton = ({ content }: CopyButtonProps) => {
  const [isCopied, setIsCopied] = useState(false);

  const isContentEmpty = !content.trim();

  const timeRef = useRef<ReturnType<typeof setTimeout>>(null);

  const clearTimer = () => {
    if (timeRef.current) {
      clearTimeout(timeRef.current);
      timeRef.current = null;
    }
  };

  const handleCopy = async () => {
    const text = content.trim();

    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);

      clearTimer();

      timeRef.current = setTimeout(() => {
        setIsCopied(false);
      }, 2_000);
    } catch (error) {
      const _error = error as Error;
      toast.error(`Error ao copiar o texto: ${_error.message}`);
    }
  };

  useEffect(() => {
    return () => {
      clearTimer();
    };
  }, []);

  return (
    <Button
      size="sm"
      type="button"
      variant="outline"
      onClick={handleCopy}
      disabled={isContentEmpty}
      className="rounded-md"
    >
      {isCopied ? (
        <Check className="w-4 h-4 text-green-400" />
      ) : (
        <Copy className="w-4 h-4 mr-2" />
      )}
      <motion.span
        key={isCopied ? 'copiado' : 'copiar'}
        initial={{ opacity: 0, y: 2 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        exit={{ opacity: 0, y: -2 }}
      >
        {isCopied ? 'Copiado' : 'Copiar'}
      </motion.span>
    </Button>
  );
};

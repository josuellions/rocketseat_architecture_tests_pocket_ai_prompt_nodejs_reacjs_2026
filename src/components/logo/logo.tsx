import Link from 'next/link';
import { MessageSquare } from 'lucide-react';

export const Logo = () => {
  return (
    <Link
      href="/"
      className="flex items-center gap-2 hover:text-accent-600 rounded-lg transition-colors"
    >
      <MessageSquare />
      <span className="text-lg font-semibold">PROMPTS</span>
    </Link>
  );
};

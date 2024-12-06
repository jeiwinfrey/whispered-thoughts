"use client";

import { Github } from "lucide-react";
import { Button } from "@nextui-org/react";

export function Footer() {
  return (
    <footer className="w-full py-6 px-4 mt-auto">
      <div className="max-w-4xl mx-auto text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="text-sm text-neutral-600 dark:text-neutral-400">Whispered Thoughts | Made with love by <a 
            href="https://github.com/jeiwinfrey" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-primary transition-colors"
          >Jeiwinfrey</a></span>
          <Button
            as="a"
            href="https://github.com/jeiwinfrey"
            target="_blank"
            isIconOnly
            variant="light"
            size="sm"
          >
            <Github size={20} />
          </Button>
        </div>
        <p className="text-sm text-neutral-500">
          I dedicate this to those who have a hard time opening up &lt;3.
        </p>
      </div>
    </footer>
  );
}
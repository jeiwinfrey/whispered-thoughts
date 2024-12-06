"use client";

import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Switch,
  Card
} from "@nextui-org/react";
import { NotebookPen, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useEffect, useState } from "react";

export function MainNav() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Navbar 
        maxWidth="xl" 
        className="bg-background/70 backdrop-blur-md"
        classNames={{
          wrapper: "px-8 py-4",
          content: "gap-4"
        }}
      >
        <div className="w-full flex justify-between items-center relative">
          <NavbarBrand as={Link} href="/" className="cursor-pointer">
            <NotebookPen className={`w-8 h-8 ${theme === 'light' ? 'text-[#171717]' : 'text-primary'}`} />
            <Link href="/" className="font-['Reenie_Beanie'] text-3xl tracking-wide ml-2">
              Whispered Thoughts
            </Link>
          </NavbarBrand>
        </div>
      </Navbar>
    );
  }

  return (
    <Navbar 
      maxWidth="xl" 
      className="bg-background/70 backdrop-blur-md"
      classNames={{
        wrapper: "px-8 py-4",
        content: "gap-4"
      }}
    >
      <div className="w-full flex justify-between items-center relative">
        <NavbarBrand as={Link} href="/" className="cursor-pointer">
          <NotebookPen className={`w-8 h-8 ${theme === 'light' ? 'text-[#171717]' : 'text-primary'}`} />
          <Link href="/" className="font-['Reenie_Beanie'] text-3xl tracking-wide ml-2">
            Whispered Thoughts
          </Link>
        </NavbarBrand>

        <div className="absolute left-1/2 -translate-x-1/2">
          <Button
            variant="light"
            onPress={onOpen}
            className={`font-medium ${theme === 'light' ? 'text-[#171717]' : 'text-primary'} md:inline hidden`}
            radius="full"
          >
            Need A Hand?
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center">
            {theme === 'light' ? (
              <button
                onClick={() => setTheme('dark')}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-default-100/80 transition-colors"
              >
                <Sun className="w-5 h-5 text-[#171717]" />
              </button>
            ) : (
              <button
                onClick={() => setTheme('light')}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-default-100/80 transition-colors"
              >
                <Moon className="w-5 h-5 text-primary" />
              </button>
            )}
          </div>
          <Button
            as={Link}
            href="/publish"
            className={theme === 'light' ? 
              "font-semibold px-8 bg-[#171717] text-white hover:opacity-90" : 
              "font-semibold px-8 bg-primary text-primary-foreground hover:opacity-90"
            }
            radius="full"
          >
            Publish
          </Button>
        </div>
      </div>

      <Modal 
        isOpen={isOpen} 
        onClose={onClose}
        placement="center"
        backdrop="blur"
        hideCloseButton
        classNames={{
          base: "bg-background/80 backdrop-blur-md border rounded-3xl shadow-xl max-w-lg mx-auto relative mt-16",
          wrapper: "px-4",
          header: "pb-0",
          body: "pt-0",
          footer: "pt-0"
        }}
        motionProps={{
          variants: {
            enter: {
              y: 0,
              opacity: 1,
              transition: {
                duration: 0.3,
                ease: "easeOut"
              }
            },
            exit: {
              y: -20,
              opacity: 0,
              transition: {
                duration: 0.2,
                ease: "easeIn"
              }
            }
          }
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-0">
                <div className="p-4 pb-1 flex justify-between items-center">
                  <span className={`text-3xl font-semibold ${theme === 'light' ? 'text-[#171717]' : 'text-primary'}`}>
                    You&apos;re Not Alone
                  </span>
                  <button
                    className="hover:bg-default-100 active:bg-default-200 text-default-500 rounded-full w-8 h-8 flex items-center justify-center"
                    onClick={onClose}
                  >
                    ✕
                  </button>
                </div>
              </ModalHeader>
              <ModalBody>
                <div className="space-y-4 text-default-600 px-4 pt-1 pb-1">
                  <p className="text-lg text-justify">
                    We know things might feel overwhelming right now, and it&apos;s okay to take a moment to breathe. 
                    Remember, there are people who deeply care about you and want to help. 
                    You are valuable, and your feelings matter.
                  </p>
                  <p className="text-lg text-justify">
                    If you need someone to talk to, there are professionals and caring individuals ready to listen and support you.
                  </p>
                  <p className="text-lg text-justify">
                    Take that first step. You are not alone in this &lt;3.
                  </p>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button
                  as="a"
                  href="https://blog.opencounseling.com/hotlines-ph/"
                  target="_blank"
                  className={`w-full ${theme === 'light' ? 'bg-[#171717] text-white' : 'bg-primary text-[#171717]'} hover:opacity-90 mt-1`}
                  onPress={onClose}
                  radius="full"
                >
                  Try it
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </Navbar>
  );
}
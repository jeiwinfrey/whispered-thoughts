"use client";

import { Card, CardBody, CardHeader, CardFooter, Input, Button } from "@nextui-org/react";
import { SearchIcon, ChevronDown, ChevronUp, PenLine, Trash2 } from "lucide-react";
import { useState } from "react";
import { useTheme } from "next-themes";

interface Entry {
  id: number;
  salutation: string;
  receiver: string;
  username: string;
  content: string;
  date: Date;
  isLocked: boolean;
}

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedCards, setExpandedCards] = useState<Set<number>>(new Set());
  const { theme } = useTheme();

  const entries: Entry[] = [
    {
      id: 1,
      salutation: "Dear",
      receiver: "Friend",
      username: "anonymous123",
      content: "Sometimes I wonder if I'm doing enough. The world seems to move so fast, and I often feel like I'm standing still. But then I remember that everyone has their own pace, and that's okay.",
      date: new Date(),
      isLocked: false
    },
    {
      id: 2,
      salutation: "Hello",
      receiver: "Someone",
      username: "anon_writer",
      content: "Today was a good day. I finally found the courage to speak up in that meeting. It might seem small to others, but for me, it was a mountain climbed.",
      date: new Date(),
      isLocked: true
    }
  ];

  const toggleCard = (id: number) => {
    const newExpanded = new Set(expandedCards);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedCards(newExpanded);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-HK', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      timeZone: 'Asia/Hong_Kong'
    }).format(date);
  };

  const handleDelete = (id: number) => {
    // implement delete logic here
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl relative">
      <div className="text-center mb-6">
        <div className="space-y-2 mb-8">
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-normal mb-2 font-['Reenie_Beanie'] tracking-wide">
            words left unspoken, letters unsent
          </h1>
          <p className="text-xl sm:text-2xl md:text-3xl text-default-500 font-['Reenie_Beanie'] tracking-wide">
            let your heart write what your voice couldn't say
          </p>
        </div>
        <div className="max-w-xl mx-auto">
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search letters..."
            startContent={<SearchIcon className="text-default-400 w-5 h-5" />}
            size="lg"
            radius="full"
            classNames={{
              input: "text-lg",
              inputWrapper: "h-12 bg-default-100/50 backdrop-blur-sm border border-default-200 hover:bg-default-200/50 transition-colors"
            }}
          />
        </div>
      </div>
      <div className="grid gap-4 mt-2">
        {entries.map((entry) => (
          <Card 
            key={entry.id} 
            className="bg-background/50 backdrop-blur-sm border border-default-200 rounded-3xl cursor-pointer hover:opacity-80 transition-opacity" 
            radius="none"
            isPressable
            onPress={() => toggleCard(entry.id)}
          >
            <CardHeader className="pb-0 pt-4 px-4 flex-col items-start">
              <div className="flex justify-between w-full items-center">
                <div>
                  <h4 className="font-['Reenie_Beanie'] text-4xl tracking-wide leading-none">
                    Dear {entry.receiver},
                  </h4>
                </div>
                <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                  <Button
                    isIconOnly
                    variant="light"
                    onPress={() => toggleCard(entry.id)}
                  >
                    {expandedCards.has(entry.id) ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardBody className="px-6 pt-2">
              <p className="text-default-600">
                {expandedCards.has(entry.id)
                  ? entry.content
                  : `${entry.content.slice(0, 150)}${entry.content.length > 150 ? '...' : ''}`}
              </p>
            </CardBody>
            
            <CardFooter className="px-6 -mt-4">
              <div className="w-full flex justify-between items-center">
                <div className="flex gap-2">
                  {expandedCards.has(entry.id) && !entry.isLocked && (
                    <>
                      <Button
                        size="md"
                        variant="light"
                        className={`${theme === 'light' ? 'text-[#171717]' : 'text-primary'} h-9 px-4 min-h-[36px] flex items-center gap-2 overflow-visible no-animation`}
                      >
                        <PenLine className="h-4 w-4" strokeWidth={1.5} />
                        Edit
                      </Button>
                      <Button
                        size="md"
                        variant="light"
                        className={`${theme === 'light' ? 'text-[#171717]' : 'text-primary'} h-9 px-4 min-h-[36px] flex items-center gap-2 overflow-visible no-animation`}
                        onClick={() => handleDelete(entry.id)}
                      >
                        <Trash2 className="h-4 w-4" strokeWidth={1.5} />
                        Delete
                      </Button>
                    </>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <p className="font-['Reenie_Beanie'] text-2xl text-default-500 tracking-wide">
                    @{entry.username}
                  </p>
                  <p className="text-small text-default-400">
                    {formatDate(entry.date)}
                  </p>
                </div>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
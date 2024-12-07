"use client";

import { 
  Card, 
  CardBody, 
  CardHeader, 
  CardFooter, 
  Input, 
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Textarea
} from "@nextui-org/react";
import { SearchIcon, ChevronDown, ChevronUp, PenLine, Trash2, Eye, EyeOff } from "lucide-react";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";

interface Entry {
  id: number;
  receiver: string;
  username: string;
  content: string;
  date: Date;
  isLocked: boolean;
}

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedCards, setExpandedCards] = useState<Set<number>>(new Set());
  const [entries, setEntries] = useState<Entry[]>([]);
  const { theme } = useTheme();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedEntryId, setSelectedEntryId] = useState<number | null>(null);
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
  const [editContent, setEditContent] = useState("");

  useEffect(() => {
    fetchThoughts();
  }, []);

  const fetchThoughts = async () => {
    try {
      const response = await fetch('/api/thoughts');
      if (!response.ok) {
        throw new Error('Failed to fetch thoughts');
      }
      const data = await response.json();
      setEntries(data.map((entry: any) => ({
        id: entry.id,
        receiver: entry.receiver,
        username: entry.username,
        content: entry.content,
        date: new Date(entry.date),
        isLocked: !!entry.password
      })));
    } catch (error) {
      console.error('Error fetching thoughts:', error);
    }
  };

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
    setSelectedEntryId(id);
    setPassword("");
    setError(null);
    onOpen();
  };

  const confirmDelete = async () => {
    if (!selectedEntryId || !password) {
      setError('Password is required');
      return;
    }

    try {
      const response = await fetch(`/api/thoughts?id=${selectedEntryId}&password=${encodeURIComponent(password)}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.details || 'Failed to delete thought');
      }

      // Close modal and refresh thoughts
      onClose();
      fetchThoughts();
    } catch (error) {
      console.error('Error deleting thought:', error);
      setError(error instanceof Error ? error.message : 'Failed to delete thought');
    }
  };

  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleEdit = async (id: number) => {
    if (!password) {
      setError('Password is required');
      return;
    }

    if (editContent.length < 200) {
      setError('Content must be at least 200 characters');
      return;
    }

    try {
      const response = await fetch(`/api/thoughts/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: editContent,
          password: password
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.details || 'Failed to update thought');
      }

      // Close modal and refresh thoughts
      onEditClose();
      setPassword("");
      setEditContent("");
      fetchThoughts();
    } catch (error) {
      console.error('Error updating thought:', error);
      setError(error instanceof Error ? error.message : 'Failed to update thought');
    }
  };

  const getWordCount = (text: string) => text.trim().split(/\s+/).filter(Boolean).length;
  const getCharacterCount = (text: string) => text.length;

  return (
    <>
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
                    {expandedCards.has(entry.id) && (
                      <>
                        <Button
                          size="md"
                          variant="light"
                          className={`${theme === 'light' ? 'text-[#171717]' : 'text-primary'} h-9 px-4 min-h-[36px] flex items-center gap-2 overflow-visible no-animation`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedEntryId(entry.id);
                            onEditOpen();
                          }}
                        >
                          <PenLine className="h-4 w-4" strokeWidth={1.5} />
                          Edit
                        </Button>
                        <Button
                          size="md"
                          variant="light"
                          className={`${theme === 'light' ? 'text-[#171717]' : 'text-primary'} h-9 px-4 min-h-[36px] flex items-center gap-2 overflow-visible no-animation`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(entry.id);
                          }}
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

      {/* Delete Confirmation Modal */}
      <Modal 
        isOpen={isOpen} 
        onClose={() => {
          onClose();
          setError(null);
          setPassword("");
        }}
        placement="center"
        hideCloseButton
        classNames={{
          base: "max-w-md mx-auto -translate-y-[10%]",
          backdrop: "bg-black/40 backdrop-blur-sm",
          wrapper: "backdrop-blur-sm",
          closeButton: "hidden",
          content: [
            theme === 'light' ? 'bg-white' : 'bg-[#171717]',
            "border",
            "border-default-200",
            "rounded-3xl"
          ].join(" ")
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
        <ModalContent className={`${theme === 'light' ? 'bg-white' : 'bg-[#171717]'} rounded-3xl border border-default-200`}>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-center pb-0">
                <span className="font-['Reenie_Beanie'] text-4xl">Delete Thought</span>
                <p className="text-default-500 text-sm">This action cannot be undone</p>
              </ModalHeader>
              <ModalBody>
                <div className="space-y-3">
                  {error && (
                    <div className="text-red-500 text-sm text-center mb-2">
                      {error}
                    </div>
                  )}
                  <Input
                    label={password ? "" : "Password"}
                    placeholder=""
                    value={password}
                    onValueChange={setPassword}
                    endContent={
                      <button className="focus:outline-none" type="button" onClick={toggleVisibility}>
                        {isVisible ? (
                          <EyeOff className="w-4 h-4 text-default-400" />
                        ) : (
                          <Eye className="w-4 h-4 text-default-400" />
                        )}
                      </button>
                    }
                    type={isVisible ? "text" : "password"}
                    variant="bordered"
                    classNames={{
                      inputWrapper: [
                        "bg-transparent",
                        "hover:bg-default-100",
                        "transition-colors",
                        "border-2",
                        !password ? (theme === 'light' ? "border-[#171717]" : "border-white") : "border-default-200/50",
                        "rounded-full"
                      ].join(" ")
                    }}
                  />
                </div>
              </ModalBody>
              <ModalFooter className="justify-center pt-0">
                <Button
                  variant="light"
                  color="danger"
                  onPress={onClose}
                  className="font-semibold w-32 rounded-full"
                >
                  Cancel
                </Button>
                <Button
                  color="primary"
                  onPress={confirmDelete}
                  isDisabled={!password}
                  className={`font-semibold w-32 rounded-full ${
                    theme === 'light' 
                      ? "bg-[#171717] text-white hover:opacity-90" 
                      : "bg-primary text-primary-foreground hover:opacity-90"
                  }`}
                >
                  Delete
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Edit Modal */}
      <Modal 
        isOpen={isEditOpen} 
        onClose={() => {
          onEditClose();
          setPassword("");
          setEditContent("");
          setError(null);
        }}
        placement="center"
        hideCloseButton
        classNames={{
          body: "py-6",
          base: "max-w-md mx-auto -translate-y-[10%]",
          backdrop: "bg-black/40 backdrop-blur-sm",
          wrapper: "backdrop-blur-sm",
          closeButton: "hidden",
          content: [
            theme === 'light' ? 'bg-white' : 'bg-[#171717]',
            "border",
            "border-default-200",
            "rounded-3xl"
          ].join(" ")
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
        <ModalContent className={`${theme === 'light' ? 'bg-white' : 'bg-[#171717]'} rounded-3xl border border-default-200`}>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-center pb-0">
                <span className="font-['Reenie_Beanie'] text-4xl">Edit Thought</span>
                <p className="text-default-500 text-sm">Your previous thought will disappear</p>
              </ModalHeader>
              <ModalBody className="max-h-[60vh] overflow-hidden">
                <div className="space-y-3">
                  <div className="overflow-y-auto pr-2" style={{ maxHeight: "calc(60vh - 120px)" }}>
                    <Textarea
                      value={editContent}
                      onValueChange={setEditContent}
                      placeholder="Edit your thoughts here..."
                      variant="bordered"
                      minRows={10}
                      maxRows={15}
                      classNames={{
                        input: "text-default-800 text-lg tracking-wide bg-transparent",
                        inputWrapper: [
                          "bg-transparent",
                          "shadow-none",
                          editContent && editContent.length < 200 ? "border-2 border-danger" : "border-none",
                          "min-h-[300px]",
                          "px-6"
                        ].join(" "),
                        placeholder: `text-lg tracking-wide ${theme === 'light' ? 'text-[#171717]/50' : 'text-white/50'}`
                      }}
                    />
                  </div>
                  {editContent && editContent.length < 200 && (
                    <div className="text-sm text-danger text-center">
                      Entry must be at least 200 characters long
                    </div>
                  )}
                  {error && (
                    <div className="text-red-500 text-sm text-center mb-2">
                      {error}
                    </div>
                  )}
                  <Input
                    label={password ? "" : "Password"}
                    placeholder=""
                    value={password}
                    onValueChange={setPassword}
                    endContent={
                      <button className="focus:outline-none" type="button" onClick={toggleVisibility}>
                        {isVisible ? (
                          <EyeOff className="w-4 h-4 text-default-400" />
                        ) : (
                          <Eye className="w-4 h-4 text-default-400" />
                        )}
                      </button>
                    }
                    type={isVisible ? "text" : "password"}
                    variant="bordered"
                    classNames={{
                      inputWrapper: [
                        "bg-transparent",
                        "hover:bg-default-100",
                        "transition-colors",
                        "border-2",
                        !password ? (theme === 'light' ? "border-[#171717]" : "border-white") : "border-default-200/50",
                        "rounded-full"
                      ].join(" ")
                    }}
                  />
                </div>
              </ModalBody>
              <ModalFooter className="justify-center pt-0">
                <Button
                  variant="light"
                  color="danger"
                  onPress={onClose}
                  className="font-semibold w-32 rounded-full"
                >
                  Cancel
                </Button>
                <Button
                  color="primary"
                  onPress={() => handleEdit(selectedEntryId)}
                  isDisabled={!password || editContent.length < 200}
                  className={`font-semibold w-32 rounded-full ${
                    theme === 'light' 
                      ? "bg-[#171717] text-white hover:opacity-90" 
                      : "bg-primary text-primary-foreground hover:opacity-90"
                  }`}
                >
                  Edit
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
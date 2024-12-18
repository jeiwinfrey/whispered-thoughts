"use client";

import { useState } from "react";
import { 
  Card, 
  CardBody, 
  Input, 
  Button, 
  Textarea,
  Checkbox,
  Select,
  SelectItem,
  Switch,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure
} from "@nextui-org/react";
import { useTheme } from "next-themes";
import { Lock, Unlock, Eye, EyeOff } from "lucide-react";

const categoryOptions = [
  { label: "Employed", value: "employed" },
  { label: "College", value: "college" },
  { label: "High School", value: "highSchool" },
  { label: "Other", value: "other" }
];

export default function PublishPage() {
  const { theme } = useTheme();
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [isVisible, setIsVisible] = useState(false);
  const [formData, setFormData] = useState({
    receiverName: "",
    diaryEntry: "",
    isLocked: false,
    username: "",
    password: ""
  });
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const [modalValidation, setModalValidation] = useState({
    username: true,
    password: true
  });

  const [error, setError] = useState<string | null>(null);

  // Validation functions
  const isAlphabetOnly = (value: string) => /^[A-Za-z\s]*$/.test(value);
  const getWordCount = (text: string) => text.trim().split(/\s+/).filter(Boolean).length;
  const getCharacterCount = (text: string) => text.length;
  const isValidPassword = (password: string) => password.length >= 6;

  // Form validation
  const validations = {
    receiverName: formData.receiverName.trim() !== "" && isAlphabetOnly(formData.receiverName),
    diaryEntry: formData.diaryEntry.length >= 200
  };

  const canPublish = validations.receiverName && validations.diaryEntry;
  const canConfirmPublish = formData.username.trim() !== "" && isValidPassword(formData.password);

  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/thoughts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          receiver: formData.receiverName.trim(),
          content: formData.diaryEntry.trim(),
          isLocked: formData.isLocked,
          username: formData.username.trim(),
          password: formData.password
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.details || 'Failed to publish thought');
      }

      // Redirect back to home page
      // router.push('/');
    } catch (error) {
      console.error('Error publishing thought:', error);
      setError(error instanceof Error ? error.message : 'Failed to publish thought');
    }
  };

  const handlePublish = async () => {
    if (!modalValidation.username || !modalValidation.password) {
      setError('Please fill in both username and password');
      return;
    }

    if (!formData.diaryEntry.trim()) {
      setError('Please enter your thoughts');
      return;
    }

    try {
      setError(null);
      const data = {
        receiver: formData.receiverName.trim(),
        content: formData.diaryEntry.trim(),
        isLocked: formData.isLocked,
        username: formData.username.trim(),
        password: formData.password
      };

      console.log('Sending data:', data);

      const response = await fetch('/api/thoughts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache'
        },
        cache: 'no-store',
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const text = await response.text();
        console.error('Error response:', text);
        throw new Error('Failed to submit thought. Server returned: ' + text);
      }

      const responseData = await response.json();
      console.log('Success:', responseData);

      // Reset form and close modal
      setFormData({
        receiverName: "",
        diaryEntry: "",
        isLocked: false,
        username: "",
        password: ""
      });
      onClose(); // Close the publish modal
    } catch (error) {
      console.error('Error submitting thought:', error);
      setError(error instanceof Error ? error.message : 'Failed to submit thought');
    }
  };

  return (
    <div className="container mx-auto px-4 py-4 max-w-6xl h-[calc(102vh-12rem)] overflow-hidden">
      <Card 
        className={`${theme === 'light' ? 'bg-background/50' : 'bg-default-100/50'} backdrop-blur-sm border border-default-200 rounded-3xl h-full max-w-[600px] mx-auto`}
        radius="none"
      >
        <CardBody className="p-6 flex flex-col h-full">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="space-y-8">
                <div className="flex flex-col gap-2">
                  <div className="flex items-end gap-2">
                    <span className="text-default-800 font-['Reenie_Beanie'] text-4xl tracking-wide">To</span>
                    <div className="relative flex items-center">
                      <Input
                        value={formData.receiverName}
                        onValueChange={(value) => {
                          // Allow only letters and single space
                          const processed = value.replace(/[^a-zA-Z\s]/g, '').replace(/\s+/g, ' ');
                          const words = processed.split(' ').filter(word => word.length > 0);
                          
                          if (words.length === 2 && value.endsWith(' ')) {
                            return;
                          }
                          
                          const wordCount = processed.trim().split(' ').filter(word => word.length > 0).length;
                          
                          if (wordCount <= 2 && processed.length <= 20) {
                            setFormData({ ...formData, receiverName: processed });
                          }
                        }}
                        variant="bordered"
                        radius="lg"
                        maxLength={20}
                        placeholder="name"
                        classNames={{
                          input: "text-default-800 font-['Reenie_Beanie'] text-4xl tracking-wide bg-transparent text-left",
                          inputWrapper: "h-12 bg-transparent border-none shadow-none min-w-0",
                          placeholder: `font-['Reenie_Beanie'] text-4xl tracking-wide ${theme === 'light' ? 'text-[#171717]/50' : 'text-white/50'}`,
                          base: "group min-h-0 min-w-0"
                        }}
                        style={{
                          width: formData.receiverName
                            ? `${Math.min(formData.receiverName.length + 1, 20)}ch`
                            : '5ch'
                        }}
                      />
                      <span 
                        className="text-default-600 font-['Reenie_Beanie'] text-4xl tracking-wide absolute"
                        style={{
                          left: formData.receiverName 
                            ? `${Math.min(formData.receiverName.length + 1, 19)}ch`
                            : '6ch'
                        }}
                      >,</span>
                      {!formData.receiverName && (
                        <div 
                          className="absolute -bottom-2 left-0 h-[2px] bg-gradient-to-r from-transparent via-default-600/50 to-transparent group-hover:via-default-400/50 transition-all duration-200"
                          style={{
                            width: `${Math.max((formData.receiverName?.length || 7) + 2, Math.min(18, (formData.receiverName?.length || 7) + 2))}ch`,
                            marginLeft: '0ch'
                          }}
                        ></div>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 text-sm text-default-400">
                    {!validations.receiverName && formData.receiverName && (
                      <span>Name must contain only letters</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="w-12"></div>
          </div>

          {/* Content */}
          <div className="flex-1 mt-4 flex flex-col">
            <Textarea
              value={formData.diaryEntry}
              onValueChange={(value) => setFormData({ ...formData, diaryEntry: value })}
              isInvalid={formData.diaryEntry !== "" && formData.diaryEntry.length < 200}
              variant="flat"
              placeholder="Pour your heart out..."
              classNames={{
                input: [
                  "resize-none font-medium text-lg",
                  "!min-h-full !h-full",
                  "overflow-y-auto",
                  "scrollbar-thin scrollbar-thumb-rounded-lg",
                  "scrollbar-track-default-100/50 scrollbar-thumb-default-300/50"
                ].join(" "),
                inputWrapper: [
                  "h-full shadow-none bg-transparent flex-1",
                  "border-2",
                  formData.diaryEntry !== "" && formData.diaryEntry.length < 200 
                    ? "!border-danger-500" 
                    : "border-transparent"
                ].join(" "),
                base: "shadow-none h-full w-full"
              }}
            />
            {formData.diaryEntry !== "" && formData.diaryEntry.length < 200 && (
              <div className="text-danger text-sm mt-2">
                {`The message should be at least ${200 - getCharacterCount(formData.diaryEntry)} more characters long (${getCharacterCount(formData.diaryEntry)}/200)`}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-between items-center mt-4">
            <div className="flex items-center gap-2">
              <button
                className="font-semibold px-4 h-10 rounded-full border-2 border-default-200/50 hover:bg-default-100 transition-colors"
                onClick={() => setFormData({ ...formData, diaryEntry: "" })}
              >
                Clear
              </button>
            </div>
            <button
              disabled={!canPublish}
              className={`font-semibold w-32 h-10 rounded-full transition-opacity ${
                theme === 'light' 
                  ? "bg-[#171717] text-white hover:opacity-90" 
                  : "bg-primary text-primary-foreground hover:opacity-90"
              } ${!canPublish ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={onOpen}
            >
              Publish
            </button>
          </div>
        </CardBody>
      </Card>
      <Modal 
        isOpen={isOpen} 
        onOpenChange={onOpenChange}
        placement="center"
        hideCloseButton
        classNames={{
          base: "max-w-md mx-auto -translate-y-[10%]",
          backdrop: "bg-black/40 backdrop-blur-sm",
          wrapper: "backdrop-blur-sm",
          body: "py-6",
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
                <h3 className="font-['Reenie_Beanie'] text-4xl tracking-wide">For editing and deletion of entries</h3>
                <div className="space-y-1">
                  <p className="text-sm text-default-500">
                    Username will appear in your entry and won't be asked when editing/deleting
                  </p>
                  <p className="text-sm text-neutral-500">
                    No password recovery available
                  </p>
                </div>
              </ModalHeader>
              <ModalBody>
                <div className="space-y-3">
                  {error && (
                    <div className="text-red-500 text-sm text-center mb-2">
                      {error}
                    </div>
                  )}
                  <Input
                    placeholder="Username"
                    value={formData.username}
                    onValueChange={(value) => {
                      setFormData({ ...formData, username: value });
                      setModalValidation(prev => ({
                        ...prev,
                        username: value.trim() !== ""
                      }));
                    }}
                    variant="bordered"
                    radius="lg"
                    classNames={{
                      inputWrapper: [
                        "bg-transparent",
                        "hover:bg-default-100",
                        "transition-colors",
                        "border-2",
                        !modalValidation.username ? (theme === 'light' ? "border-[#171717]" : "border-white") : "border-default-200/50",
                        "rounded-full"
                      ].join(" ")
                    }}
                  />
                  <div className="space-y-1">
                    <Input
                      placeholder="Password"
                      value={formData.password}
                      onValueChange={(value) => {
                        setFormData({ ...formData, password: value });
                        setModalValidation(prev => ({
                          ...prev,
                          password: isValidPassword(value)
                        }));
                      }}
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
                          !modalValidation.password ? (theme === 'light' ? "border-[#171717]" : "border-white") : "border-default-200/50",
                          "rounded-full"
                        ].join(" ")
                      }}
                    />
                    <p className={`text-xs ${!modalValidation.password ? (theme === 'light' ? "text-[#171717]" : "text-white") : "text-neutral-500"}`}>
                      6 characters minimum
                    </p>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter className="justify-center pt-0">
                <Button 
                  className="w-full font-medium"
                  color="primary"
                  radius="full"
                  size="lg"
                  onClick={handlePublish}
                  isDisabled={!modalValidation.username || !modalValidation.password}
                >
                  Publish
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
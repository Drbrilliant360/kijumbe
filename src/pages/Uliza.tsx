
import { useState, useRef } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Send, ArrowDown, Loader2, Image } from "lucide-react";
import Loading from "@/components/ui/loading";
import { useUserProfile } from "@/hooks/useUserProfile";

const Uliza = () => {
  const [messages, setMessages] = useState<any[]>([
    {
      role: "assistant",
      content: "Habari! Mimi ni Uliza, msaidizi wako wa kikijumbe. Naweza kukusaidia kujibu maswali yako. Niulize swali lolote!"
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { userName } = useUserProfile();
  const { toast } = useToast();

  const Header = (
    <div className="p-4 flex items-center space-x-4">
      <h1 className="text-xl font-bold">Uliza - Msaidizi wa Kijumbe</h1>
    </div>
  );

  const handleSend = async () => {
    if ((!input.trim() && !selectedImage) || isLoading) return;

    try {
      // Add user message to chat
      const userMessage = {
        role: "user",
        content: input,
        image: imagePreview
      };
      setMessages(prev => [...prev, userMessage]);
      setInput("");
      setIsLoading(true);
      setSelectedImage(null);
      setImagePreview(null);

      // Prepare message content for OpenRouter API
      const messageContent = [];
      
      // Add text if available
      if (input.trim()) {
        messageContent.push({
          type: "text",
          text: input.trim()
        });
      }
      
      // Add image if available
      if (imagePreview) {
        messageContent.push({
          type: "image_url",
          image_url: {
            url: imagePreview
          }
        });
      }

      // Call the OpenRouter API
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY || ""}`,
          "HTTP-Referer": window.location.origin,
          "X-Title": "Kijumbe App",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "model": "openai/gpt-4.1",
          "messages": [
            {
              "role": "system",
              "content": "You are Uliza, a helpful AI assistant for the Kijumbe app. You provide useful information in Swahili and English. Be concise and friendly in your responses. You can analyze images and text."
            },
            ...messages.map(msg => ({
              role: msg.role,
              content: msg.content
            })),
            {
              "role": "user",
              "content": messageContent
            }
          ]
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      
      // Add AI response to chat
      if (data.choices && data.choices[0] && data.choices[0].message) {
        const aiMessage = {
          role: "assistant",
          content: data.choices[0].message.content
        };
        setMessages(prev => [...prev, aiMessage]);
      } else {
        throw new Error("Invalid response format from API");
      }
    } catch (error) {
      console.error("Error calling AI assistant:", error);
      toast({
        variant: "destructive",
        title: "Hitilafu",
        description: "Kumekuwa na hitilafu katika kuwasiliana na msaidizi wa AI. Tafadhali jaribu tena."
      });
      
      // Add error message to chat
      setMessages(prev => [
        ...prev, 
        {
          role: "assistant",
          content: "Samahani, kumekuwa na hitilafu. Tafadhali jaribu tena baadaye."
        }
      ]);
    } finally {
      setIsLoading(false);
      scrollToBottom();
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        variant: "destructive",
        title: "Picha kubwa mno",
        description: "Tafadhali chagua picha ndogo zaidi (chini ya 5MB)"
      });
      return;
    }
    
    setSelectedImage(file);
    
    // Create image preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };
  
  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <AppLayout header={Header}>
      <div className="flex flex-col h-[calc(100vh-10rem)]">
        {/* Chat messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-20">
          {messages.map((message, index) => (
            <div 
              key={index} 
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div className={`flex items-start max-w-[80%] ${message.role === "user" ? "flex-row-reverse" : ""}`}>
                <Avatar className={`h-8 w-8 ${message.role === "user" ? "ml-2" : "mr-2"}`}>
                  {message.role === "user" ? (
                    <>
                      <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${userName || "User"}`} />
                      <AvatarFallback>{userName?.charAt(0) || "U"}</AvatarFallback>
                    </>
                  ) : (
                    <>
                      <AvatarImage src="/lovable-uploads/a7730e30-4841-4e84-b261-c7a02ce07b27.png" />
                      <AvatarFallback>AI</AvatarFallback>
                    </>
                  )}
                </Avatar>
                
                <Card className={`p-3 ${message.role === "user" ? "bg-primary text-primary-foreground" : "bg-card"}`}>
                  <div className="whitespace-pre-wrap">{message.content}</div>
                  {message.image && (
                    <div className="mt-2">
                      <img 
                        src={message.image} 
                        alt="User uploaded" 
                        className="max-h-64 rounded-md object-contain" 
                      />
                    </div>
                  )}
                </Card>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex items-start">
                <Avatar className="h-8 w-8 mr-2">
                  <AvatarImage src="/lovable-uploads/a7730e30-4841-4e84-b261-c7a02ce07b27.png" />
                  <AvatarFallback>
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </AvatarFallback>
                </Avatar>
                <Card className="p-3">
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                </Card>
              </div>
            </div>
          )}
          
          {/* Invisible element to scroll to */}
          <div ref={messagesEndRef} />
        </div>
        
        {/* Image preview */}
        {imagePreview && (
          <div className="px-4 pb-2">
            <div className="relative w-16 h-16">
              <img 
                src={imagePreview} 
                alt="Preview" 
                className="w-full h-full object-cover rounded-md border border-border" 
              />
              <Button
                size="sm"
                variant="destructive"
                className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full"
                onClick={() => {
                  setSelectedImage(null);
                  setImagePreview(null);
                }}
              >
                ×
              </Button>
            </div>
          </div>
        )}
        
        {/* Input area */}
        <div className="p-4 border-t fixed bottom-0 left-0 right-0 bg-background max-w-md mx-auto">
          <div className="flex items-center gap-2">
            <Button
              size="icon"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
              className="flex-shrink-0"
            >
              <Image className="h-5 w-5" />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                ref={fileInputRef}
                className="hidden"
              />
            </Button>
            
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Andika ujumbe hapa..."
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              disabled={isLoading}
              className="flex-1"
            />
            
            <Button
              size="icon"
              onClick={handleSend}
              disabled={(!input.trim() && !selectedImage) || isLoading}
              className="flex-shrink-0"
            >
              {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
            </Button>
          </div>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full mt-2 text-xs text-muted-foreground"
            onClick={scrollToBottom}
          >
            <ArrowDown className="h-3 w-3 mr-1" />
            Scroll to bottom
          </Button>
        </div>
      </div>
    </AppLayout>
  );
};

export default Uliza;

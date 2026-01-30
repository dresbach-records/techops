"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare, Send } from "lucide-react";

export function ChatWidget() {
  const [messages, setMessages] = useState([
    { from: 'bot', text: 'Olá! Como posso ajudar você hoje com seu roadmap técnico?' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim()) {
      setMessages([...messages, { from: 'user', text: input }]);
      // Simulate bot response
      setTimeout(() => {
        setMessages(prev => [...prev, { from: 'bot', text: 'Obrigado pela sua pergunta. Um de nossos consultores responderá em breve.' }]);
      }, 1000);
      setInput('');
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg"
          size="icon"
        >
          <MessageSquare className="h-7 w-7" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Fale com um Consultor</DialogTitle>
          <DialogDescription>
            Tire suas dúvidas sobre o diagnóstico, roadmap ou qualquer questão técnica.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <ScrollArea className="h-72 w-full pr-4">
            <div className="space-y-4">
              {messages.map((msg, index) => (
                <div key={index} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`rounded-lg px-3 py-2 max-w-xs ${msg.from === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
        <DialogFooter>
          <div className="flex w-full items-center space-x-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Digite sua mensagem..."
            />
            <Button onClick={handleSend} size="icon">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

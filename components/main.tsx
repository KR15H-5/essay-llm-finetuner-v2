"use client"; // Add this line to mark the component as a Client Component

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const SUPABASE_URL = 'https://qbhmbdwocbvnhsampfmm.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFiaG1iZHdvY2J2bmhzYW1wZm1tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjExMjM4NzIsImV4cCI6MjAzNjY5OTg3Mn0.-bF1bcBAkawL5eXeN5gjJuP4FdAqL4W2Cvtk4_g2aSE';
const BACKEND_URL = 'https://juicy-boa-essay-llm-finetuner-13be60c5.koyeb.app';

export function Main() {
  const [userId, setUserId] = useState('');
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [fineTunedUserId, setFineTunedUserId] = useState('');
  const [message, setMessage] = useState('');

  const fineTune = async () => {
    const essay = {
      userid: userId,
      prompt: prompt,
      content: response,
    };

    const supabaseResponse = await fetch(`${SUPABASE_URL}/rest/v1/essay-data`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
      },
      body: JSON.stringify(essay),
    });

    if (supabaseResponse.ok) {
      alert('Data stored successfully');
    } else {
      alert('Error storing data!');
    }
  };

  const train = async () => {
    try {
      console.log('Sending request to:', `${BACKEND_URL}/fine-tune`);
      console.log(fineTunedUserId)
      const trainResponse = await fetch(`${BACKEND_URL}/fine-tune`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ value: parseInt(fineTunedUserId) }),
      });

      if (trainResponse.ok) {
        const result = await trainResponse.json();
        setMessage(result.completion); // Update the message with the generated response
      } else {
        const errorData = await trainResponse.json();
        alert('Error during training: ' + errorData.message);
        console.error('Error response from backend:', errorData);
      }
    } catch (error) {
      console.error('Error during training:', error);
      alert('Error during training');
    }
  };
  return (
    <div className="flex items-center justify-center bg-[#f0f0f0] min-h-screen">
      <div className="w-full max-w-4xl bg-[#f0f0f0] shadow-lg">
        <Card>
          <CardHeader>
            <CardTitle className="text-[#6b46c1]">Essay Fine-Tuning App</CardTitle>
            <CardDescription>
              Input your user ID, prompt, and response to generate a fine-tuned response.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="userId" className="text-[#6b46c1]">
                  User ID
                </Label>
                <Input
                  id="userId"
                  placeholder="Enter your user ID"
                  className="border-[#6b46c1] focus:ring-[#6b46c1]"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="prompt" className="text-[#6b46c1]">
                  Prompt
                </Label>
                <Textarea
                  id="prompt"
                  placeholder="Enter the essay prompt"
                  className="min-h-[100px] border-[#6b46c1] focus:ring-[#6b46c1]"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="response" className="text-[#6b46c1]">
                Response
              </Label>
              <Textarea
                id="response"
                placeholder="Enter your essay response"
                className="min-h-[200px] border-[#6b46c1] focus:ring-[#6b46c1]"
                value={response}
                onChange={(e) => setResponse(e.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button className="bg-[#6b46c1] text-white hover:bg-[#553c9a]" onClick={fineTune}>
              Add essay to knowledge base
            </Button>
          </CardFooter>
        </Card>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="fineTunedUserId" className="text-[#6b46c1]">
              Fine-Tuned User ID
            </Label>
            <Input
              id="fineTunedUserId"
              placeholder="Enter the user ID for the fine-tuned response"
              className="border-[#6b46c1] focus:ring-[#6b46c1]"
              value={fineTunedUserId}
              onChange={(e) => setFineTunedUserId(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="fineTunedPrompt" className="text-[#6b46c1]">
              Fine-Tuned Prompt
            </Label>
            <Input
              id="fineTunedPrompt"
              placeholder="Enter the prompt for the fine-tuned response"
              className="border-[#6b46c1] focus:ring-[#6b46c1]"
            />
          </div>
            <Button className="bg-[#6b46c1] text-white hover:bg-[#553c9a]" onClick={train}>
              Generate fine-tuned response
            </Button>
        </div>
        <div className="mt-8">
          <Card className="bg-[#f0f0f0] shadow-lg">
            <CardHeader>
              <CardTitle className="text-[#6b46c1]">Fine-Tuned Response</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose text-muted-foreground">
                {message ? (
                  <p>{message}</p>
                ) : (
                  <p>
                    This is a sample fine-tuned response based on the information you provided. The AI model has analyzed
                    your essay prompt and response, and generated a refined and polished version of your essay.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

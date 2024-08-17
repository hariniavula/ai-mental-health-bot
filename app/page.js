'use client'
import { useState, useRef, useEffect } from 'react'
import { Box, Button, CircularProgress, Stack, TextField, Typography, Link } from '@mui/material'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '@/app/firebase/config'
import { useRouter } from 'next/navigation'
import { signOut } from 'firebase/auth'
export default function Home() {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();

  // Ensure that hooks are not conditionally rendered
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Hi! I'm a mental health chat bot here to listen and support you. Please remember that I'm not a substitute for professional medical advice or therapy. How can I assist you today?`
    }
  ]);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/sign-in');
    }
  }, [user, loading, router]);


  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  const clearMessages = () => {
    setMessages([]);
  }

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (loading || !user) {
    return (
      <Box
        width="100vw"
        height="100vh"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <CircularProgress />
      </Box>
    );
  }

  const sendMessage = async () => {
    if (!message.trim() || isLoading) return;
    setIsLoading(true);
    setMessage('');
    setMessages((messages) => [
      ...messages,
      { role: 'user', content: message },
      { role: 'assistant', content: '' },
    ]);

    const response = fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([...messages, { role: 'user', content: message }]),
    }).then(async (res) => {
      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      let result = '';

      return reader.read().then(function processText({ done, value }) {
        if (done) {
          return result;
        }
        const text = decoder.decode(value || new Uint8Array(), { stream: true });
        setMessages((messages) => {
          let lastMessage = messages[messages.length - 1];
          let otherMessages = messages.slice(0, messages.length - 1);
          return [
            ...otherMessages,
            { ...lastMessage, content: lastMessage.content + text },
          ];
        });
        return reader.read().then(processText);
      });
    });
    setIsLoading(false);
  }

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  }


  const handleLogout = () => {
    signOut(auth);
    sessionStorage.removeItem('user');
    router.push('/sign-up');
  }

  return (
   
    <Box
    
      width="100vw"
      height="95vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      style={{ marginBottom: '20px', marginTop: '20px' }}
      >
       <Typography variant="h5" component="div" fontWeight="bold" align="center" style={{margin: '15px' }}>
          Chat Bot
        </Typography>
      <Box
        position="absolute"
        top={16}
        right={16}
      >
        <Button
            variant="contained"
            onClick={clearMessages}
            color="error"
            style={{marginRight: '10px' }}
          >
            Clear
          </Button>
        <Button variant="outlined" color="secondary" onClick={handleLogout}>
          Log Out
        </Button>
        
      </Box>

      <Stack
        direction="column"
        width="600px"
        height="700px"
        border="1px solid black"
        padding={2}
        spacing={3}
      >
        <Stack
          direction="column"
          spacing={2}
          flexGrow={1}
          overflow="auto"
          maxHeight="100%"
        >
          {messages.map((message, index) => (
            <Box key={index} display='flex' justifyContent={
              message.role === 'assistant' ? 'flex-start' : 'flex-end'
            }>
              <Box
                bgcolor={
                  message.role === 'assistant' ? 'primary.main' : 'secondary.main'
                }
                color="white"
                borderRadius={16}
                p={3}
              >
                {message.content}
              </Box>
            </Box>
          ))}
          <div ref={messagesEndRef} />
        </Stack>

        <Stack
          direction="row"
          spacing={2}>
          <TextField
            label="Message"
            fullWidth
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
          />
        </Stack>

        <Button
          variant="contained"
          onClick={sendMessage}
          disabled={isLoading}
        >
          {isLoading ? 'Sending...' : 'Send'}
        </Button>

       

       

      </Stack>
    </Box>
  );
}

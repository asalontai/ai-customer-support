"use client"
import { auth } from "@/firebase";
import { Box, Button, FormControl, InputLabel, MenuItem, Select, Stack, TextField } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import Navbar from "./components/Navbar";

export default function Home() {
  const [user, loading] = useAuthState(auth);

  const router = useRouter();

  // useEffect(() => {
  //   if (!loading && !user) {
  //     router.push("/sign-in");
  //   }
  // }, [loading, user, router]);

  const greetingMessages = {
    en: "Hi, I'm the Headstarter Support Agent, how can I assist you today?",
    es: "Hola, soy el Agente de Soporte de Headstarter, ¿cómo puedo ayudarte hoy?",
    fr: "Bonjour, je suis l'Agent de Support Headstarter, comment puis-je vous aider aujourd'hui?",
    de: "Hallo, ich bin der Headstarter Support-Agent, wie kann ich Ihnen heute helfen?",
    zh: "您好，我是 Headstarter 支持代理，今天我能为您做些什么？"
  };

  const [messages, setMessages] = useState([{
    role: 'assistant',
    content: greetingMessages['en'],
  }]); 

  const [message, setMessage] = useState('')
  const [language, setLanguage] = useState('en');

  const handleLanguageChange = (event) => {
    const selectedLanguage = event.target.value;
    setLanguage(selectedLanguage);
    setMessages([{
      role: 'assistant',
      content: greetingMessages[selectedLanguage],
    }]);
  };

  const sendMessage = async () => {
    setMessage("");
    setMessages((messages) => [
      ...messages,
      {role: "user", content: message},
      {role: "assistant", content: ''}
    ]);
    const response = fetch('/api/chat', {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify([...messages, {role: 'user', content: message}, { role: 'system', content: `Language: ${language}` }]),
    }).then( async (res) => {
      const reader = res.body.getReader();
      const decoder = new TextDecoder()

      let result = '';
      return reader.read().then(function processText({ done, value }) {
        if (done) {
          return result;
        }
        const text = decoder.decode(value || new Int8Array(), { stream: true })
        setMessages(( messages ) => {
          let lastMessage = messages[messages.length - 1];
          let otherMessages = messages.slice(0, messages.length - 1);
          return[
            ...otherMessages,
            {
              ...lastMessage,
              content: lastMessage.content + text,
            },
          ]
        })
        return reader.read().then(processText)
      })
    })
  }

  return (
    <Box>
      <Navbar />
      <Box 
        width={"100vw"}
        display="flex"
        flexDirection={"column"}
        justifyContent={"center"}
        alignItems={"center"}
        marginTop={4}
      >
        <Stack
          direction={"column"}
          width={"600px"}
          height={"700px"}
          border={"3px solid #008080"}
          p={2}
          spacing={3}
          bgcolor={"#212122"}
          color={"white"}
          borderRadius={"8px 8px 8px 8px"}
        >
          <Stack
            direction={"column"}
            spacing={2}
            flexGrow={1}
            overflow={"auto"}
            maxHeight={"100%"}
          >
            {
              messages.map((message, index) => (
                <Box key={index} display={"flex"} justifyContent={
                  message.role === 'assistant' ? 'flex-start' : 'flex-end'
                }>
                  <Box
                    bgcolor={
                      message.role === 'assistant' ? '#004d40' : '#4db6ac'
                    }
                    color={"white"}
                    borderRadius={16}
                    p={3}
                  >
                    {message.content}
                  </Box>
                </Box>
              ))
            }
          </Stack>
          <Stack direction={"row"} spacing={2}>
            <TextField
              label="Message"
              sx={{
                width: "355px",
                "& .MuiInputLabel-root": {
                    color: "#008080",
                },
                "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                        borderColor: "#008080",
                    },
                    "&:hover fieldset": {
                        borderColor: "#008080",
                    },
                    "&.Mui-focused fieldset": {
                        borderColor: "#008080",
                    },
                    "& input": {
                        color: "#008080",
                    },
                },
                "& .MuiInputLabel-outlined": {
                    color: "008080",
                    "&.Mui-focused": {
                        color: "#008080",
                    },
                },
              }}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <FormControl 
              variant="outlined"
              sx={{
                "& .MuiInputLabel-root": {
                  color: "#008080",
                },
                "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                        borderColor: "#008080",
                    },
                    "&:hover fieldset": {
                        borderColor: "#008080",
                    },
                    "&.Mui-focused fieldset": {
                        borderColor: "#008080",
                    },
                    "& input": {
                        color: "#008080",
                    },
                },
                "& .MuiInputLabel-outlined": {
                    color: "008080",
                    "&.Mui-focused": {
                        color: "#008080",
                    },
                },
              }}  
            >
              <InputLabel 
                id="language-select-label" 
                sx={{ 
                  width: "110px",
                  color: "inherit",
                }}
                className="label"
              >
                Language
              </InputLabel>
              <Select
                labelId="language-select-label"
                id="language-select"
                value={language}
                onChange={handleLanguageChange}
                label="Language"
                sx={{
                  color: "#008080",
                  backgroundColor: "#212122"
                }}

                MenuProps={{
                  PaperProps: {
                      sx: {
                          backgroundColor: "#212122", 
                          color: "#008080",
                      },
                  },
                }}
              >
                <MenuItem value={'en'} sx={{ borderBottom: "1px solid #008080" }} >English</MenuItem>
                <MenuItem value={'es'} sx={{ borderBottom: "1px solid #008080" }}>Spanish</MenuItem>
                <MenuItem value={'fr'} sx={{ borderBottom: "1px solid #008080" }}>French</MenuItem>
                <MenuItem value={'de'} sx={{ borderBottom: "1px solid #008080" }}>German</MenuItem>
                <MenuItem value={'zh'}>Chinese</MenuItem>
              </Select>
            </FormControl>
            <Button 
              variant="contained" 
              onClick={sendMessage}
              sx={{
                bgcolor: "#128283",
                '&:hover': {
                    backgroundColor: '#1DB3B6',
                },
              }}
            >
              Send
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Box>
  );
}

'use client';
import { useState } from 'react';
import { Button, TextField, Typography, Link, Container, Box } from '@mui/material';
import { auth } from '@/app/firebase/config';
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { useRouter } from 'next/navigation';
import { toast } from "react-hot-toast";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import '@fontsource/raleway'; // Import Raleway font

const theme = createTheme({
  typography: {
    fontFamily: 'Raleway, Arial',
  },
});

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [signInWithEmailAndPassword] = useSignInWithEmailAndPassword(auth);
  const router = useRouter();

  const handleSignIn = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(email, password); 
      const user = userCredential.user;

      toast.success("Sign in successful!");
      console.log(user);
      setEmail(''); 
      setPassword('');
      return router.push('/');
    } catch (error) {
      toast.error("Sign in failed! Invalid password or username. Try again.");
      console.log(error.message);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSignIn();
    }
  };

  return (
    <ThemeProvider theme={theme}>
    <Container
      maxWidth="xl"
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#DFF1E6',
      }}
    >
      <Box
        sx={{
          textAlign: 'center',
          marginBottom: '2rem',
        }}
      >
        <Typography variant="h3" color="#3E604C" gutterBottom>
          Support Bot 
        </Typography>
        <Typography variant="h6" color="#3E604C" gutterBottom>
        Your Friendly Mental Health Companion
        </Typography>
      </Box>
        <Box
          width="80vh"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            backgroundColor: '#BAD5C5',
            padding: '2rem',
            borderRadius: '8px',
            boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
          }}
        >
          <Typography variant="h4" color="#3E604C" gutterBottom>
            Sign in
          </Typography>
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            InputProps={{
              sx: {
                backgroundColor: '#ffffff',
              },
            }}
          />
          <TextField
            label="Password"
            variant="outlined"
            fullWidth
            margin="normal"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={handleKeyPress}
            InputProps={{
              sx: {
                backgroundColor: '#ffffff',
              },
            }}
          />
          <Button
            variant="contained"
            onClick={handleSignIn}
            sx={{
              marginTop: '1rem',
              backgroundColor: '#3E604C',
              '&:hover': {
                backgroundColor: '#2C4A3B',
              },
            }}
          >
            Sign in
          </Button>
          <Typography variant="body2" align="center" color="textSecondary" sx={{ marginTop: '10px' }}>
            Don’t have an account?{' '}
            <Link href="/sign-up" color="secondary">
              Sign up now.
            </Link>
          </Typography>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default SignIn;

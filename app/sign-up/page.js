'use client';
import { useState } from 'react';
import { Button, Link, TextField, Typography, Container, Box } from '@mui/material';
import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth } from '@/app/firebase/config';
import { useRouter } from 'next/navigation';
import { toast } from "react-hot-toast";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import '@fontsource/raleway'; // Import Raleway font

const theme = createTheme({
  typography: {
    fontFamily: 'Raleway, Arial',
  },
});

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [createUserWithEmailAndPassword] = useCreateUserWithEmailAndPassword(auth);
  const router = useRouter();

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSignup();
    }
  };

  const handleSignup = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;

      toast.success("Account successfully created! Please sign in.");
      console.log(user);
      setEmail(''); 
      setPassword('');
      return router.push('/sign-in');
    } catch (error) {
      toast.error("Unable to create account. Check to see if you already have an account, if the email inputted is invalid, or if password is too short.");
      console.log(error.message);
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
            Welcome to Support Bot
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
            Sign Up
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
            onClick={handleSignup}
            sx={{
              marginTop: '1rem',
              backgroundColor: '#3E604C',
              '&:hover': {
                backgroundColor: '#2C4A3B',
              },
            }}
          >
            Sign Up
          </Button>
          <Typography variant="body2" align="center" color="textSecondary" style={{ marginTop: '10px' }}> 
            Already have an account?{' '}
            <Link href="/sign-in" color="secondary">
              Sign in.
            </Link>
          </Typography>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default Signup;

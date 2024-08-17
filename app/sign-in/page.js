'use client'
import { useState } from 'react';
import { Button, TextField, Typography, Link, Container, Box } from '@mui/material';
import {auth} from '@/app/firebase/config'
import {useSignInWithEmailAndPassword} from 'react-firebase-hooks/auth'
import { useRouter } from 'next/navigation';
import { toast } from "react-hot-toast";

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [signInWithEmailAndPassword] = useSignInWithEmailAndPassword(auth);
  const router = useRouter()

  const handleSignIn = async (event) => {
    try {
      const userCredential = await signInWithEmailAndPassword(email, password); 
      const user = userCredential.user;
  
      toast.success("Sign in successful!");
      console.log(user);
      setEmail(''); 
      setPassword('');
      return router.push('/');
    } catch (error) {
      toast.error("Sign in failed! Try again.");
      console.log(error.message);
    }
  };
  
  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSignIn();
    }
  }

  return (
    <Container maxWidth="xl"
    sx={{
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          backgroundColor: '#ffffff',
          padding: '2rem',
          borderRadius: '8px',
          boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Typography variant="h4" color="primary" gutterBottom>
          Sign in
        </Typography>
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSignIn}
          
          sx={{
            marginTop: '1rem',
            backgroundColor: '#007bff',
            '&:hover': {
              backgroundColor: '#0056b3',
            },
          }}
        >
          Sign in
        </Button>
        <Typography variant="body2" align="center" color="textSecondary" style={{marginTop: '10px' }}>
          Don’t have an account?{' '}
          <Link href="/sign-up" color="secondary">
            Sign up now.
          </Link>
        </Typography>
      </Box>
    </Container>
  );
};

export default SignIn;

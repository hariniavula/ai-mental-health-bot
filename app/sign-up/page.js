'use client'
import { useState } from 'react';
import { Button, Link, TextField, Typography, Container, Box } from '@mui/material';
import {useCreateUserWithEmailAndPassword} from 'react-firebase-hooks/auth';
import {auth} from '@/app/firebase/config'
import { useRouter } from 'next/navigation'


const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [createUserWithEmailAndPassword] = useCreateUserWithEmailAndPassword(auth);
  const router = useRouter();

  const handleSignup = async () => {
    try {
      const res = await createUserWithEmailAndPassword(email, password)
      console.log({res})
      setEmail(''); 
      setPassword('');
      router.push('/sign-in')
    } catch (e){
      console.error(e)
    }
  };

  return (
    <Container maxWidth="sm">
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
          Sign Up
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
        />
       
        <Button
          variant="contained"
          color="primary"
          onClick={handleSignup}
          sx={{
            marginTop: '1rem',
            backgroundColor: '#007bff',
            '&:hover': {
              backgroundColor: '#0056b3',
            },
          }}
        >
          Sign Up
        </Button>
        <Typography variant="body2" align="center" color="textSecondary" style={{marginTop: '10px' }}> 
          Don’t have an account?{' '}
          <Link href="/sign-in" color="secondary">
            Sign in.
          </Link>
        </Typography>
      </Box>
    </Container>
  );
};

export default Signup;

import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';
import { useToast } from '@chakra-ui/react';

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to access this feature',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      navigate('/signin');
    }
  }, [user, navigate, toast]);

  return user ? children : null;
}

export default ProtectedRoute;
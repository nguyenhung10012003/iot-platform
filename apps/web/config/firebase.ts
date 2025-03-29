import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyChirHK9xd5tQpl9SENj9wDahcoq6RzoKc',
  authDomain: 'iot-platform-bb879.firebaseapp.com',
  projectId: 'iot-platform-bb879',
  storageBucket: 'iot-platform-bb879.firebasestorage.app',
  messagingSenderId: '923960165368',
  appId: '1:923960165368:web:0f2b2cab8a4c177aac4c0d',
  measurementId: 'G-L0Y8QK5ZRM',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const idToken = await result.user.getIdToken();
    return idToken;
  } catch (error) {
    console.error('Login with Google failed:', error);
    throw error;
  }
};

export const authenticateWithGoogle = async (idToken: string) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/google`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idToken }),
      },
    );

    if (!response.ok) {
      if (response.status === 401) {
        const error = await response.json();
        throw new Error(error.message);
      }
      throw new Error('Authentication failed');
    }

    return response.json();
  } catch (error) {
    console.error('Authentication with Google failed:', error);
    throw error;
  }
};

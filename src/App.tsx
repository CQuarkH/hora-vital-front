import './App.css'
import { Header } from './modules/auth/components/Header'
import { useAuth } from './modules/auth/context/AuthContext'
import HomePage from './modules/auth/pages/HomePage';
import OnboardingPage from './modules/auth/pages/OnboardingPage';

function App() {
  const { user } = useAuth();

  return (
    <div className='flex flex-col w-full h-full gap-12'>
      <Header />
      <main className='flex w-full h-full items-center justify-center max-w-[1080px] mx-auto px-4'>
        {user ? (
          <HomePage />
        ) : (
          <OnboardingPage />
        )}
      </main>
    </div>
  )
}

export default App

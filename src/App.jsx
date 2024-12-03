import styled from 'styled-components';
import { motion } from 'framer-motion';
import GlobalStyles from './styles/GlobalStyles';
import NFTGallery from './components/NFTGallery';

function App() {
  return (
    <>
      <GlobalStyles />
      <AppContainer>
        <Header
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Title>NFT Gallery Explorer</Title>
        </Header>

        <NFTGallery />
      </AppContainer>
    </>
  );
}

const AppContainer = styled.div`
  min-height: 100vh;
  background: #000000;
  position: relative;
  overflow: hidden;
`;

const Header = styled(motion.header)`
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  position: sticky;
  top: 0;
  z-index: 100;
  padding: 1rem 2rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Title = styled.h1`
  font-size: 1.5rem;
  color: #ffffff;
  font-weight: 700;
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

export default App;

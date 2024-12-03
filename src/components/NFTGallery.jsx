import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import NFTCard from './NFTCard';
import { fetchNFTs } from '../utils/web3';
import { SMART_CONTRACT } from '../config/contract';

const NFTGallery = () => {
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const loadNFTs = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('Starting to fetch NFTs...');
        
        const fetchedNFTs = await fetchNFTs();
        console.log('Fetched NFTs:', fetchedNFTs);
        
        if (!fetchedNFTs || fetchedNFTs.length === 0) {
          setError('No NFTs found in this collection.');
        } else {
          setNfts(fetchedNFTs);
        }
      } catch (error) {
        console.error('Error in loadNFTs:', error);
        setError('Failed to load NFTs. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadNFTs();
  }, [retryCount]);

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
  };

  if (loading) {
    return (
      <LoadingContainer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <LoadingSpinner />
        <LoadingText>Loading NFTs...</LoadingText>
      </LoadingContainer>
    );
  }

  if (error) {
    return (
      <ErrorContainer
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <ErrorIcon>⚠️</ErrorIcon>
        <ErrorMessage>{error}</ErrorMessage>
        <RetryButton onClick={handleRetry}>
          Try Again
        </RetryButton>
      </ErrorContainer>
    );
  }

  return (
    <GalleryContainer>
      <Grid>
        <AnimatePresence>
          {nfts.map((nft, index) => (
            <motion.div
              key={nft.tokenId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
            >
              <NFTCard nft={nft} />
            </motion.div>
          ))}
        </AnimatePresence>
      </Grid>
    </GalleryContainer>
  );
};

const GalleryContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 2rem;
  padding: 1rem;
`;

const LoadingContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 50vh;
`;

const LoadingSpinner = styled.div`
  width: 50px;
  height: 50px;
  border: 3px solid #333;
  border-top: 3px solid #fff;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const LoadingText = styled.p`
  margin-top: 1rem;
  color: #fff;
  font-size: 1.2rem;
`;

const ErrorContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 50vh;
  text-align: center;
  padding: 2rem;
`;

const ErrorIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
`;

const ErrorMessage = styled.p`
  color: #ff6b6b;
  font-size: 1.2rem;
  margin-bottom: 1rem;
  max-width: 500px;
`;

const RetryButton = styled.button`
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 25px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

export default NFTGallery;

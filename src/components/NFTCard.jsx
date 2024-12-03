import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useState } from 'react';

const NFTCard = ({ nft }) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);

  const handleImageLoad = () => {
    setIsImageLoaded(true);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };

  return (
    <Card
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <ImageContainer>
        {!isImageLoaded && !imageError && <LoadingSpinner />}
        {!imageError ? (
          <NFTImage
            src={nft.image}
            alt={nft.name}
            onLoad={handleImageLoad}
            onError={handleImageError}
            style={{ opacity: isImageLoaded ? 1 : 0 }}
          />
        ) : (
          <FallbackImage>
            <FallbackIcon>🖼️</FallbackIcon>
            <FallbackText>Image Unavailable</FallbackText>
          </FallbackImage>
        )}
        <TokenIdBadge>#{nft.tokenId}</TokenIdBadge>
      </ImageContainer>
      
      <Content>
        <Title>{nft.name}</Title>
        
        <Description onClick={toggleDescription}>
          {showFullDescription ? nft.description : (
            nft.description?.length > 100 
              ? nft.description.slice(0, 100) + '...' 
              : nft.description
          )}
          {nft.description?.length > 100 && (
            <ExpandButton>
              {showFullDescription ? ' Show Less' : ' Show More'}
            </ExpandButton>
          )}
        </Description>
        
        {nft.attributes && nft.attributes.length > 0 && (
          <AttributesContainer>
            {nft.attributes.slice(0, 3).map((attr, index) => (
              <Attribute key={index}>
                <AttributeType>{attr.trait_type}</AttributeType>
                <AttributeValue>{attr.value}</AttributeValue>
              </Attribute>
            ))}
            {nft.attributes.length > 3 && (
              <MoreAttributes>+{nft.attributes.length - 3} more</MoreAttributes>
            )}
          </AttributesContainer>
        )}
      </Content>
    </Card>
  );
};

const Card = styled(motion.div)`
  background: linear-gradient(145deg, #1a1a1a, #2a2a2a);
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const ImageContainer = styled.div`
  position: relative;
  padding-top: 100%;
  background: #1a1a1a;
  overflow: hidden;
`;

const NFTImage = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease, opacity 0.3s ease;

  ${Card}:hover & {
    transform: scale(1.05);
  }
`;

const TokenIdBadge = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-family: monospace;
  backdrop-filter: blur(4px);
`;

const FallbackImage = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #2a2a2a;
  color: #666;
`;

const FallbackIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 0.5rem;
`;

const FallbackText = styled.div`
  font-size: 0.9rem;
`;

const LoadingSpinner = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 30px;
  height: 30px;
  border: 3px solid #333;
  border-top: 3px solid #fff;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: translate(-50%, -50%) rotate(0deg); }
    100% { transform: translate(-50%, -50%) rotate(360deg); }
  }
`;

const Content = styled.div`
  padding: 1.5rem;
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const Title = styled.h3`
  font-size: 1.2rem;
  color: #ffffff;
  margin-bottom: 0.5rem;
  font-weight: 600;
`;

const Description = styled.p`
  font-size: 0.9rem;
  color: #b0b0b0;
  margin-bottom: 1rem;
  line-height: 1.4;
  cursor: pointer;
`;

const ExpandButton = styled.span`
  color: #4ecdc4;
  font-size: 0.8rem;
  margin-left: 0.5rem;
  
  &:hover {
    text-decoration: underline;
  }
`;

const AttributesContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: auto;
`;

const Attribute = styled.div`
  background: rgba(255, 255, 255, 0.1);
  padding: 0.3rem 0.6rem;
  border-radius: 8px;
  font-size: 0.8rem;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
`;

const AttributeType = styled.span`
  color: #888;
  font-size: 0.7rem;
`;

const AttributeValue = styled.span`
  color: #fff;
  font-weight: 500;
`;

const MoreAttributes = styled.div`
  color: #888;
  font-size: 0.8rem;
  padding: 0.3rem 0.6rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  display: flex;
  align-items: center;
`;

export default NFTCard;

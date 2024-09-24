import React, { useEffect, useState } from 'react';
import { Loader, Box, Button } from '@mantine/core';
import api from '../services/api';
import { IconStar, IconStarFilled } from '@tabler/icons-react';

const WordDetails = ({ wordDetails, isLoading }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const token = localStorage.getItem('token'); 

  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (!wordDetails || !wordDetails[0]?.word) return;

      try {
        console.log('Verificando favoritos para a palavra:', wordDetails[0].word);
        const response = await api.get('/api/user/me/favorites', {
          headers: { Authorization: token },
        });
        
        const isFavorited = response.data.results.some(
          (item) => item.word === wordDetails[0].word
        );
        setIsFavorite(isFavorited);
      } catch (error) {
        console.error('Erro ao verificar favoritos:', error);
      }
    };

    if (wordDetails) {
      checkFavoriteStatus();
    }
  }, [wordDetails, token]);

  // Função para lidar com o clique no ícone de favorito
  const handleFavoriteClick = async () => {
    if (!wordDetails || !wordDetails[0]?.word) return;

    try {
      if (isFavorite) {
        // Remove dos favoritos
        await api.delete(`/api/entries/en/${wordDetails[0].word}/unfavorite`, {
          headers: { Authorization: token },
        });
        console.log(wordDetails.word);
        setIsFavorite(false);
      } else {
        // Adiciona aos favoritos
        await api.post(
          `/api/entries/en/${wordDetails[0].word}/favorite`,
          null,
          {
            headers: { Authorization: token },
          }
        );
        setIsFavorite(true);
      }
    } catch (error) {
      console.error('Erro ao favoritar/desfavoritar a palavra:', error);
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  if (!wordDetails) {
    return <p className="welcome-message">Select a word from the list to see details.</p>;
  }

  const phonetics = wordDetails[0]?.phonetics || [];

  return (
    <Box className="word-details-container">
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <h2>{wordDetails[0].word}</h2>

      <Button className="favorite-button" variant="subtle" onClick={handleFavoriteClick}>
        {isFavorite ? (
          <IconStarFilled size={24} color="gold" /> 
        ) : (
          <IconStar size={24} color="gray" /> 
        )}
      </Button>
    </div>

    {phonetics.length > 0 && (
      <div>
        <p>Fonética: {phonetics[0].text}</p>
        {phonetics[0].audio && (
          <audio controls>
            <source src={phonetics[0].audio} type="audio/mpeg" />
            Seu navegador não suporta o elemento de áudio.
          </audio>
        )}
      </div>
    )}

    <div>
      <h3>Significados:</h3>
      {wordDetails[0].meanings.map((meaning, index) => (
        <div key={index}>
          <h4>{meaning.partOfSpeech}</h4>
          <ul>
            {meaning.definitions.map((definition, defIndex) => (
              <li key={defIndex}>{definition.definition}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  </Box>
);
};

export default WordDetails;

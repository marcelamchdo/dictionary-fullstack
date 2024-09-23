import React from 'react';
import { Loader, Box } from '@mantine/core';

const WordDetails = ({ wordDetails, isLoading }) => {
  if (isLoading) {
    return <Loader />;
  }

  if (!wordDetails) {
    return <p>Selecione uma palavra para ver os detalhes</p>;
  }

  const phonetics = wordDetails[0]?.phonetics || [];

  return (
    <Box sx={{ padding: '16px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>{wordDetails[0].word}</h2>

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

import React, { useState, useEffect, useCallback } from 'react';
import { Loader, Box, Grid } from '@mantine/core';
import api from '../services/api'; 

const WordList = ({ onWordClick }) => {
  const [words, setWords] = useState([]);
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(true);  
  const [isLoading, setIsLoading] = useState(false); 

  const loadWords = useCallback(async () => {
    if (!hasNext || isLoading) return; 
    setIsLoading(true); 

    try {
      const response = await api.get(`/api/entries/en`, {
        params: { page },
      });
      setWords((prevWords) => [...prevWords, ...response.data.results]);
      setHasNext(response.data.hasNext); 
      setPage((prevPage) => prevPage + 1); 
    } catch (err) {
      console.error('Error loading words:', err);
    } finally {
      setIsLoading(false); 
    }
  }, [hasNext, isLoading, page]); 

  const handleScroll = useCallback(() => {
    const scrollTop = document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = window.innerHeight;

    if (scrollTop + clientHeight >= scrollHeight - 50) {
      loadWords(); 
    }
  }, [loadWords]); 

  useEffect(() => {
    loadWords(); 
    window.addEventListener('scroll', handleScroll); 

    return () => {
      window.removeEventListener('scroll', handleScroll); 
    };
  }, [handleScroll, loadWords]); 

  return (
    <Box
      sx={{
        padding: '16px',
        border: '1px solid #ccc',
        borderRadius: '8px',
        minHeight: '400px',
        overflowY: 'auto', 
      }}
    >
      <Grid>
        {words.map((word, index) => (
          <Grid.Col key={index} span={3}>
             <div className="word-item" onClick={() => onWordClick(word)}>
              {word}
            </div>
          </Grid.Col>
        ))}
      </Grid>
      
      {isLoading && <Loader />} 
      {!hasNext && !isLoading && <p>No more words to load.</p>} 
    </Box>
  );
};

export default WordList;

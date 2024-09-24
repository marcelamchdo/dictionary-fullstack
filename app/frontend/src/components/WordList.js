import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Loader, Box, Grid } from '@mantine/core';
import api from '../services/api';
import '../styles/App.css';

const WordList = ({ onWordClick }) => {
  const [words, setWords] = useState([]);
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const containerRef = useRef(null);

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
    const container = containerRef.current;
    if (
      container &&
      container.scrollTop + container.clientHeight >=
        container.scrollHeight - 50
    ) {
      loadWords();
    }
  }, [loadWords]);

  useEffect(() => {
    loadWords();
  }, [loadWords]);

  useEffect(() => {
    const container = containerRef.current;

    if (container) {
      container.addEventListener('scroll', handleScroll); // Escutar o scroll no container
    }

    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll); // Remover o listener
      }
    };
  }, [handleScroll]);

  return (
    
    <Box className="wordlist-container" onScroll={handleScroll}>
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

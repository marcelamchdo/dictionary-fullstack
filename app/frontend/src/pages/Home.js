import React, { useEffect, useState, useCallback } from 'react';
import { Tabs, Box, Loader, Grid } from '@mantine/core';
import WordList from '../components/WordList';
import api from '../services/api';
import WordDetails from '../components/WordDetails';

export default function Home() {
  const [history, setHistory] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [selectedWordDetails, setSelectedWordDetails] = useState(null);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [isLoadingFavorites, setIsLoadingFavorites] = useState(true);
  const [isLoadingWordDetails, setIsLoadingWordDetails] = useState(false);

  const fetchHistory = useCallback(async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      console.error('Token não encontrado!');
      return;
    }
  
    try {
      const response = await api.get('/api/user/me/history', {
        headers: {
          Authorization: token,
        },
      });
      
      setHistory(response.data.results);
      setIsLoadingHistory(false);
    } catch (error) {
      console.error('Erro ao buscar histórico:', error);
      setIsLoadingHistory(false);
    }
  }, []);

  const fetchFavorites = useCallback(async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      console.error('Token não encontrado!');
      return;
    }
  
    try {
      const response = await api.get('/api/user/me/favorites', {
        headers: {
          Authorization: token,
        },
      });
      
      setFavorites(response.data.results);
      setIsLoadingFavorites(false);
    } catch (error) {
      console.error('Erro ao buscar favoritos:', error);
      setIsLoadingFavorites(false);
    }
  }, []);

  const fetchWordDetails = useCallback(async (word) => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      console.error('Token não encontrado!');
      return;
    }
  
    try {
      setIsLoadingWordDetails(true);
      const response = await api.get(`/api/entries/en/${word}`, {
        headers: {
          Authorization: token,
        },
      });
      setSelectedWordDetails(response.data); // Armazena os detalhes da palavra
      setIsLoadingWordDetails(false);
    } catch (error) {
      console.error('Erro ao buscar detalhes da palavra:', error);
      setIsLoadingWordDetails(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory();
    fetchFavorites();
  }, [fetchHistory, fetchFavorites]);

  return (
    <div className="home-container">
      <div className="word-details-container">
        {selectedWordDetails && (
          <WordDetails wordDetails={selectedWordDetails} isLoading={isLoadingWordDetails} />
        )}
      </div>

      <div className="tabs-container">
        <Tabs defaultValue="wordlist">
          <Tabs.List>
            <Tabs.Tab value="wordlist">Lista de Palavras</Tabs.Tab>
            <Tabs.Tab value="history">Histórico</Tabs.Tab>
            <Tabs.Tab value="favorites">Favoritos</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="wordlist">
            <WordList onWordClick={fetchWordDetails} /> 
          </Tabs.Panel>

          <Tabs.Panel value="history">
            <Box className="history-box">
              <h2>Histórico de Palavras Pesquisadas</h2>
              {isLoadingHistory ? (
                <Loader className="loader" />
              ) : (
                <Grid>
                  {history.length > 0 ? (
                    history.map((item, index) => (
                      <Grid.Col key={index} span={3}>
                        <div className="history-item">
                          {item.word}
                        </div>
                      </Grid.Col>
                    ))
                  ) : (
                    <p>Você ainda não visualizou nenhuma palavra.</p>
                  )}
                </Grid>
              )}
            </Box>
          </Tabs.Panel>

          <Tabs.Panel value="favorites">
            <Box className="favorites-box">
              {isLoadingFavorites ? (
                <Loader />
              ) : (
                <Grid>
                  {favorites.length > 0 ? (
                    favorites.map((item, index) => (
                      <Grid.Col key={index} span={3}>
                        <div className="favorite-item">
                          {item.word}
                        </div>
                      </Grid.Col>
                    ))
                  ) : (
                    <p>Você ainda não adicionou palavras aos favoritos.</p>
                  )}
                </Grid>
              )}
            </Box>
          </Tabs.Panel>
        </Tabs>
      </div>
    </div>
  );
}

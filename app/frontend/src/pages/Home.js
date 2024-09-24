import React, { useEffect, useState, useCallback } from 'react';
import { Tabs, Box, Loader, Grid } from '@mantine/core';
import WordList from '../components/WordList';
import api from '../services/api';
import WordDetails from '../components/WordDetails';

export default function Home() {
  const [history, setHistory] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [selectedWordDetails, setSelectedWordDetails] = useState(null); // Mantém a palavra selecionada
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [isLoadingFavorites, setIsLoadingFavorites] = useState(true);
  const [isLoadingWordDetails, setIsLoadingWordDetails] = useState(false);
  const [wordClicked, setWordClicked] = useState(false); // Estado para saber se uma palavra foi clicada

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
      setWordClicked(true); // Quando uma palavra é clicada, muda o estado
      const response = await api.get(`/api/entries/en/${encodeURIComponent(word)}`, {
        headers: {
          Authorization: token,
        },
      });
      setSelectedWordDetails(response.data);
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

  const handleFavoriteUpdate = () => {
    fetchFavorites();
  };

  return (
    <div className="home-container">
      <div className="word-details-container">
        {wordClicked ? (
          selectedWordDetails ? (
            <WordDetails
              wordDetails={selectedWordDetails}
              isLoading={isLoadingWordDetails}
              onFavoriteUpdate={handleFavoriteUpdate}
            />
          ) : (
            <Loader />
          )
        ) : (
          <div className="welcome-message">
            <h2>Welcome to the Dictionary App!</h2>
            <p>Select a word from the list to see details.</p>
            {/* <img src="sua-imagem-ilustrativa-aqui.jpg" alt="welcome" style={{ width: '100%' }} /> */}
          </div>
        )}
      </div>

      <div className="tabs-container">
        <Tabs defaultValue="wordlist">
          <Tabs.List>
            <Tabs.Tab value="wordlist">Wordlist</Tabs.Tab>
            <Tabs.Tab value="history">History</Tabs.Tab>
            <Tabs.Tab value="favorites">Favorites</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="wordlist">
            <WordList onWordClick={fetchWordDetails} />
          </Tabs.Panel>

          <Tabs.Panel value="history">
            <Box className="history-box">
              {isLoadingHistory ? (
                <Loader className="loader" />
              ) : (
                <Grid>
                  {history.length > 0 ? (
                    history.map((item, index) => (
                      <Grid.Col key={index} span={3}>
                        <div className="history-item">{item.word}</div>
                      </Grid.Col>
                    ))
                  ) : (
                    <p className="welcome-message">Você ainda não visualizou nenhuma palavra.</p>
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
                        <div className="favorite-item">{item.word}</div>
                      </Grid.Col>
                    ))
                  ) : (
                    <p className="welcome-message">Você ainda não adicionou palavras aos favoritos.</p>
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

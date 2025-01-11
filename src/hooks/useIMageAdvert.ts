import { useState, useEffect } from 'react';
import axios from 'axios';

// Define the type for an image advert
interface ImageAdvert {
  id: number;
  title: string;
  description: string;
  image_path: string;
  is_popup: number;
  created_at: string;
}

// Define the API response type
interface ImageAdvertResponse {
  data: ImageAdvert[];
}

// Custom hook for fetching image adverts
export const useImageAdvert = (retryCount = 3, timeout = 5000) => {
  const [adverts, setAdverts] = useState<ImageAdvert[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const API_URL = import.meta.env.VITE_API_BASE_URL +'/image-adverts';

  useEffect(() => {
    const fetchImageAdverts = async (retriesLeft = retryCount) => {
      try {
        setLoading(true);
        const response = await axios.get<ImageAdvertResponse>(API_URL, {
          timeout: timeout
        });
        
        const sortedAdverts = response.data.data.sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );

        setAdverts(sortedAdverts);
        setError(null);
      } catch (err) {
        if (retriesLeft > 0 && axios.isAxiosError(err)) {
          // Retry with exponential backoff
          await new Promise(resolve => setTimeout(resolve, timeout - retriesLeft * 1000));
          return fetchImageAdverts(retriesLeft - 1);
        }
        
        setError('Failed to fetch image adverts');
        console.error('Error fetching image adverts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchImageAdverts();
  }, [retryCount, timeout]);

  // Function to filter adverts (optional)
  const filterAdverts = (filterFn?: (advert: ImageAdvert) => boolean) => {
    return filterFn 
      ? adverts.filter(filterFn) 
      : adverts;
  };

  // Function to get a specific advert by ID
  const getAdvertById = (id: number) => {
    return adverts.find(advert => advert.id === id);
  };

  return {
    adverts,
    loading,
    error,
    filterAdverts,
    getAdvertById
  };
};
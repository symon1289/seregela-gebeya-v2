import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface ImageAdvert {
  id: number;
  title: string;
  description: string;
  image_path: string;
  is_popup: number;
  created_at: string;
}

interface ImageAdvertResponse {
  data: ImageAdvert[];
}

const fetchImageAdverts = async (): Promise<ImageAdvert[]> => {
  const API_URL = `${import.meta.env.VITE_API_BASE_URL}/image-adverts`;
  const response = await axios.get<ImageAdvertResponse>(API_URL);
  return response.data.data.sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
};

export const useImageAdvert = (retryCount = 3, staleTime = (1000 * 60 * 60)) => {
  const {
    data: adverts = [],
    isLoading,
    isError,
    error,
  } = useQuery<ImageAdvert[], Error>({
    queryKey: ["imageAdverts"],
    queryFn: fetchImageAdverts,
    retry: retryCount, 
    staleTime, 
  });

  const filterAdverts = useMemo(
    () => (filterFn?: (advert: ImageAdvert) => boolean) =>
      filterFn ? adverts.filter(filterFn) : adverts,
    [adverts]
  );

  const getAdvertById = useMemo(
    () => (id: number) => adverts.find((advert) => advert.id === id),
    [adverts]
  );

  return {
    adverts,
    loading: isLoading,
    error: isError ? error?.message : null,
    filterAdverts,
    getAdvertById,
  };
};

import useSWRInfinite from "swr/infinite";
import fetcher from "../swr";

const getKey =
  (route: string) => (pageIndex: number, previousPageData: any[]) => {
    if (previousPageData && !previousPageData.length) return null; // reached the end
    return `${route}?page=${pageIndex + 1}`; // SWR key
  };

export function useSWRInfinitePagination(route: string) {
  const { data, error, isLoading, setSize, size, mutate } = useSWRInfinite(
    getKey(route),
    (url) => fetcher(url, { credentials: "include" })
  );

  const lastPage =
    data && (data.length < size || data?.[size - 1]?.data?.length === 0);
  console.log(typeof data?.[size - 1]?.data?.length);

  console.log({ size, data, lastPage });

  return {
    lastPage: lastPage ?? true,
    isLoading,
    size,
    setSize,
    mutate,
    error,
    data,
  };
}

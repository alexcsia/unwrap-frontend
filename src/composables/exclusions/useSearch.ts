import { useInfiniteQuery } from "@tanstack/vue-query";
import { searchEntity } from "@/services/exclusions";
import { computed, ref } from "vue";

export const SEARCH_PAGE_SIZE = 10;

type SearchParams = { type: "track" | "artist"; name: string };

export function useEntitySearch() {
  const submitted = ref<SearchParams | null>(null);

  const query = useInfiniteQuery({
    queryKey: ["entitySearch", submitted],
    queryFn: ({ pageParam }) =>
      searchEntity({
        ...submitted.value!,
        limit: SEARCH_PAGE_SIZE,
        cursor: pageParam,
      }),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) =>
      lastPage.length < SEARCH_PAGE_SIZE ? undefined : lastPage.at(-1)?.id,
    enabled: () => submitted.value !== null,
    staleTime: 5 * 60 * 1000,
  });

  return {
    entities: computed(() => query.data.value?.pages.flat() ?? []),
    isLoading: query.isLoading,
    isLoadingMore: query.isFetchingNextPage,
    error: query.error,
    hasMore: query.hasNextPage,
    submit: (params: SearchParams) => {
      submitted.value = params;
    },
    reset: () => {
      submitted.value = null;
    },
    loadMore: query.fetchNextPage,
  };
}

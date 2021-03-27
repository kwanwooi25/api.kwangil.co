export const getHasMore = ({ limit, offset, count }: { limit: number; offset: number; count: number }) => {
  return !limit ? false : offset + limit <= count;
};

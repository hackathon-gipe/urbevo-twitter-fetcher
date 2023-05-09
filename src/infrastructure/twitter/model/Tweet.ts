export type Tweet = {
  id: string;
  text: string;
  possibly_sensitive: boolean;
  created_at: string;
  lang: string;
  public_metrics: {
    retweet_counts: number;
    reply_count: number;
    like_count: number;
    quote_count: number;
  };
  author_id: string;
};

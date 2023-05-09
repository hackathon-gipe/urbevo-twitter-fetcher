import { Tweet } from './Tweet';

export type TwitterSearchObject = {
  data: Tweet[];
  meta: {
    newest_id: string;
    oldest_id: string;
    result_count: number;
    next_token: string;
  };
};

import axios, { AxiosError } from 'axios';
import { TwitterAPIError } from './TwitterAPIError';
import { TwitterSearchObject } from './model/TwitterSearchObject';
import { RawNeed } from '../../domain/RawNeed';
import { Tweet } from './model/Tweet';
import { LOCALITIES, LocalityKey } from '../../domain/localities';

export class TwitterAPIService {
  private _endpointURL = 'https://api.twitter.com/2/tweets/';
  private _searchPath = 'search/recent';
  private _apiToken: string;
  constructor() {
    this._apiToken = process.env.TWITTER_TOKEN;
  }

  public getSearch(localityKey: LocalityKey): Promise<RawNeed[]> {
    console.log(`Searching in Twitter API with query: ${LOCALITIES[localityKey]}`);
    return axios
      .get<TwitterSearchObject>(this._endpointURL + this._searchPath, {
        headers: {
          'User-Agent': 'urbevo-twitter-search',
          authorization: `Bearer ${this._apiToken}`
        },
        params: {
          query: LOCALITIES[localityKey],
          'tweet.fields': 'possibly_sensitive,created_at,lang,public_metrics,author_id'
        }
      })
      .then((result) => {
        return result.data.data
          .filter((tweet) => !tweet.possibly_sensitive && tweet.lang === 'es')
          .map((tweet) => this.mapObjectToRawNeed(tweet, LOCALITIES[localityKey]));
      })
      .catch((error: AxiosError) => {
        throw new TwitterAPIError(error.message);
      });
  }

  private mapObjectToRawNeed(tweet: Tweet, locality: string): RawNeed {
    return new RawNeed(
      new Date(),
      locality,
      tweet.text,
      {
        id: tweet.id,
        name: 'twitter',
        link: `https://twitter.com/${tweet.author_id}/status/${tweet.id}`,
        creationDate: tweet.created_at
      },
      tweet.public_metrics
    );
  }
}

import { LOCALITIES, LocalityKey } from '../../../domain/localities';
import { TwitterSearchObject } from '../model/TwitterSearchObject';
import { CornellaTweets } from './CornellaTweets.data';
import { Tweet } from '../model/Tweet';
import { RawNeed } from '../../../domain/RawNeed';
import { MalasanaTweets } from './MalasanaTweets.data';
import { VallecasTweets } from './VallecasTweets.data';

export class TweetMockService {
  private _mockTweets: Map<LocalityKey, TwitterSearchObject> = new Map();
  constructor() {
    this._mockTweets.set('CORNELLA_DE_LLOBREGAT', CornellaTweets);
    this._mockTweets.set('MALASANA', MalasanaTweets);
    this._mockTweets.set('VALLECAS', VallecasTweets);
  }

  public getSearch(localityKey: LocalityKey): Promise<RawNeed[]> {
    console.log(`Searching in Twitter Mock API with query: ${LOCALITIES[localityKey]}`);
    const rawNeeds = this._mockTweets
      .get(localityKey)
      .data.filter((tweet) => !tweet.possibly_sensitive && tweet.lang === 'es')
      .map((tweet) => this.mapObjectToRawNeed(tweet, LOCALITIES[localityKey]));
    return Promise.resolve(rawNeeds);
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

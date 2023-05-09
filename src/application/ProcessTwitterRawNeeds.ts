import { RawNeed } from '../domain/RawNeed';
import { LocalityKey } from '../domain/localities';
import { DynamoDBRawNeedsRepository } from '../infrastructure/dynamodb/DynamoDBRawNeedsRepository';
import { KinesisOrchestator } from '../infrastructure/kinesis/KinesisOrchestator';
import { TweetMockService } from '../infrastructure/twitter/mock/TweetMockService';

export class ProcessTwitterRawNeed {
  private _twitterService: TweetMockService;
  private _rawNeedsRepository: DynamoDBRawNeedsRepository;
  private _kinesisOrchestator: KinesisOrchestator;
  /* Until production twitter service        
        private _twitterService: TwitterAPIService;
    */
  constructor() {
    this._twitterService = new TweetMockService();
    this._rawNeedsRepository = new DynamoDBRawNeedsRepository();
    this._kinesisOrchestator = new KinesisOrchestator();
  }

  public async execute(localities: LocalityKey[]): Promise<void> {
    console.log('Retrieving a list of raw needs from Twitter');
    const rawNeedsListByLocality: RawNeed[][] = await Promise.all(
      localities.map((localityKey) => this._twitterService.getSearch(localityKey))
    );

    await Promise.all(
      rawNeedsListByLocality.map(async (rawNeedsList) => {
        console.log(`Saving batch of ${rawNeedsList.length} raw needs in Raw Repository`);
        await Promise.all(rawNeedsList.map(async (rawNeed) => this._rawNeedsRepository.addRawNeed(rawNeed)));
        console.log(`Sending batch to Orchestator`);
        const res = await this._kinesisOrchestator.orchestrateNeeds(rawNeedsList);
        console.log(`Sent data to Kinesis to shard ${res.Records[0].ShardId}`);
      })
    );
  }
}

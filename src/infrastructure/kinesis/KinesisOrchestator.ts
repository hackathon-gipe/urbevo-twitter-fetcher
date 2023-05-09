import { KinesisClient, PutRecordsCommand, PutRecordsCommandOutput } from '@aws-sdk/client-kinesis'; // ES Modules import
import { RawNeed } from '../../domain/RawNeed';

export class KinesisOrchestator {
  private _client: KinesisClient;
  private _streamARN = process.env.KINESIS_STREAM_ARN;
  private _streamName = process.env.KINESIS_STREAM_NAME;

  constructor() {
    this._client = new KinesisClient({
      region: 'eu-south-2'
    });
  }

  public orchestrateNeeds(rawNeeds: RawNeed[]): Promise<PutRecordsCommandOutput> {
    return this._client.send(
      new PutRecordsCommand({
        StreamName: this._streamName,
        Records: rawNeeds.map((rawNeed) => {
          return {
            Data: Buffer.from(JSON.stringify(rawNeed)),
            PartitionKey: rawNeed.needId
          };
        })
      })
    );
  }
}

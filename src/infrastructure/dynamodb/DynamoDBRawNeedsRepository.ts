import { RawNeed } from '../../domain/RawNeed';
import { DynamoDBManager } from './DynamoDBManager';
import { DynamoDBRawNeed } from './DynamoDBRawNeed.model';
import { marshall } from '@aws-sdk/util-dynamodb';
import { GetItemCommand, GetItemCommandOutput, PutItemCommand, PutItemCommandOutput } from '@aws-sdk/client-dynamodb';

export class DynamoDBRawNeedsRepository {
  private _dynamoManager: DynamoDBManager;
  private tableName = process.env.DYNAMODB_RAWNEEDS_TABLE;
  constructor() {
    this._dynamoManager = new DynamoDBManager();
  }

  public addRawNeed(rawNeed: RawNeed): Promise<PutItemCommandOutput> {
    // TODO: Batch write item
    return this._dynamoManager.executePutItemCommand(
      new PutItemCommand({
        TableName: this.tableName,
        Item: marshall(this.mapRawNeedToDynamoItem(rawNeed))
      })
    );
  }

  public getRawNeed(needId: string): Promise<GetItemCommandOutput> {
    return this._dynamoManager.executeGetItemCommand(
      new GetItemCommand({
        TableName: this.tableName,
        Key: {
          need_id: {
            S: needId
          }
        }
      })
    );
  }

  private mapRawNeedToDynamoItem(rawNeed: RawNeed): DynamoDBRawNeed {
    return {
      need_id: rawNeed.needId,
      extraction_date: rawNeed.extractionDate.toISOString(),
      locality_name: rawNeed.localityName,
      raw_text: rawNeed.rawText,
      relevance_data: rawNeed.relevanceData,
      source: rawNeed.source.name,
      source_link: rawNeed.source.link,
      source_id: rawNeed.source.id,
      source_creation_date: rawNeed.source.creationDate
    } as DynamoDBRawNeed;
  }
}

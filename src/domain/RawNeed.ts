import { v4 as uuidV4 } from 'uuid';

export class RawNeed {
  public needId: string;

  constructor(
    public readonly extractionDate: Date,
    public readonly localityName: string,
    public readonly rawText: string,
    public readonly source: {
      id: string;
      name: string;
      link: string;
      creationDate: string;
    },
    public readonly relevanceData: object
  ) {
    this.needId = uuidV4();
  }
}

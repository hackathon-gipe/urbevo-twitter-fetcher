export type DynamoDBRawNeed = {
  need_id: string;
  extraction_date: string;
  locality_name: string;
  raw_text: string;
  relevance_data: object;
  source: string;
  source_link: string;
  source_id: string;
  source_creation_date: string;
};

import { ProcessTwitterRawNeed } from '../application/ProcessTwitterRawNeeds';
import { LOCALITIES, LocalityKey } from '../domain/localities';

const processTwitterRawNeed = new ProcessTwitterRawNeed();

export const handler = async (event) => {
  try {
    await processTwitterRawNeed.execute(Object.keys(LOCALITIES) as Array<LocalityKey>);
  } catch (error) {
    console.log('There was an error in the application: ' + error?.message);
  }
};

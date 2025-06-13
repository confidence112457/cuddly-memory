import { Document } from 'mongoose';

// Utility type to extract MongoDB document with proper _id typing
export type MongoDocument<T> = T & Document & { _id: any };

// Helper function to convert MongoDB document to API response
export function toApiResponse<T extends Document>(doc: T): any {
  const obj = doc.toObject();
  return {
    ...obj,
    id: obj._id.toString(),
    _id: undefined,
  };
}

// Helper function to convert MongoDB documents array to API response
export function toApiResponseArray<T extends Document>(docs: T[]): any[] {
  return docs.map(doc => toApiResponse(doc));
}
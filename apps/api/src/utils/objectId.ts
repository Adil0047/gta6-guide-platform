import { isValidObjectId, Types } from 'mongoose';

type DocumentIdLike = {
  _id?: unknown;
  id?: unknown;
};

// function isRawObjectId(value: unknown) {
//   return (
//     value instanceof Types.ObjectId ||
//     (Boolean(value) &&
//       typeof value === 'object' &&
//       !('_id' in value) &&
//       typeof (value as { toHexString?: unknown }).toHexString === 'function')
//   );
// }

function isRawObjectId(value: unknown) {
  if (!value || typeof value !== 'object') {
    return false;
  }

  return (
    value instanceof Types.ObjectId ||
    (!('_id' in value) && typeof (value as { toHexString?: unknown }).toHexString === 'function')
  );
}

export function toObjectId(value: unknown): Types.ObjectId | null {
  if (value instanceof Types.ObjectId) {
    return value;
  }

  if (typeof value === 'string' && isValidObjectId(value)) {
    return new Types.ObjectId(value);
  }

  if (value && typeof value === 'object') {
    const maybeObjectId = value as { toHexString?: unknown };

    if (typeof maybeObjectId.toHexString === 'function') {
      const hexString = maybeObjectId.toHexString();

      if (typeof hexString === 'string' && isValidObjectId(hexString)) {
        return new Types.ObjectId(hexString);
      }
    }

    const document = value as DocumentIdLike;

    if (document._id) {
      return toObjectId(document._id);
    }

    if (typeof document.id === 'string') {
      return toObjectId(document.id);
    }
  }

  return null;
}

export function toObjectIdHexString(value: unknown) {
  return toObjectId(value)?.toHexString() ?? '';
}

export function getDocumentId(document: DocumentIdLike) {
  if (typeof document.id === 'string') {
    return document.id;
  }

  const objectId = toObjectId(document._id);

  if (objectId) {
    return objectId.toHexString();
  }

  return typeof document._id === 'string' ? document._id : '';
}

export function uniqueObjectIds(values: unknown[]) {
  const seen = new Set<string>();
  const ids: Types.ObjectId[] = [];

  values.forEach((value) => {
    const objectId = toObjectId(value);

    if (!objectId) {
      return;
    }

    const key = objectId.toHexString();

    if (!seen.has(key)) {
      seen.add(key);
      ids.push(objectId);
    }
  });

  return ids;
}

export function serializeObjectIdOrDocument(value: unknown) {
  const objectId = toObjectId(value);

  if (objectId && (typeof value === 'string' || isRawObjectId(value))) {
    return objectId.toHexString();
  }

  return value;
}

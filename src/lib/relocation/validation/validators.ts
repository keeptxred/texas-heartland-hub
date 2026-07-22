export const isNonEmptyString=(value:unknown):value is string=>typeof value==="string"&&value.trim().length>0;
export const isFiniteNumber=(value:unknown):value is number=>typeof value==="number"&&Number.isFinite(value);
export const isCoordinate=(latitude:unknown,longitude:unknown)=>isFiniteNumber(latitude)&&isFiniteNumber(longitude)&&latitude>=-90&&latitude<=90&&longitude>=-180&&longitude<=180;

import type {
  ElectionEntityId,
  ElectionRace as ElectionRaceContract,
} from "../../../types/elections";

declare global {
  type ElectionRace = ElectionRaceContract & {
    counties?: readonly {
      id: ElectionEntityId;
      name: string;
      slug: string;
    }[];
    zipCodes?: readonly string[];
  };
}

export {};

import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  useQuery: vi.fn(),
  list: vi.fn(),
  findDetailById: vi.fn(),
  findDetailBySlug: vi.fn(),
}));

vi.mock("@tanstack/react-query", async (original) => {
  const actual = await original<typeof import("@tanstack/react-query")>();
  return { ...actual, useQuery: mocks.useQuery };
});

vi.mock("@/lib/elections/repositories", () => ({
  useElectionRepositories: () => ({
    races: {
      list: mocks.list,
      findDetailById: mocks.findDetailById,
      findDetailBySlug: mocks.findDetailBySlug,
    },
  }),
}));

import { useElectionRace } from "./useElectionRace";
import { useElectionRaces } from "./useElectionRaces";

const emptyPage = {
  items: [],
  page: 1,
  pageSize: 0,
  totalItems: 0,
  totalPages: 0,
  hasNextPage: false,
  hasPreviousPage: false,
};

describe("election query hooks", () => {
  beforeEach(() => vi.clearAllMocks());

  it("exposes loading state", () => {
    mocks.useQuery.mockReturnValue({ isLoading: true, isSuccess: false });
    expect(useElectionRaces()).toMatchObject({ isLoading: true, isEmpty: false });
  });

  it("exposes successful non-empty data", () => {
    mocks.useQuery.mockReturnValue({
      isLoading: false,
      isSuccess: true,
      data: { ...emptyPage, items: [{ id: "race-1" }] },
    });
    expect(useElectionRaces()).toMatchObject({ isSuccess: true, isEmpty: false });
  });

  it("identifies successful empty data", () => {
    mocks.useQuery.mockReturnValue({
      isLoading: false,
      isSuccess: true,
      data: emptyPage,
    });
    expect(useElectionRaces()).toMatchObject({ isSuccess: true, isEmpty: true });
  });

  it("preserves repository errors", () => {
    const error = new Error("repository unavailable");
    mocks.useQuery.mockReturnValue({ isLoading: false, isSuccess: false, error });
    expect(useElectionRaces().error).toBe(error);
  });

  it("disables detail queries without an identifier", () => {
    mocks.useQuery.mockReturnValue({ isSuccess: false, data: undefined });
    useElectionRace();
    const options = mocks.useQuery.mock.calls[0]?.[0];
    expect(options.queryKey).toContain("disabled");
    expect(typeof options.queryFn).not.toBe("function");
  });
});

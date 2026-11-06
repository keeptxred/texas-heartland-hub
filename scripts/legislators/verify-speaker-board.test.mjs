import { describe, expect, it } from "vitest";
import {
  verifiedSpeakerAssignment, SPEAKER_SOURCE, SPEAKER_LBB_SOURCE,
} from "./verify-speaker-board.mjs";

describe("Speaker alternative official source when committee API returns an error", () => {
  const official = '<html><body><h1>Speaker of the House</h1><p>Dustin Burrows</p><p>89th Legislature</p></body></html>';

  it("accepts only the documented 89th Speaker and board role", () => {
    expect(verifiedSpeakerAssignment("3055", "Dustin Burrows", official)).toEqual([
      { committeeName: "Legislative Budget Board", position: "Joint Chair" },
    ]);
    expect(SPEAKER_SOURCE).toBe("https://house.texas.gov/speaker");
    expect(SPEAKER_LBB_SOURCE).toBe("https://www.lbb.texas.gov/Current_Board_Members.aspx");
  });

  it("does not interfere with ordinary members or mask their committee API failures", () => {
    expect(verifiedSpeakerAssignment("2345", "Giovanni Capriglione", official)).toBeNull();
    expect(verifiedSpeakerAssignment("4643", "David Lowe", official)).toBeNull();
  });

  it("fails closed when a verified House source identifies a different Speaker", () => {
    const successor = '<h1>Speaker of the House</h1><p>Another Member</p>';
    expect(() => verifiedSpeakerAssignment("3055", "Dustin Burrows", successor)).toThrow(/does not confirm/);
  });

  it("fails closed when the previously matched member code now resolves to someone else", () => {
    expect(() => verifiedSpeakerAssignment("3055", "Another Member", official)).toThrow(/identity changed/);
  });

  it("rejects a generic biography or a fabricated speaker claim hidden in script content", () => {
    expect(() => verifiedSpeakerAssignment("3055", "Dustin Burrows",
      '<script>Speaker of the House Dustin Burrows</script><p>Rep. Dustin Burrows</p>'
    )).toThrow(/does not confirm/);
  });
});

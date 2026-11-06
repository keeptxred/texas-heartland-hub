/**
 * The Speaker is not routinely in the ordinary House standing-committee API
 * member set. A 200-OK API response with {error:true} must not be converted to
 * an invented empty committee list. Verify the special constitutional office
 * against the current official House Speaker page before retaining the
 * independently documented joint-chair role on the Legislative Budget Board.
 *
 * Official sources:
 * https://house.texas.gov/speaker
 * https://www.lbb.texas.gov/Current_Board_Members.aspx
 */
export const SPEAKER_SOURCE = "https://house.texas.gov/speaker";
export const SPEAKER_LBB_SOURCE = "https://www.lbb.texas.gov/Current_Board_Members.aspx";

export function verifiedSpeakerAssignment(memberCode, memberName, html) {
  if (String(memberCode) !== "3055") return null;
  if (memberName?.trim() !== "Dustin Burrows") {
    throw new Error("Speaker fallback rejected: House roster member identity changed");
  }
  const visible = String(html ?? "")
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (!/Speaker of the House/i.test(visible) ||
      !/Speaker(?: of the House)?[\s\S]{0,600}Dustin Burrows/i.test(visible)) {
    throw new Error("Speaker fallback rejected: current official House page does not confirm Dustin Burrows as Speaker");
  }
  return [{ committeeName: "Legislative Budget Board", position: "Joint Chair" }];
}

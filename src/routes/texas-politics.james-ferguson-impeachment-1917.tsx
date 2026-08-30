import { createFileRoute } from "@tanstack/react-router";
import { PoliticalHistoryAuthorityPage, politicalHistoryAuthorityHead } from "@/components/political-history-authority-page";
import { JAMES_FERGUSON_IMPEACHMENT_1917 } from "@/data/texas-post-reconstruction-progressive-authority";

export const Route = createFileRoute("/texas-politics/james-ferguson-impeachment-1917")({ head: () => politicalHistoryAuthorityHead(JAMES_FERGUSON_IMPEACHMENT_1917), component: Page });
function Page() { return <PoliticalHistoryAuthorityPage page={JAMES_FERGUSON_IMPEACHMENT_1917} />; }

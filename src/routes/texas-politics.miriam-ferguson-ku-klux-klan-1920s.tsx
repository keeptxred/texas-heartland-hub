import { createFileRoute } from "@tanstack/react-router";
import { PoliticalHistoryAuthorityPage, politicalHistoryAuthorityHead } from "@/components/political-history-authority-page";
import { MIRIAM_FERGUSON_KLAN_1920S } from "@/data/texas-post-reconstruction-progressive-authority";

export const Route = createFileRoute("/texas-politics/miriam-ferguson-ku-klux-klan-1920s")({ head: () => politicalHistoryAuthorityHead(MIRIAM_FERGUSON_KLAN_1920S), component: Page });
function Page() { return <PoliticalHistoryAuthorityPage page={MIRIAM_FERGUSON_KLAN_1920S} />; }

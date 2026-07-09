import { createFileRoute } from "@tanstack/react-router";
import FindMyDMV from "@/components/FindMyDMV";

export const Route = createFileRoute("/find-my-dmv")({
  component: FindMyDMV,
});

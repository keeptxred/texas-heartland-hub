import { createFileRoute } from "@tanstack/react-router";
import FindMySchoolDistrict from "@/components/FindMySchoolDistrict";

export const Route = createFileRoute("/find-my-school-district")({
  component: FindMySchoolDistrict,
});

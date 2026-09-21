import { createFileRoute } from "@tanstack/react-router";

/** Retired KTR vehicle route. The parent /vehicles route permanently hands off to TexasDefined. */
export const Route = createFileRoute("/vehicles/plates")({});

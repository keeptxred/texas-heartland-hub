export type MovingPreferences = {
  moveDate: string;
  hasVehicle: boolean;
  buyingHome: boolean;
  hasChildren: boolean;
  hasPets: boolean;
};

export type MovingTask = {
  id: string;
  title: string;
  description: string;
  phase: "Plan" | "Before the move" | "First 30 days" | "First 90 days";
  offsetDays: number;
  href?: string;
  linkLabel?: string;
  condition?: keyof Omit<MovingPreferences, "moveDate">;
};

export type ScheduledMovingTask = MovingTask & {
  dueDate: string | null;
  dueLabel: string;
};

export const DEFAULT_MOVING_PREFERENCES: MovingPreferences = {
  moveDate: "",
  hasVehicle: true,
  buyingHome: false,
  hasChildren: false,
  hasPets: false,
};

export const MOVING_TASKS: MovingTask[] = [
  {
    id: "compare-cities",
    title: "Compare Texas destinations",
    description:
      "Review housing, commute patterns, schools, taxes, and local services before choosing a community.",
    phase: "Plan",
    offsetDays: -90,
    href: "/moving-to-texas",
    linkLabel: "Open city guides",
  },
  {
    id: "moving-budget",
    title: "Build a realistic moving budget",
    description:
      "Estimate transportation, deposits, temporary housing, travel, and first-month setup costs.",
    phase: "Plan",
    offsetDays: -75,
    href: "/texas-moving-cost-calculator",
    linkLabel: "Estimate moving costs",
  },
  {
    id: "housing-plan",
    title: "Confirm housing and closing needs",
    description:
      "Compare the full monthly cost and reserve cash for inspection, appraisal, closing, and utilities.",
    phase: "Plan",
    offsetDays: -60,
    href: "/texas-home-affordability-calculator",
    linkLabel: "Check affordability",
    condition: "buyingHome",
  },
  {
    id: "school-district",
    title: "Confirm the school district for the address",
    description:
      "District boundaries do not always follow city or ZIP-code lines. Verify the actual address before signing.",
    phase: "Plan",
    offsetDays: -45,
    href: "/find-my-school-district",
    linkLabel: "Find the district",
    condition: "hasChildren",
  },
  {
    id: "book-move",
    title: "Book movers or reserve equipment",
    description:
      "Confirm dates, insurance, access restrictions, parking, and cancellation terms in writing.",
    phase: "Before the move",
    offsetDays: -30,
  },
  {
    id: "vehicle-insurance",
    title: "Arrange Texas auto insurance",
    description:
      "Texas generally requires 30/60/25 liability coverage. Keep proof ready for title and registration.",
    phase: "Before the move",
    offsetDays: -14,
    href: "/find-my-dmv",
    linkLabel: "Review vehicle requirements",
    condition: "hasVehicle",
  },
  {
    id: "pet-records",
    title: "Collect pet records and prescriptions",
    description:
      "Bring vaccination records, microchip information, medications, and enough food for the transition.",
    phase: "Before the move",
    offsetDays: -14,
    condition: "hasPets",
  },
  {
    id: "utilities",
    title: "Schedule utilities and internet",
    description:
      "Arrange power, water, gas, trash, and internet so essential service starts by move-in day.",
    phase: "Before the move",
    offsetDays: -10,
    href: "/texas-utility-cost-calculator",
    linkLabel: "Estimate utility costs",
  },
  {
    id: "address",
    title: "Update your mailing address",
    description:
      "Forward mail and update employers, banks, insurers, subscriptions, and important records.",
    phase: "Before the move",
    offsetDays: -7,
    href: "https://moversguide.usps.com/",
    linkLabel: "USPS change of address",
  },
  {
    id: "vehicle-registration",
    title: "Title and register each vehicle",
    description:
      "New residents generally have 30 days to complete this through the county tax assessor-collector.",
    phase: "First 30 days",
    offsetDays: 30,
    href: "/find-my-dmv",
    linkLabel: "Estimate fees and find an office",
    condition: "hasVehicle",
  },
  {
    id: "voter-registration",
    title: "Register to vote at your Texas address",
    description:
      "Texas voter registration is generally due 30 days before an election. Submit or update your application early.",
    phase: "First 30 days",
    offsetDays: 21,
    href: "/register-to-vote",
    linkLabel: "Open voter guide",
  },
  {
    id: "homestead",
    title: "Apply for the residence homestead exemption",
    description:
      "Qualifying homeowners file with the county appraisal district. The general filing deadline is before May 1.",
    phase: "First 30 days",
    offsetDays: 21,
    href: "/tax-calculator",
    linkLabel: "Check eligibility and filing steps",
    condition: "buyingHome",
  },
  {
    id: "driver-license",
    title: "Get a Texas driver license or ID",
    description: "New residents who drive generally have 90 days. DPS appointments can fill early.",
    phase: "First 90 days",
    offsetDays: 90,
    href: "/find-my-dmv",
    linkLabel: "Open DPS guidance",
  },
];

function dateFromInput(value: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const date = new Date(`${value}T12:00:00`);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function formatMovingDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export function buildMovingTasks(preferences: MovingPreferences): ScheduledMovingTask[] {
  const moveDate = dateFromInput(preferences.moveDate);
  return MOVING_TASKS.filter((task) => !task.condition || preferences[task.condition]).map(
    (task) => {
      if (!moveDate) {
        return {
          ...task,
          dueDate: null,
          dueLabel:
            task.offsetDays < 0
              ? `${Math.abs(task.offsetDays)} days before moving`
              : `${task.offsetDays} days after moving`,
        };
      }
      const due = new Date(moveDate);
      due.setDate(due.getDate() + task.offsetDays);
      return {
        ...task,
        dueDate: due.toISOString().slice(0, 10),
        dueLabel: formatMovingDate(due),
      };
    },
  );
}

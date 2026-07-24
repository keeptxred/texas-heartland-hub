import { useMemo, useState } from "react";
import { COUNTY_OFFICES } from "@/components/FindMyDMV";
import {
  EMISSIONS_COUNTIES,
  estimateVehicleRegistration,
  type VehicleKind,
} from "@/lib/vehicle-registration";

const TXDMV_FULL_DIRECTORY = "https://www.txdmv.gov/tax-assessor-collectors/county-tax-offices";
const DPS_OFFICE_LOCATOR = "https://www.dps.texas.gov/section/driver-license";
const DPS_NEW_RESIDENT_GUIDE =
  "https://www.dps.texas.gov/section/driver-license/moving-texas-guide-driver-licenses-and-ids";
const TXDMV_NEW_RESIDENT_GUIDE = "https://www.txdmv.gov/motorists/new-to-texas";
const TXDMV_REGISTER_GUIDE = "https://www.txdmv.gov/motorists/register-your-vehicle";
const FORM_130_U = "https://www.txdmv.gov/sites/default/files/form_files/Form-130-U.pdf";
const NEW_RESIDENT_TAX_GUIDE =
  "https://comptroller.texas.gov/taxes/publications/96-254/new-resident-tax.php";

export function VehicleRegistrationGuide() {
  const [selectedCounty, setSelectedCounty] = useState("");
  const [vehicleKind, setVehicleKind] = useState<VehicleKind>("passenger");
  const [titleFee, setTitleFee] = useState<28 | 33>(28);
  const [countyLocalFee, setCountyLocalFee] = useState(10);
  const [qualifiesForNewResidentTax, setQualifiesForNewResidentTax] = useState(true);
  const [electricVehicle, setElectricVehicle] = useState(false);

  const sortedCounties = useMemo(
    () => [...COUNTY_OFFICES].sort((a, b) => a.county.localeCompare(b.county)),
    [],
  );
  const office = COUNTY_OFFICES.find((item) => item.county === selectedCounty);
  const emissionsCounty = selectedCounty ? EMISSIONS_COUNTIES.has(selectedCounty) : false;
  const estimate = useMemo(
    () =>
      estimateVehicleRegistration({
        vehicleKind,
        titleFee,
        countyLocalFee,
        qualifiesForNewResidentTax,
        electricVehicle,
        emissionsCounty,
      }),
    [
      countyLocalFee,
      electricVehicle,
      emissionsCounty,
      qualifiesForNewResidentTax,
      titleFee,
      vehicleKind,
    ],
  );

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
      <header className="max-w-4xl">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
          New Texas resident vehicle guide
        </p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
          Register your vehicle and find the right Texas office
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
          Texas handles vehicle title and registration through county tax offices, while driver
          licenses are issued by the Department of Public Safety. Use the estimator and county
          finder below to plan both visits.
        </p>
      </header>

      <section className="mt-8 grid gap-4 sm:grid-cols-2">
        <DeadlineCard
          eyebrow="Vehicle deadline"
          deadline="Within 30 days"
          description="A new resident generally must title and register a vehicle through the county tax assessor-collector within 30 days of establishing Texas residency."
          urgent
        />
        <DeadlineCard
          eyebrow="Driver-license deadline"
          deadline="Within 90 days"
          description="Apply separately for a Texas driver license at DPS. Appointment availability can run several weeks out, so reserve a time early."
        />
      </section>

      <section className="mt-14">
        <div className="max-w-3xl">
          <h2 className="text-3xl font-bold">Estimated first-year registration cost</h2>
          <p className="mt-3 text-muted-foreground">
            This planning estimate uses statewide fees and the county amount you enter. It is not a
            quote; your county office determines the final amount.
          </p>
        </div>
        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_0.9fr]">
          <div className="rounded-xl border bg-card p-5 sm:p-6">
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="text-sm font-semibold">
                Vehicle type
                <select
                  value={vehicleKind}
                  onChange={(event) => setVehicleKind(event.target.value as VehicleKind)}
                  className="mt-2 w-full rounded-md border bg-background px-3 py-2 font-normal"
                >
                  <option value="passenger">Passenger car or light truck</option>
                  <option value="heavy-pickup">Pickup 6,001–10,000 lbs.</option>
                  <option value="motorcycle">Motorcycle or moped</option>
                  <option value="trailer">Trailer</option>
                </select>
              </label>
              <label className="text-sm font-semibold">
                County title fee
                <select
                  value={titleFee}
                  onChange={(event) => setTitleFee(Number(event.target.value) as 28 | 33)}
                  className="mt-2 w-full rounded-md border bg-background px-3 py-2 font-normal"
                >
                  <option value={28}>$28 county</option>
                  <option value={33}>$33 county</option>
                </select>
              </label>
              <label className="text-sm font-semibold">
                County local fee
                <span className="mt-2 flex items-center rounded-md border bg-background">
                  <span className="pl-3 text-muted-foreground">$</span>
                  <input
                    type="number"
                    min={0}
                    max={31.5}
                    step={0.25}
                    value={countyLocalFee}
                    onChange={(event) => setCountyLocalFee(Number(event.target.value))}
                    className="w-full bg-transparent px-2 py-2 font-normal outline-none"
                  />
                </span>
                <span className="mt-1 block text-xs font-normal text-muted-foreground">
                  Confirm the current amount with your county; the statewide maximum is $31.50.
                </span>
              </label>
              <label className="text-sm font-semibold">
                County
                <CountySelect
                  value={selectedCounty}
                  counties={sortedCounties.map((item) => item.county)}
                  onChange={setSelectedCounty}
                  placeholder="Select to check emissions rules"
                />
              </label>
            </div>
            <div className="mt-5 grid gap-3">
              <CheckOption
                checked={qualifiesForNewResidentTax}
                onChange={setQualifiesForNewResidentTax}
                title="Vehicle was already registered in my name"
                description="Check this for the $90 new-resident tax. Otherwise, Texas motor-vehicle use tax may apply."
              />
              <CheckOption
                checked={electricVehicle}
                onChange={setElectricVehicle}
                title="This is an electric vehicle"
                description="Adds the annual $200 electric-vehicle registration fee."
              />
            </div>
            {selectedCounty && (
              <p className="mt-4 rounded-md bg-muted p-3 text-sm">
                {emissionsCounty
                  ? `${selectedCounty} County is in the emissions-testing program. The estimate includes the state fee, but testing-station and local charges can vary.`
                  : `${selectedCounty} County is not currently one of Texas's 17 emissions-testing counties.`}
              </p>
            )}
          </div>

          <div className="rounded-xl bg-foreground p-5 text-background sm:p-6">
            <p className="text-xs font-bold uppercase tracking-widest text-background/70">
              Planning estimate
            </p>
            <p className="mt-2 text-4xl font-bold">${estimate.total.toFixed(2)}</p>
            <div className="mt-5 space-y-3 border-t border-background/20 pt-5">
              {estimate.lineItems
                .filter((item) => item.amount > 0)
                .map((item) => (
                  <div key={item.label}>
                    <div className="flex justify-between gap-3 text-sm">
                      <span>{item.label}</span>
                      <span className="font-semibold">${item.amount.toFixed(2)}</span>
                    </div>
                    {item.note && (
                      <p className="mt-1 text-xs leading-relaxed text-background/65">{item.note}</p>
                    )}
                  </div>
                ))}
            </div>
            {estimate.excludesUseTax && (
              <p className="mt-5 rounded-md bg-background/10 p-3 text-xs leading-relaxed">
                This total does not include the possible 6.25% motor-vehicle use tax. Review the
                Comptroller guidance before relying on the estimate.
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="mt-14 grid gap-8 lg:grid-cols-2">
        <div>
          <h2 className="text-2xl font-bold">What to bring to the county office</h2>
          <ol className="mt-5 space-y-4 text-sm leading-relaxed text-muted-foreground">
            <RequiredItem number="1" title="Ownership document.">
              Bring the out-of-state title, or current foreign registration receipt if the
              lienholder holds the title.
            </RequiredItem>
            <RequiredItem number="2" title="Form 130-U.">
              Complete the Application for Texas Title and/or Registration.
            </RequiredItem>
            <RequiredItem number="3" title="Texas insurance.">
              Texas requires minimum liability coverage of 30/60/25. The office may verify coverage
              electronically.
            </RequiredItem>
            <RequiredItem number="4" title="Identification and payment.">
              Bring government-issued photo ID and confirm accepted payment methods with the county.
            </RequiredItem>
            <RequiredItem number="5" title="Emissions test, when required.">
              Most noncommercial safety inspections ended in 2025, but vehicles in 17 counties still
              need emissions testing. Commercial vehicles still require safety inspection.
            </RequiredItem>
          </ol>
          <div className="mt-6 flex flex-wrap gap-3">
            <OfficialLink href={FORM_130_U} primary>
              Open Form 130-U
            </OfficialLink>
            <OfficialLink href={TXDMV_NEW_RESIDENT_GUIDE}>Official new-resident guide</OfficialLink>
            <OfficialLink href={TXDMV_REGISTER_GUIDE}>TxDMV registration rules</OfficialLink>
          </div>
        </div>

        <div className="rounded-xl border bg-card p-5 sm:p-6">
          <h2 className="text-2xl font-bold">Find your county tax office</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Registration is handled by the county where you live, not a statewide DMV counter.
          </p>
          <label className="mt-5 block text-sm font-semibold">
            Your county
            <CountySelect
              value={selectedCounty}
              counties={sortedCounties.map((item) => item.county)}
              onChange={setSelectedCounty}
              placeholder="Select your county"
            />
          </label>
          {office ? (
            <div className="mt-5 rounded-md bg-muted p-4">
              <p className="text-lg font-bold">{office.officeName}</p>
              <p className="mt-2 text-sm">{office.contact}</p>
              <p className="text-sm">{office.address}</p>
              <p className="text-sm">{office.phone}</p>
              {office.website && (
                <a
                  href={office.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-block font-semibold text-primary hover:underline"
                >
                  Visit county office website →
                </a>
              )}
            </div>
          ) : (
            <a
              href={TXDMV_FULL_DIRECTORY}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-block font-semibold text-primary hover:underline"
            >
              Search the full TxDMV county directory →
            </a>
          )}
        </div>
      </section>

      <section className="mt-14 rounded-xl border bg-muted/40 p-6">
        <h2 className="text-2xl font-bold">Then get your Texas driver license</h2>
        <p className="mt-3 max-w-3xl text-muted-foreground">
          DPS is a separate agency from your county tax office. Review the new-resident identity,
          residency, Social Security, and vehicle-registration requirements before your appointment.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <OfficialLink href={DPS_OFFICE_LOCATOR} dark>
            Find a DPS office
          </OfficialLink>
          <OfficialLink href={DPS_NEW_RESIDENT_GUIDE}>DPS moving-to-Texas guide</OfficialLink>
          <OfficialLink href={NEW_RESIDENT_TAX_GUIDE}>New-resident tax guidance</OfficialLink>
        </div>
      </section>

      <p className="mt-8 text-xs leading-relaxed text-muted-foreground">
        Planning information only; fees, office contacts, eligibility, and inspection requirements
        can change. Verify the final amount and documents with your county tax office and official
        TxDMV and DPS guidance. Office directory last reviewed July 23, 2026.
      </p>
    </main>
  );
}

function DeadlineCard({
  eyebrow,
  deadline,
  description,
  urgent = false,
}: {
  eyebrow: string;
  deadline: string;
  description: string;
  urgent?: boolean;
}) {
  return (
    <div
      className={
        urgent
          ? "rounded-xl border border-amber-300 bg-amber-50 p-5 text-amber-950"
          : "rounded-xl border bg-card p-5"
      }
    >
      <p className="text-xs font-bold uppercase tracking-widest">{eyebrow}</p>
      <p className="mt-1 text-2xl font-bold">{deadline}</p>
      <p className="mt-2 text-sm leading-relaxed opacity-80">{description}</p>
    </div>
  );
}

function CheckOption({
  checked,
  onChange,
  title,
  description,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  title: string;
  description: string;
}) {
  return (
    <label className="flex items-start gap-3 rounded-lg border p-4 text-sm">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="mt-1"
      />
      <span>
        <strong className="block">{title}</strong>
        {description}
      </span>
    </label>
  );
}

function CountySelect({
  value,
  counties,
  onChange,
  placeholder,
}: {
  value: string;
  counties: string[];
  onChange: (county: string) => void;
  placeholder: string;
}) {
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="mt-2 w-full rounded-md border bg-background px-3 py-2 font-normal"
    >
      <option value="">{placeholder}</option>
      {counties.map((county) => (
        <option key={county} value={county}>
          {county} County
        </option>
      ))}
    </select>
  );
}

function RequiredItem({
  number,
  title,
  children,
}: {
  number: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <li>
      <strong className="text-foreground">
        {number}. {title}
      </strong>{" "}
      {children}
    </li>
  );
}

function OfficialLink({
  href,
  children,
  primary = false,
  dark = false,
}: {
  href: string;
  children: React.ReactNode;
  primary?: boolean;
  dark?: boolean;
}) {
  const className = primary
    ? "rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
    : dark
      ? "rounded-md bg-foreground px-4 py-2 text-sm font-semibold text-background"
      : "rounded-md border bg-background px-4 py-2 text-sm font-semibold";
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      {children}
    </a>
  );
}

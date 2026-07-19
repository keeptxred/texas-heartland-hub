import type { MediaPackage } from "./types";

export function ReelBlueprintPreview({ pkg }: { pkg: MediaPackage }) {
  return (
    <div className="border border-border bg-white p-4 space-y-3 text-sm">
      <Block label="Hook (first 3 seconds)" body={pkg.reel.hook} />
      <Block
        label="Main Story (30 second talking points)"
        body={pkg.reel.mainStory.map((p, i) => `${i + 1}. ${p}`).join("\n")}
      />
      <Block label="Closing (call to action)" body={pkg.reel.closing} />
      <Block label="Caption" body={pkg.reel.caption} />
      <Block label="Hashtags" body={pkg.reel.hashtags} />
    </div>
  );
}

function Block({ label, body }: { label: string; body: string }) {
  return (
    <div>
      <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">
        {label}
      </div>
      <pre className="whitespace-pre-wrap font-sans text-sm">{body || "—"}</pre>
    </div>
  );
}
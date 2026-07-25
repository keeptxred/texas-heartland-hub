import type { ImportSourceConfig, ImportSourceType } from "@/types/explore/import";
import { BaseImporter } from "./BaseImporter";
import { HistoricalCommissionImporter } from "./HistoricalCommissionImporter";
import { NOAAImporter } from "./NOAAImporter";
import { NPSImporter } from "./NPSImporter";
import { OSMImporter } from "./OSMImporter";
import { TPWDImporter } from "./TPWDImporter";
import { TWDBImporter } from "./TWDBImporter";
import { USACEImporter } from "./USACEImporter";
import { USFSImporter } from "./USFSImporter";
import { USGSImporter } from "./USGSImporter";

export type ImporterFactory = (config: ImportSourceConfig) => BaseImporter;

export class ConnectorRegistry {
  private readonly factories = new Map<ImportSourceType, ImporterFactory>();

  constructor() {
    this.register("tpwd", (config) => new TPWDImporter(config));
    this.register("nps", (config) => new NPSImporter(config));
    this.register("usace", (config) => new USACEImporter(config));
    this.register("usfs", (config) => new USFSImporter(config));
    this.register("thc", (config) => new HistoricalCommissionImporter(config));
    this.register("usgs", (config) => new USGSImporter(config));
    this.register("noaa", (config) => new NOAAImporter(config));
    this.register("twdb", (config) => new TWDBImporter(config));
    this.register("osm", (config) => new OSMImporter(config));
  }

  register(type: ImportSourceType, factory: ImporterFactory): void {
    if (this.factories.has(type)) {
      throw new Error(`An Explore importer is already registered for ${type}`);
    }
    this.factories.set(type, factory);
  }

  replace(type: ImportSourceType, factory: ImporterFactory): void {
    this.factories.set(type, factory);
  }

  create(config: ImportSourceConfig): BaseImporter {
    const factory = this.factories.get(config.type);
    if (!factory) {
      throw new Error(`No Explore importer is registered for source type ${config.type}`);
    }
    return factory(config);
  }

  supports(type: ImportSourceType): boolean {
    return this.factories.has(type);
  }

  list(): ImportSourceType[] {
    return [...this.factories.keys()].sort();
  }
}

export const connectorRegistry = new ConnectorRegistry();

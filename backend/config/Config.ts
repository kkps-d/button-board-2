/* eslint-disable @typescript-eslint/no-explicit-any */

import * as z from "zod";
import { existsSync, readFileSync, writeFileSync } from "fs";

const nullableString = z.string().nullable().optional().default(null);

const ConfigSchema = z.object({
  "server.port": z.number().min(80).max(65535).default(3000),
  "database.path": nullableString
});

type ConfigFields = keyof z.infer<typeof ConfigSchema>;

export class ConfigManager {
  private config!: z.infer<typeof ConfigSchema>;
  private filePath: string;

  constructor(filePath: string) {
    this.filePath = filePath;
    this.load();
    this.save();
  }

  save() {
    writeFileSync(this.filePath, JSON.stringify(this.config, null, 4));
  }

  load() {
    if (!existsSync(this.filePath)) {
      const { data: defaultConfig } = ConfigSchema.safeParse({});
      console.log(defaultConfig);
      this.config = defaultConfig!;
    } else {
      const file = readFileSync(this.filePath, "utf-8");
      const {
        data: parsedConfig,
        success,
        error
      } = ConfigSchema.safeParse(JSON.parse(file));
      if (!success) {
        throw new Error("Failed to parse config!", { cause: error });
      }
      this.config = parsedConfig;
    }
  }

  /** Gets a config field */
  get(key: ConfigFields) {
    return this.config[key];
  }

  /**
   * Sets a config key
   * @param key The key to set
   * @param value The value to set
   * @returns `null` if succesful, `ZodError` if failure
   */
  set(key: ConfigFields, value: any) {
    // Create a cloned config with
    const tempConfig: any = { ...this.config };
    tempConfig[key] = value;

    // Validate the tempConfig against the schema to see if it's still valid
    const {
      data: validatedConfig,
      success,
      error
    } = ConfigSchema.safeParse(tempConfig);

    if (!success) {
      return error;
    } else {
      this.config = validatedConfig;
      return null;
    }
  }
}

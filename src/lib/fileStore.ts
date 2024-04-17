import { promises as fs } from "fs";
import path from "path";

export class JsonFileStore<T> {
  private queue: Promise<void> = Promise.resolve();

  constructor(private readonly filePath: string) {}

  private async ensureFile() {
    const resolved = path.resolve(process.cwd(), this.filePath);
    await fs.mkdir(path.dirname(resolved), { recursive: true });
    try {
      await fs.access(resolved);
    } catch {
      await fs.writeFile(resolved, "[]", "utf8");
    }
    return resolved;
  }

  async read(fallback: T): Promise<T> {
    const resolved = await this.ensureFile();
    const text = await fs.readFile(resolved, "utf8");
    if (!text || text.trim().length === 0) {
      return fallback;
    }
    try {
      return JSON.parse(text) as T;
    } catch (err) {
      console.error("Failed to parse", resolved, err);
      return fallback;
    }
  }

  write(nextValue: T): Promise<void> {
    this.queue = this.queue.then(async () => {
      const resolved = await this.ensureFile();
      await fs.writeFile(resolved, JSON.stringify(nextValue, null, 2), "utf8");
    });
    return this.queue;
  }
}

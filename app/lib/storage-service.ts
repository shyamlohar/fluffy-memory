type Adapter = {
  get<T>(key: string): T | null;
  set<T>(key: string, value: T): void;
  remove(key: string): void;
};

const isBrowser = typeof window !== "undefined";

function createLocalAdapter(): Adapter {
  return {
    get<T>(key: string) {
      if (!isBrowser) return null;
      try {
        const raw = window.localStorage.getItem(key);
        if (raw == null) return null;
        return JSON.parse(raw) as T;
      } catch {
        return null;
      }
    },
    set<T>(key: string, value: T) {
      if (!isBrowser) return;
      try {
        window.localStorage.setItem(key, JSON.stringify(value));
      } catch {
        // ignore
      }
    },
    remove(key: string) {
      if (!isBrowser) return;
      try {
        window.localStorage.removeItem(key);
      } catch {
        // ignore
      }
    },
  };
}

class StorageService {
  private current: Adapter;
  private adapters: Record<string, Adapter>;

  constructor(adapters: Record<string, Adapter>, defaultAdapter: string) {
    this.adapters = adapters;
    this.current = adapters[defaultAdapter];
  }

  use(nameOrAdapter: string | Adapter) {
    if (typeof nameOrAdapter === "string") {
      const adapter = this.adapters[nameOrAdapter];
      if (adapter) {
        this.current = adapter;
      }
    } else {
      this.current = nameOrAdapter;
    }
  }

  get<T>(key: string): T | null {
    return this.current.get<T>(key);
  }

  set<T>(key: string, value: T): void {
    this.current.set(key, value);
  }

  remove(key: string): void {
    this.current.remove(key);
  }
}

export const storageService = new StorageService(
  {
    local: createLocalAdapter(),
  },
  "local"
);

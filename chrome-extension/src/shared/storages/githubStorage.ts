import {
  BaseStorage,
  createStorage,
  StorageType,
} from "@src/shared/storages/base";

type GliderData = {
  token: string | null;
};

type GitGliderStorage = BaseStorage<GliderData> & {
  setGliderData: (arg: GliderData) => Promise<void>;
};

const storage = createStorage<GliderData>(
  "git-glider-storage",
  {
    token: null,
  },
  {
    storageType: StorageType.Local,
    liveUpdate: true,
  }
);

const exampleThemeStorage: GitGliderStorage = {
  ...storage,
  setGliderData: async (newGliderData) => {
    await storage.set(() => {
      return newGliderData;
    });
  },
};

export default exampleThemeStorage;

type Commands = {
  run?: () => Promise<void> | void
  save?: () => Promise<void> | void
  cancel?: () => void
}

let currentCommands: Commands | null = null

export const runnerCommandsStore = {
  set(commands: Commands | null) {
    currentCommands = commands
  },
  get() {
    return currentCommands
  },
}


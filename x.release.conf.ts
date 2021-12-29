import { defineConfig, InternalReleaseTask } from '@0x-jerry/x-release'

export default defineConfig({
  sequence: [InternalReleaseTask.updatePackageVersion, InternalReleaseTask.syncToGit],
})

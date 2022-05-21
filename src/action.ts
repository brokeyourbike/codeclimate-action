import * as os from 'os'
import * as fs from 'fs'
import * as path from 'path'
import * as core from '@actions/core'
import * as exec from '@actions/exec'
import * as tc from '@actions/tool-cache'
import { parse } from './options'
import { verifySignature } from './validate'
import { getDownloadUrl, getFilename } from './helpers'

export async function run (): Promise<void> {
  try {
    const platform = os.platform()

    if (platform === 'win32') {
      core.setFailed('Reporter in not supported on windows')
      return
    }

    const { execArgs, options, version } = parse()

    core.info('Downloading reporter..')
    const filePath = await tc.downloadTool(
      getDownloadUrl(platform, version),
      path.join(__dirname, getFilename(platform, version))
    )
    core.info(`Reporter saved to ${filePath}`)

    core.info('Validating reporter..')
    if (!await verifySignature(filePath, platform, version)) {
      return
    }

    core.info('Making it executable..')
    fs.chmodSync(filePath, 0o755)

    core.info('Uploading coverage report..')
    await exec.exec(filePath, execArgs, options)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to upload coverage report'
    core.setFailed(`Encountered an unexpected error ${message}`)
  }
}

import * as os from 'os'
import * as fs from 'fs'
import * as path from 'path'
import * as core from '@actions/core'
import * as exec from '@actions/exec'
import * as tc from '@actions/tool-cache'
import * as github from '@actions/github'
import { verifySignature } from './validate'
import { isTrue, cleanRef, getDownloadUrl, getFilename, parseCoverageLocations } from './helpers'

export async function run (): Promise<void> {
  try {
    const platform = os.platform()
    if (platform === 'win32') {
      core.setFailed('Reporter in not supported on windows')
      return
    }

    const context = github.context

    const token = core.getInput('token')
    const locations = parseCoverageLocations(core.getInput('files'))
    const prefix = core.getInput('prefix')
    const verbose = isTrue(core.getInput('verbose'))
    const workingDir = core.getInput('working-directory')
    const version = core.getInput('version')

    const execOptions: exec.ExecOptions = {
      cwd: workingDir !== '' ? workingDir : undefined,
      env: {
        CC_TEST_REPORTER_ID: token,
        GIT_BRANCH: cleanRef(process.env.GITHUB_REF ?? context.ref),
        GIT_COMMIT_SHA: process.env.GITHUB_SHA ?? context.sha
      }
    }

    if (locations.length <= 0) {
      core.setFailed('No coverage locations found after parsing `files` input')
      return
    }

    core.info('Downloading reporter..')
    const filePath = await tc.downloadTool(
      getDownloadUrl(platform, version),
      `./${getFilename(platform, version)}`
    )
    core.info(`Reporter saved to ${filePath}`)

    core.info('Validating reporter..')
    if (!await verifySignature(filePath, platform, version)) {
      return
    }

    core.info('Making it executable..')
    fs.chmodSync(filePath, 0o755)

    core.info('Running before-build..')
    let code: number = await exec.exec(filePath, ['before-build'], execOptions)
    if (code !== 0) {
      core.setFailed(`Coverage before-build exited with code ${code}`)
      return
    }

    if (locations.length === 1) {
      const afterBuildArgs: string[] = ['after-build', '--exit-code', '0']
      if (prefix !== '') {
        afterBuildArgs.push('--prefix', prefix)
      }
      if (verbose) {
        afterBuildArgs.push('--debug')
      }

      core.info('Running after-build..')
      code = await exec.exec(filePath, afterBuildArgs, execOptions)
      if (code !== 0) {
        core.setFailed(`Coverage after-build exited with code ${code}`)
        return
      }
    } else {
      //
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to upload coverage report'
    core.setFailed(`Encountered an unexpected error ${message}`)
  }
}

const fs = require('fs')
const path = require('path')
const chalk = require('chalk')
const semver = require('semver')
const { prompt } = require('enquirer')
const execa = require('execa')
const pkg = require('../package.json')
const currentVersion = pkg.version

const versionIncrements = ['patch', 'minor', 'major']

const inc = (i) => semver.inc(currentVersion, i)
const run = (bin, args, opts = {}) => execa(bin, args, { stdio: 'inherit', ...opts })
const step = (msg) => console.log(chalk.cyan(msg))

async function main() {
  let targetVersion

  const { release } = await prompt({
    type: 'select',
    name: 'release',
    message: 'Select release type',
    choices: versionIncrements.map((i) => `${i} (${inc(i)})`).concat(['custom'])
  })

  if (release === 'custom') {
    targetVersion = (
      await prompt({
        type: 'input',
        name: 'version',
        message: 'Input custom version',
        initial: currentVersion
      })
    ).version
  } else {
    targetVersion = release.match(/\((.*)\)/)[1]
  }

  if (!semver.valid(targetVersion)) {
    throw new Error(`Invalid target version: ${targetVersion}`)
  }

  // Update the package version.
  step('\nUpdating the package version...')
  updatePackage(targetVersion)

  if (pkg.scripts.test) {
    step('\nTesting ...')
    await run('yarn', ['test'])
  }

  if (pkg.scripts.build) {
    step('\nBuilding ...')
    await run('yarn', ['build'])
  }

  if (pkg.scripts.changelog) {
    step('\nGenerating release note...')
    await generateReleaseNote()
  }

  step('\nCommitting changes...')
  await run('git', ['add', '-A'])
  await run('git', ['commit', '-m', `release: v${targetVersion}`])

  step('\nPushing to GitHub...')
  await run('git', ['tag', `v${targetVersion}`])
  await run('git', ['push', 'origin', `refs/tags/v${targetVersion}`])
  await run('git', ['push'])
}

async function generateReleaseNote() {
  const mdContent = ['<!-- Auto generate by `./scripts/release.js` -->']

  const changelogPath = path.join(__dirname, '../CHANGELOG.md')
  const oldContent = fs.existsSync(changelogPath) ? fs.readFileSync(changelogPath, { encoding: 'utf-8' }) : ''

  await run('yarn', ['changelog'])

  const newContent = fs.readFileSync(changelogPath, { encoding: 'utf-8' })

  mdContent.push(newContent.slice(0, newContent.length - oldContent.length).trim())

  const releaseNotePath = path.join(__dirname, '../release-note.md')
  fs.writeFileSync(releaseNotePath, mdContent.join('\n'), { encoding: 'utf-8' })
}

function updatePackage(version) {
  const pkgPath = path.resolve(path.resolve(__dirname, '..'), 'package.json')
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'))

  pkg.version = version

  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n')
}

main().catch((err) => console.error(err))

### Guide to publishing a new release

Publishing a new release is done manually, not via CI. Do not change the package version yourself. This is done automatically based on commit messages.

Follow these steps:

1. Create a new release:

    `yarn run release`

    This will:
    - Checkout master
    - Pull down the latest code
    - Build
    - Run linter
    - Run tests
    - Update change log with commits since last release
    - Automatically bump the package version
      - Will look through commits since previous release and increment patch, minor or major version based on commit messages.
    - Commit changes

2. Publish:

    `yarn run ship-it`

    This will:
    - Push up latest changes (from previous step), including version tag
    - Publishes to npm


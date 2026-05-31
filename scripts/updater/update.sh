#!/bin/bash

UpdaterInstall() {
  # Copy release files to Pterodactyl directory
  PRINT INFO "Copying release files to Pterodactyl directory.."
  cp -r .update/repo/* .
  cp .update/repo/.eslintrc.js .
  cp .update/repo/.prettierignore .
  cp .update/repo/.prettierrc.json .
  cp .update/repo/.shellcheckrc .

  # Check if nodejs version is sufficient
  nodeMajor=$(node -v | awk -F. '{print $1}' | sed 's/[^0-9]*//g')
  if [[ $nodeMajor -lt 22 ]]; then
    PRINT FATAL "Grace period for Node.js <22 is over. Please upgrade it to a new version then rerun the upgrade command."
  fi
}

#!/bin/bash

Command() {
  if ! is_developer; then PRINT FATAL "Developer mode is not enabled.";exit 2; fi

  if [[ -z $(find .blueprint/dev -maxdepth 1 -type f -not -name ".gitkeep" -print -quit) ]]; then
    PRINT FATAL "Development directory is empty."
    exit 2
  fi

  if [[ -f ".blueprint/dev/.gitkeep" ]]; then
    rm .blueprint/dev/.gitkeep 2>> "$BLUEPRINT__DEBUG"
  fi

  PRINT INFO "Starting developer extension installation.."
  blueprint -add "[developer-build]"
}
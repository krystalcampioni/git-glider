#!/bin/bash

echo ">>>>> Installing Git Glider..."

# Check if curl, wget, or fetch is installed
if command -v curl >/dev/null 2>&1; then
  download_command="curl -fsSL"
elif command -v wget >/dev/null 2>&1; then
  download_command="wget -qO-"
elif command -v fetch >/dev/null 2>&1; then
  download_command="fetch -qo -"
else
  echo "Neither curl, wget nor fetch could be found. Please install one of them and try again."
  exit 1
fi

# Use the download command to download the script files
$download_command "https://raw.githubusercontent.com/krystalcampioni/git-glider/main/git-commands.sh?$(date +%s)" > ~/git-commands.sh
$download_command "https://raw.githubusercontent.com/krystalcampioni/git-glider/main/text-styles.sh?$(date +%s)" > ~/text-styles.sh

# Source the text-styles.sh and git-commands.sh scripts
. ~/text-styles.sh
. ~/git-commands.sh

# Check if the current shell is Bash or Zsh
if [ -n "$BASH_VERSION" ]; then
  shell="bash"
elif [ -n "$ZSH_VERSION" ]; then
  shell="zsh"
else
  colorPrint yellow $shell
  colorPrint red "❌ Unsupported shell. Please use Bash or Zsh."
  exit 1
fi

# Determine the correct shell configuration file
if [ "$shell" = "zsh" ]; then
  config_file=~/.zshrc
elif [ "$shell" = "bash" ]; then
  if [ "$OSTYPE" = "darwin"* ]; then
    # MacOS uses .bash_profile
    config_file=~/.bash_profile
  else
    config_file=~/.bashrc
  fi
fi

colorPrint brightCyan "$shell $(colorPrint blue 'detected, modifying') $(colorPrint brightCyan $config_file)"

# Add a line to source the script files, if it's not already there
if ! grep -q ". ~/git-commands.sh" "$config_file"; then
  echo ". ~/git-commands.sh" >> "$config_file"
fi
if ! grep -q ". ~/text-styles.sh" "$config_file"; then
  echo ". ~/text-styles.sh" >> "$config_file"
fi

# Source the shell configuration file
# if [ "$shell" = "zsh" ]; then
#   exec zsh
# elif [ "$shell" = "bash" ]; then
#   . "$config_file"
# fi

. $config_file

colorPrint brightGreen "✅ Git Glider has been installed successfully!"
#!/usr/bin/env bash
# ==============================================================================
# Courier — Build & Packaging Automation Script
# Usage:
#   ./scripts/build.sh [web | linux | deb | appimage | mac | win | deploy | all]
# ==============================================================================

set -eo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"

cd "${ROOT_DIR}"

# ANSI Colors
BOLD="\033[1m"
GREEN="\033[38;5;48m"
CYAN="\033[38;5;45m"
MAGENTA="\033[38;5;177m"
YELLOW="\033[38;5;220m"
RED="\033[38;5;196m"
GRAY="\033[38;5;244m"
RESET="\033[0m"

log_info() {
  echo -e "${CYAN}ℹ [INFO]${RESET} $1"
}

log_success() {
  echo -e "${GREEN}✓ [SUCCESS]${RESET} $1"
}

log_warn() {
  echo -e "${YELLOW}▲ [WARN]${RESET} $1"
}

log_error() {
  echo -e "${RED}✗ [ERROR]${RESET} $1" >&2
}

print_header() {
  echo -e "${MAGENTA}${BOLD}"
  echo "  ██████╗ ██████╗ ██╗   ██╗██████╗ ██╗███████╗██████╗ "
  echo " ██╔════╝██╔═══██╗██║   ██║██╔══██╗██║██╔════╝██╔══██╗"
  echo " ██║     ██║   ██║██║   ██║██████╔╝██║█████╗  ██████╔╝"
  echo " ██║     ██║   ██║██║   ██║██╔══██╗██║██╔══╝  ██╔══██╗"
  echo " ╚██████╗╚██████╔╝╚██████╔╝██║  ██║██║███████╗██║  ██║"
  echo "  ╚═════╝ ╚═════╝  ╚═════╝ ╚═╝  ╚═╝╚═╝╚══════╝╚═╝  ╚═╝"
  echo -e "         ${CYAN}API Engine & Desktop Client Builder${RESET}\n"
}

ensure_deps() {
  if [ ! -d "node_modules" ]; then
    log_info "node_modules not found. Running npm install..."
    npm install
  fi
}

build_web() {
  log_info "Building production web bundle with Vite..."
  ensure_deps
  npm run build
  log_success "Web bundle generated in dist/ (index.html + assets)"
}

deploy_web() {
  build_web
  log_info "Deploying to Firebase Hosting..."
  if ! command -v firebase &>/dev/null && ! npx firebase-tools --version &>/dev/null; then
    log_error "Firebase CLI tools not found. Install with: npm install -g firebase-tools"
    exit 1
  fi
  npm run deploy:firebase
  log_success "Web application deployed to Firebase Hosting!"
}

build_linux() {
  build_web
  log_info "Packaging Linux Standalone Apps (.deb + .AppImage)..."
  npm run dist:linux
  print_release_summary "deb AppImage"
}

build_linux_deb() {
  build_web
  log_info "Packaging Debian / Ubuntu Package (.deb)..."
  npm run dist:linux:deb
  print_release_summary "deb"
}

build_linux_appimage() {
  build_web
  log_info "Packaging Linux Portable Executable (.AppImage)..."
  npm run dist:linux:appimage
  print_release_summary "AppImage"
}

build_mac() {
  build_web
  log_info "Packaging macOS Standalone Apps (.dmg + .zip for Apple Silicon & Intel)..."
  npm run dist:mac
  print_release_summary "dmg zip"
}

build_mac_arm64() {
  build_web
  log_info "Packaging macOS Apple Silicon App (.dmg for arm64)..."
  npm run dist:mac:arm64
  print_release_summary "dmg"
}

build_win() {
  build_web
  log_info "Packaging Windows Standalone Apps (.exe NSIS & Portable)..."
  npm run dist:win
  print_release_summary "exe"
}

build_all_host() {
  print_header
  log_info "Detecting current operating system..."
  local OS_TYPE
  OS_TYPE="$(uname -s)"
  case "${OS_TYPE}" in
    Linux*)
      log_info "Detected Linux environment. Building Web + Linux Desktop (.deb & .AppImage)..."
      build_linux
      ;;
    Darwin*)
      log_info "Detected macOS environment. Building Web + macOS Desktop (.dmg & .zip)..."
      build_mac
      ;;
    MINGW*|MSYS*|CYGWIN*)
      log_info "Detected Windows environment. Building Web + Windows Desktop (.exe)..."
      build_win
      ;;
    *)
      log_warn "Unknown OS '${OS_TYPE}'. Building web distribution only."
      build_web
      ;;
  esac
}

print_release_summary() {
  echo ""
  echo -e "${GREEN}${BOLD}======================================================${RESET}"
  echo -e "${GREEN}${BOLD}✓ Build Completed Successfully! Artifacts in release/:${RESET}"
  echo -e "${GREEN}${BOLD}======================================================${RESET}"
  if [ -d "release" ]; then
    ls -lh release/ | grep -E "\.(deb|AppImage|dmg|zip|exe)$" || ls -lh release/
  fi
  echo ""
}

show_menu() {
  print_header
  echo -e "${BOLD}Select a build target:${RESET}"
  echo -e "  ${CYAN}1)${RESET} Web application only           ${GRAY}(dist/)${RESET}"
  echo -e "  ${CYAN}2)${RESET} Linux package (.deb + .AppImage) ${GRAY}(release/)${RESET}"
  echo -e "  ${CYAN}3)${RESET} Linux .deb package only        ${GRAY}(release/*.deb)${RESET}"
  echo -e "  ${CYAN}4)${RESET} Linux .AppImage only           ${GRAY}(release/*.AppImage)${RESET}"
  echo -e "  ${CYAN}5)${RESET} macOS dmg + zip (arm64 & x64)  ${GRAY}(release/*.dmg)${RESET}"
  echo -e "  ${CYAN}6)${RESET} Windows exe (NSIS & Portable)  ${GRAY}(release/*.exe)${RESET}"
  echo -e "  ${CYAN}7)${RESET} Deploy Web App to Firebase     ${GRAY}(hosting)${RESET}"
  echo -e "  ${CYAN}8)${RESET} Build All for Current Host OS"
  echo -e "  ${CYAN}q)${RESET} Quit"
  echo ""
  read -r -p "Enter choice [1-8 or q]: " choice
  case "$choice" in
    1) build_web ;;
    2) build_linux ;;
    3) build_linux_deb ;;
    4) build_linux_appimage ;;
    5) build_mac ;;
    6) build_win ;;
    7) deploy_web ;;
    8) build_all_host ;;
    q|Q) exit 0 ;;
    *) log_error "Invalid selection."; exit 1 ;;
  esac
}

# --- CLI ROUTING ---
TARGET="${1:-}"

case "${TARGET}" in
  web)
    build_web
    ;;
  linux)
    build_linux
    ;;
  deb)
    build_linux_deb
    ;;
  appimage)
    build_linux_appimage
    ;;
  mac)
    build_mac
    ;;
  mac:arm64|arm64)
    build_mac_arm64
    ;;
  win|windows)
    build_win
    ;;
  deploy|firebase)
    deploy_web
    ;;
  all)
    build_all_host
    ;;
  help|--help|-h)
    print_header
    echo -e "Usage: ${BOLD}./scripts/build.sh [target]${RESET}"
    echo ""
    echo "Available Targets:"
    echo "  web             Build production web bundle into dist/"
    echo "  linux           Build both .deb and .AppImage for Linux"
    echo "  deb             Build .deb package for Debian/Ubuntu"
    echo "  appimage        Build .AppImage portable executable"
    echo "  mac             Build .dmg and .zip for macOS (arm64 & x64)"
    echo "  win             Build Windows .exe installers (NSIS & portable)"
    echo "  deploy          Build web bundle and deploy to Firebase Hosting"
    echo "  all             Build web bundle and host desktop packages"
    echo "  help            Show this help reference"
    ;;
  "")
    show_menu
    ;;
  *)
    log_error "Unknown build target: '${TARGET}'"
    echo "Run './scripts/build.sh help' for usage instructions."
    exit 1
    ;;
esac

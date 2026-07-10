#!/usr/bin/env bash
set -euo pipefail

project_dir="$(cd "$(dirname "$0")/.." && pwd)"
cd "$project_dir"

npm run build

remote_url="$(git remote get-url github 2>/dev/null || git remote get-url origin)"
publish_dir="$(mktemp -d)"
trap 'rm -rf "$publish_dir"' EXIT

cp -R out/. "$publish_dir/"
git -C "$publish_dir" init --initial-branch=gh-pages
git -C "$publish_dir" config user.name "Echo Carrie"
git -C "$publish_dir" config user.email "echoscarrie@users.noreply.github.com"
git -C "$publish_dir" add -A
git -C "$publish_dir" commit -m "Deploy Echo Carrie"
git -C "$publish_dir" remote add origin "$remote_url"
git -C "$publish_dir" push --force origin gh-pages

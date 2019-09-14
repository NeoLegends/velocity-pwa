#!/bin/sh

set -e

curl https://sh.rustup.rs -sSf | sh -s -- -y --default-toolchain none
source $HOME/.cargo/env

git clone https://github.com/NeoLegends/osm-tile-downloader

(cd osm-tile-downloader && cargo run -- \
  --north 50.811 \
  --east 6.1649 \
  --south 50.7492 \
  --west 6.031 \
  --url https://a.tile.openstreetmap.se/hydda/full/\{z\}/\{x\}/\{y\}.png \
  --output ../public/tile)

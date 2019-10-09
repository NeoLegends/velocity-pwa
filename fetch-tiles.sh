#!/bin/bash

set -e

curl https://sh.rustup.rs -sSf | sh -s -- -y --default-toolchain nightly
source $HOME/.cargo/env

cargo install --force osm-tile-downloader

osm-tile-downloader \
  --north 50.811 \
  --east 6.1649 \
  --south 50.7492 \
  --west 6.031 \
  --url https://a.tile.openstreetmap.se/hydda/full/\{z\}/\{x\}/\{y\}.png \
  --output ../public/tile

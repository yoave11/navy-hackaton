#!/bin/bash
[[ -f $1 ]] || echo "usage: $0 tracker.json"
cat $1 | kafkacat -P -b localhost:9092 -t updates -D#

#!/bin/bash
# build the listed episodes one after another, after any running build finishes
cd "$(dirname "$0")"
while pgrep -f "build_ep.sh" > /dev/null; do sleep 20; done
for n in "$@"; do ./build_ep.sh $n $((8940 + n)) > build$n.log 2>&1; echo "ep$n exit $?" >> queue.log; done

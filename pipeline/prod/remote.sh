#!/bin/sh

BRANCH=master
CODE_PATH=/home/ubuntu/GP/frontend/gp-frontend/

echo "Tunneling to production server."
ssh ubuntu@production.gp.com <<EOF

# get new code
cd $CODE_PATH
echo "git fetch --all"
git fetch --all || exit 1
echo "git reset --hard origin/$BRANCH"
git reset --hard origin/$BRANCH || exit 1

# Install, Build and moving files to server
chmod +x execute.sh
./execute.sh remote production

EOF
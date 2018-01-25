#!/bin/bash
echo "Generate SSH keys for debuggin...."
ssh-keygen -t rsa -f debug_key
echo "Copy to remote debug server..."
ssh-copy-id -i debug_key boros@orangepizero.local
echo "done!"

#!/bin/bash

while true; do
    clear
    rm -rf ./dist
    gulp dev

    # Check the exit status of the previous command
    if [ $? -eq 0 ]; then
        # If the command succeeded, break out of the loop
        break
    else
        # If the command failed, display a message and sleep for a while before retrying
        echo "DEV failed. Retrying in 5 seconds..."
        sleep 3
    fi
done

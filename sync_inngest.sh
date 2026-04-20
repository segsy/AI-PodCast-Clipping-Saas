#!/bin/bash

# Script to sync the Inngest app
# This sends a PUT request to the Inngest serve endpoint to register the app and its functions

curl -X PUT https://ai-pod-cast-clipping-saas-hdwq.vercel.app/api/inngest --fail-with-body
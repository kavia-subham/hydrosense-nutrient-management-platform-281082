#!/bin/bash
cd /home/kavia/workspace/code-generation/hydrosense-nutrient-management-platform-281082/frontend_dashboard
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi


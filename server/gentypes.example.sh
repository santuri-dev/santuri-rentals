#!/bin/sh
bun supabase gen types typescript --project-id [PROJECT_ID] > ./src/db/types.ts

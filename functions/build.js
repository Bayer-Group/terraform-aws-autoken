#!/usr/bin/env node
require('esbuild').build({
    logLevel: "info",
    entryPoints: [
        'src/action-token.ts', 
        'src/action-cleanup.ts',
        'src/lambda.ts'
    ],
    bundle: true,
    minify: true,
    platform: 'node',
    sourcemap: true,
    legalComments: 'external',
    //external: [
    //    'aws-sdk'
    //],
    outdir: 'dist'
})

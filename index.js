#!/usr/bin/env node

import Anthropic from '@anthropic-ai/sdk';
import { spawnSync } from 'child_process';

function readStdin() {
  return new Promise((resolve) => {
    let data = '';
    if (process.stdin.isTTY) return resolve('');
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', chunk => data += chunk);
    process.stdin.on('end', () => resolve(data.trim()));
  });
}

function copyToClipboard(text) {
  const platform = process.platform;
  let result;
  try {
    if (platform === 'darwin') {
      result = spawnSync('pbcopy', { input: text, encoding: 'utf8', stdio: ['pipe', 'ignore', 'ignore'] });
    } else if (platform === 'win32') {
      result = spawnSync('clip', { input: text, encoding: 'utf8', stdio: ['pipe', 'ignore', 'ignore'] });
    } else {
      result = spawnSync('xclip', ['-selection', 'clipboard'], { input: text, encoding: 'utf8', stdio: ['pipe', 'ignore', 'ignore'] });
    }

    if (result.error || result.status !== 0) {
      throw result.error || new Error('Clipboard command failed');
    }

    console.error('✓ Copied to clipboard');
  } catch {
    console.error('Could not copy. On Linux, install xclip.');
  }
}

function showHelp() {
  console.log(`explain-error — paste any error, get a plain English fix

Usage:
  npx @harinazrekar/explain-error "your error here"
  cat error.log | npx @harinazrekar/explain-error
  npx @harinazrekar/explain-error --short "ReferenceError: x is not defined"

Flags:
  --short   One paragraph explanation only
  --copy    Copy output to clipboard
  --dry     Show the input that would be analysed
  --help    Show this message

Setup:
  export EXPLAIN_ERROR_API_KEY=your_key_here`);
  process.exit(0);
}

function parseArgs() {
  const argv = process.argv.slice(2);
  const flags = {
    help: false,
    short: false,
    copy: false,
    dry: false,
  };
  const args = [];

  for (const arg of argv) {
    if (arg === '--help') flags.help = true;
    else if (arg === '--short') flags.short = true;
    else if (arg === '--copy') flags.copy = true;
    else if (arg === '--dry') flags.dry = true;
    else args.push(arg);
  }

  return { flags, error: args.join(' ') };
}

function truncateError(error) {
  const MAX_LENGTH = 6000;
  if (error.length > MAX_LENGTH) {
    return error.substring(0, MAX_LENGTH) + '\n[... truncated ...]';
  }
  return error;
}

async function main() {
  try {
    const { flags, error: cliError } = parseArgs();

    if (flags.help) {
      showHelp();
    }

    let errorInput = cliError;
    if (!errorInput) {
      const stdinData = await readStdin();
      errorInput = stdinData;
    }

    if (!errorInput) {
      console.log(`No error provided. Pass it as an argument or pipe it via stdin.

Usage:
  npx @harinazrekar/explain-error "your error here"
  cat error.log | npx @harinazrekar/explain-error`);
      process.exit(1);
    }

    if (flags.dry) {
      console.log(`--- Error being analysed ---
${errorInput}
----------------------------`);
      process.exit(0);
    }

    errorInput = truncateError(errorInput);

    const apiKey = process.env.EXPLAIN_ERROR_API_KEY;
    if (!apiKey) {
      console.log(`Error: EXPLAIN_ERROR_API_KEY is not set.

Add this to your shell config:
  export EXPLAIN_ERROR_API_KEY=your_key_here

Get a key at: https://console.anthropic.com`);
      process.exit(1);
    }

    const client = new Anthropic({ apiKey });

    const systemPrompt = flags.short
      ? 'You are an expert software debugger. A developer will give you an error. Explain in one short paragraph what went wrong and the most likely fix. Be direct. No headers. No bullet points. No mention of AI or yourself. Plain English only.'
      : `You are an expert software debugger. A developer will give you an error message or stack trace. Your job is to explain it clearly and help them fix it fast.

Always respond in this exact structure:

## What went wrong
One paragraph. Plain English. No jargon. Explain the root cause like you're talking to a smart person who is frustrated.

## Why it happened
One paragraph. What in the code likely caused this. Be specific about the most common causes.

## How to fix it
A numbered list of concrete steps. Code examples where relevant. Most likely fix first.

## Quick check
One line. The single fastest thing they can try right now.

Rules:
- Never say "I" or refer to yourself
- Never mention AI, language models, or any tool name
- Do not add any preamble or closing remarks
- Output only the four sections above, nothing else`;

    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      system: systemPrompt,
      messages: [{ role: 'user', content: `Here is the error:\n\n${errorInput}` }],
    });

    const result = message.content[0].text.trim();
    console.log('\n' + result + '\n');

    if (flags.copy) {
      copyToClipboard(result);
    }
  } catch (err) {
    console.error(`Something went wrong: ${err.message}`);
    process.exit(1);
  }
}

main();

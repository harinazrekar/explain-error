# explain-error

Paste any error stack trace. Get a plain English explanation and a fix.
No more Googling the same TypeError for the fifth time.

## Demo

```
$ npx @harinazrekar/explain-error "TypeError: Cannot read properties of undefined (reading 'map')"

## What went wrong
You're trying to call .map() on something that is undefined at the time your
code runs. This usually means the variable you're mapping over hasn't been
assigned yet, or an API call returned nothing and you didn't handle the empty case.

## Why it happened
The most common cause is calling .map() on a state variable before data has
loaded — for example, rendering a list before a fetch completes. It can also
happen when a function returns undefined instead of an empty array.

## How to fix it
1. Add a fallback: someArray?.map(...) or (someArray || []).map(...)
2. Check where someArray is defined and confirm it's always an array
3. If it comes from an API, add a loading state before rendering

## Quick check
Add console.log(someArray) right before the .map() call and check what it prints.
```

## Install

```bash
# No install needed
npx @harinazrekar/explain-error "your error here"

# Or install globally
npm install -g @harinazrekar/explain-error
```

## Setup

```bash
export EXPLAIN_ERROR_API_KEY=your_key_here
```

Add to your `.zshrc` or `.bashrc` to make it permanent.

## Usage

```bash
# Pass error as argument
npx @harinazrekar/explain-error "ReferenceError: fetch is not defined"

# Pipe from a log file
cat server.log | npx @harinazrekar/explain-error

# Short mode — one paragraph only
npx @harinazrekar/explain-error --short "ECONNREFUSED 127.0.0.1:5432"

# Copy explanation to clipboard
npx @harinazrekar/explain-error --copy "SyntaxError: Unexpected token '<'"

# See what gets sent for analysis
npx @harinazrekar/explain-error --dry "your error"
```

## Flags

| Flag | Description |
|---|---|
| `--short` | One paragraph explanation, no steps |
| `--copy` | Copy output to clipboard |
| `--dry` | Show the input being analysed |
| `--help` | Show usage |

## Author

Built by [Hari Nazrekar](https://github.com/harinazrekar) © 2026

## License

MIT

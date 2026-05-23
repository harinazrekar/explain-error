# explain-error

Paste any error or stack trace. Get a plain-English explanation, the likely cause, and concrete fix steps right in your terminal.

`explain-error` is a tiny Node.js CLI for those moments when your terminal throws a wall of red text and your brain quietly leaves the room. Pass an error as an argument, pipe logs from stdin, or ask for a short one-paragraph answer when you just need the fix fast.

> Built for developers who want the "what broke and what do I try next?" part without digging through five browser tabs.

## Features

✨ Plain-English debugging - Turns stack traces and cryptic runtime errors into clear explanations.

🛠️ Concrete fix steps - Gives practical next moves instead of vague advice.

⚡ Fast CLI workflow - Works with `npx`, global installs, arguments, and piped logs.

🧾 Structured output - Full mode includes what went wrong, why it happened, how to fix it, and a quick check.

✂️ Short mode - Use `--short` when you only want one direct paragraph.

📋 Clipboard support - Use `--copy` to copy the explanation after it is generated.

🔍 Dry-run mode - Use `--dry` to preview exactly what will be sent for analysis.

## Demo

```bash
$ npx @harinazrekar/explain-error "TypeError: Cannot read properties of undefined (reading 'map')"
```

```markdown
## What went wrong
You're trying to call .map() on something that is undefined at the time your code runs. This usually means the variable you're mapping over has not been assigned yet, or an API call returned nothing and you did not handle the empty case.

## Why it happened
The most common cause is rendering a list before data has loaded. For example, a React state value may start as undefined, then later become an array after a fetch completes.

## How to fix it
1. Add a fallback: someArray?.map(...) or (someArray || []).map(...)
2. Check where someArray is defined and make sure it always starts as an array
3. If it comes from an API, add a loading state before rendering the list

## Quick check
Log someArray right before the .map() call and confirm whether it is actually an array.
```

## Install

No install needed:

```bash
npx @harinazrekar/explain-error "your error here"
```

Or install globally:

```bash
npm install -g @harinazrekar/explain-error
explain-error "your error here"
```

## Setup

Create an Anthropic API key, then export it in your shell:

```bash
export EXPLAIN_ERROR_API_KEY=your_key_here
```

To make it permanent, add the same line to your shell config:

```bash
# zsh
echo 'export EXPLAIN_ERROR_API_KEY=your_key_here' >> ~/.zshrc

# bash
echo 'export EXPLAIN_ERROR_API_KEY=your_key_here' >> ~/.bashrc
```

## Usage

Pass an error directly:

```bash
npx @harinazrekar/explain-error "ReferenceError: fetch is not defined"
```

Pipe logs from a file:

```bash
cat server.log | npx @harinazrekar/explain-error
```

Use short mode:

```bash
npx @harinazrekar/explain-error --short "ECONNREFUSED 127.0.0.1:5432"
```

Copy the result to your clipboard:

```bash
npx @harinazrekar/explain-error --copy "SyntaxError: Unexpected token '<'"
```

Preview the input without sending it:

```bash
npx @harinazrekar/explain-error --dry "your error"
```

Show help:

```bash
npx @harinazrekar/explain-error --help
```

## Flags

| Flag | Description |
| --- | --- |
| `--short` | Return one concise paragraph instead of the full structured explanation. |
| `--copy` | Copy the generated explanation to your clipboard. |
| `--dry` | Print the input that would be analyzed, then exit. |
| `--help` | Show CLI usage and setup instructions. |

## Tech Stack

**Runtime**

- Node.js 18+
- Native ES modules
- Anthropic SDK

**CLI**

- Argument parsing with zero extra dependencies
- stdin support for piped logs
- Cross-platform clipboard command support
- npm package publishing via scoped package name

**Deployment**

- GitHub Actions CI
- npm publish workflow for release-based deployment
- Package contents locked down with the `files` field

## Project Structure

```text
explain-error/
├── .github/
│   └── workflows/
│       ├── ci.yml              # Syntax check, audit, package dry-run
│       └── publish.yml         # Publish to npm on GitHub Release
├── index.js                    # CLI entry point
├── package.json                # Package metadata and scripts
├── package-lock.json           # Locked dependency tree
├── .gitignore
└── README.md
```

## Local Development

Clone the repository:

```bash
git clone https://github.com/harinazrekar/explain-error.git
cd explain-error
```

Install dependencies:

```bash
npm install
```

Run the CLI locally:

```bash
node index.js --dry "TypeError: Cannot read properties of undefined"
```

Run checks:

```bash
npm run check
npm audit
npm pack --dry-run
```

## Environment Variables

| Variable | Required | Description |
| --- | --- | --- |
| `EXPLAIN_ERROR_API_KEY` | Yes | Anthropic API key used to generate explanations. |

## Output Format

By default, `explain-error` returns four sections:

1. `What went wrong` - The error translated into plain English.
2. `Why it happened` - The most likely coding cause.
3. `How to fix it` - Concrete steps, with examples when helpful.
4. `Quick check` - The fastest thing to try immediately.

Use `--short` to skip the structure and return a single compact paragraph.

## Deployment

This project deploys as an npm CLI package.

### Publish manually

```bash
npm publish --access public
```

If your npm account requires two-factor authentication:

```bash
npm publish --access public --otp YOUR_OTP
```

### Publish through GitHub Actions

1. Create an npm access token with publish permissions.
2. Add it to the GitHub repository as `NPM_TOKEN`.
3. Create a GitHub Release for the version tag.
4. The `Publish to npm` workflow will run automatically.

## Troubleshooting

**`EXPLAIN_ERROR_API_KEY is not set`**

Export your key before running the CLI:

```bash
export EXPLAIN_ERROR_API_KEY=your_key_here
```

**`Could not copy. On Linux, install xclip.`**

Install `xclip`, or run without `--copy`.

```bash
sudo apt install xclip
```

**`npx explain-error` runs a different package**

Use the scoped package name:

```bash
npx @harinazrekar/explain-error "your error"
```

The unscoped `explain-error` package name already belongs to another npm package.

## Code Quality

The project keeps the CLI intentionally small:

- Minimal dependency surface
- Syntax checks before packing
- Security audit in CI
- Locked package contents
- Clear error messages
- No API key stored in the repo

## Contributing

Contributions are welcome. Open an issue for bugs, edge cases, or output improvements, or submit a pull request with a focused change.

## Author

Built by [Hari Nazrekar](https://github.com/harinazrekar) for faster debugging and fewer "why is this undefined again?" moments.

## License

MIT

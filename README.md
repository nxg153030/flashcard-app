# Flashcard App

A modern, interactive flashcard application built with Next.js and TypeScript. Perfect for studying any subject, with special support for mathematical and technical content.

## Features

- 📝 Markdown-based flashcards with LaTeX support
- 🎯 Clean, minimalist interface
- 🔄 Smooth card flip animations
- 📱 Responsive design
- 🧮 Full mathematical equation rendering
- 📚 Support for multiple decks
- 🎨 Beautiful typography with Tailwind Typography
- 🖥️ Code syntax highlighting

## Tech Stack

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Components**: Shadcn/ui
- **Animations**: Framer Motion
- **Math Rendering**: KaTeX
- **Markdown Processing**: Remark/Rehype
- **Icons**: Lucide Icons

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/flashcard-app.git
cd flashcard-app
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Creating Flashcard Decks

Flashcards are created using Markdown files with YAML frontmatter. Place your deck files in the `public/decks` directory.

### Deck Format

```markdown
---
title: Your Deck Title
---

Question 1?

???

Answer 1

---

Question 2?

???

Answer 2 with math: $E = mc^2$

---

Question 3?

???

Answer 3 with code:
\`\`\`python
def hello_world():
    print("Hello, World!")
\`\`\`
```

### Markdown Features

- Full Markdown syntax support
- LaTeX math (inline with `$...$`, display with `$$...$$`)
- Code blocks with syntax highlighting
- Lists, tables, and other formatting
- Images and links

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Shadcn/ui](https://ui.shadcn.com/) for the beautiful UI components
- [KaTeX](https://katex.org/) for math rendering
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Next.js](https://nextjs.org/) for the framework

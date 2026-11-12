---
title: "Accessibility"
draft: false
description: "How this site tries to work for everyone, what is still missing, and how to report a problem."
---

I want everyone to be able to read this site, whatever their device, eyesight or way of browsing. The target is [WCAG 2.2](https://www.w3.org/TR/WCAG22/) at level AA. I am not an expert, so this page says what I have done, what I know is still missing, and how to tell me about the rest.

## What has been done

- **Checked** with [axe-core](https://github.com/dequelabs/axe-core) on every type of page, in the light and dark themes, at desktop and phone widths. No issues left at the last check.
- **Keyboard**: a "Skip to content" link on every page, visible focus, and everything that opens (image viewer, link previews, contents) also opens and closes from the keyboard, with Esc to close.
- **Screen readers**: images have a description of what they show, separate from the caption; margin notes are announced as numbered notes and can be read even when closed on a phone; charts and counters have a text equivalent; phrases in Latin or Italian are marked so they are pronounced in the right language.
- **Reading**: links in the text of the blog and of the other pages are underlined, colours meet the AA contrast ratio in both themes, the text reflows without sideways scrolling down to 320 pixels (or 400% zoom), and animations stop if your system asks for reduced motion.
- **CV**: the [PDF](/uploads/cv_Sberna_Antonio.pdf) is tagged (PDF/UA-2): headings, reading order, language, bookmarks and link descriptions, with decorations hidden from screen readers.
- **Other formats**: every blog post also exists as plain Markdown (the same address followed by `index.md`), which works well with text-to-speech and reading tools.

## Known limits

- **Third-party content** follows its own accessibility: the Spotify player, and replies loaded from Mastodon, which may include images without a description.
- **PDFs**: papers follow the files of their publishers.
- **Home page**: its links are told apart by colour only, without underline. It is a design choice, and an exception to the rule above.
- **Testing**: automated checks catch only part of the problems, and the site has not been tried with every screen reader. Image descriptions are mine and may miss details.

## Tell me

If something does not work for you, please [write to me](/#contact): I will fix it, or at least explain why I cannot.

Last reviewed: November 2026.

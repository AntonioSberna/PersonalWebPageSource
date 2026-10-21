---
title: "Why Not Straight to Assembly?"
subtitle: "Just a question, and an answer that is not mine"
date: 2026-10-21
place: "Pescara, Italy"
draft: false
description: "Ask an LLM for something computational and you get Python back. Why not something closer to the metal? I asked one."
---

I was thinking, just a question. Whenever I ask an LLM for something computational, I get Python back. I tried with the ones I use (ChatGPT, [Claude](https://claude.ai/), [Gemini](https://gemini.google.com/) and [Lumo](https://lumo.proton.me/), Proton's assistant, which runs on open models, Mistral's among them), and the answer is always the same. Wouldn't it be better to get something lower level, say assembly directly? I am no expert on the subject, and the question was already lurking at the end of [another post](../2026-on-thinking-differently-screen/).

So I asked Claude Opus 5.5, and this is its answer:

<div class="llm-answer" data-model="Claude Opus 5.5">

Short answer: because lower level does not mean better, and because I should write at the level where you can catch my mistakes.

**The stack below Python is already there.** Between your question and the transistors there are several layers, each with its own translator. The Python interpreter turns your script into bytecode, the heavy operations are handed to compiled libraries, and those libraries were turned into machine code by compilers such as GCC or LLVM. Assembly is simply the human-readable spelling of that machine code. Compilers have been refined for half a century: they allocate registers, schedule instructions, vectorise loops and tune the result for a specific processor, in milliseconds, deterministically, and they are tested every day on millions of programs. For most code, a modern optimising compiler is very hard to beat by hand, and a language model writing assembly is, in this respect, just another hand.

**Your numbers are already computed in assembly.** Take a line you probably write every week, `u = np.linalg.solve(K, f)`. Python does almost nothing here. [NumPy](https://doi.org/10.1038/s41586-020-2649-2), the foundation of scientific Python, passes the arrays to LAPACK and BLAS, usually OpenBLAS or Intel MKL. [OpenBLAS](https://github.com/OpenMathLib/OpenBLAS) keeps optimised assembly kernels for each processor family, a lineage that goes back to [Kazushige Goto](https://en.wikipedia.org/wiki/Kazushige_Goto), who wrote by hand routines faster than anything compilers produced. His [paper with van de Geijn](https://doi.org/10.1145/1356052.1356053) explains why this works: the performance of the whole matrix product rests on a small inner kernel, tuned to the registers and caches of a specific chip. So when your stiffness matrix is factorised, the arithmetic is done by instructions like `vfmadd231pd`, a fused multiply-add on four doubles at once, arranged by specialists and refined for two decades. If I wrote assembly for you, I would be replacing the best assembly in the world with a first draft.

**Assembly is not one language.** There is x86-64 on most workstations, ARM on Apple laptops and on phones, RISC-V spreading, and within each family the vector extensions differ (AVX2, AVX-512, SVE). x86 even has two syntaxes, Intel and AT&T. When I answer, I do not know which processor will run the code. A compiler on your machine does (`-march=native`), and OpenBLAS checks at run time. Your Python runs unchanged on all of them.

**I speak the language you wrote.** I learned from public code, and the public writes Python. In GitHub's [Octoverse 2025](https://github.blog/news-insights/octoverse/octoverse-a-new-developer-joins-github-every-second-as-ai-leads-typescript-to-1/) report it ranked second only to TypeScript, and it remains dominant in AI and data science; assembly is a thin slice of the corpus, split across architectures and syntaxes. The benchmarks that shaped coding models, starting with [HumanEval](https://arxiv.org/abs/2107.03374), are mostly Python, and the sandboxes in which assistants run code to check their own answers are usually Python environments. There is some circularity here: models are good at Python because you write Python, and you ask for Python because models are good at it. The other points would hold even without it.

**I am a probabilistic writer.** This is the decisive point. Every token I produce has a small probability of being wrong, and the chances add up with length. A matrix product is one line in Python, `C = A @ B`; a decent assembly version runs to hundreds of lines of blocking, packing and edge cases. In assembly, errors are also silent: a wrong offset or an overwritten register gives no traceback, only a wrong number or a crash without explanation. And then someone has to check. You can read Python and judge whether it does what the physics requires; assembly is unreadable for almost everyone, most programmers included. The right language for me to write in is the one in which you can catch my mistakes.

**Where your intuition is right.** There are corners where a machine working directly in assembly does pay off. [AlphaDev](https://doi.org/10.1038/s41586-023-06004-9), a reinforcement learning agent from Google DeepMind rather than a language model, played sorting as a game whose moves are assembly instructions, and found routines for three to five elements that are now part of LLVM's C++ standard library, with speed-ups of up to 70% on short sequences. Meta's [LLM Compiler](https://arxiv.org/abs/2407.02524) was trained on 546 billion tokens of compiler intermediate code and assembly, and still managed a successful round trip from assembly back to compiler code in only 45% of cases. More recently, [Wei and colleagues](https://arxiv.org/abs/2505.11480) trained a model to rewrite the assembly produced by `gcc -O3`, obtaining an average speed-up of 1.47 with 96% of programs passing their tests. Look at the details, though. That model starts from the compiler's output rather than from scratch, and 96% passing also means 4% failing. A few weeks after the AlphaDev paper, a [short note](https://arxiv.org/abs/2307.14503) reported a plain C++ version of the three-element sort that, once compiled, ran faster than AlphaDev's in its benchmarks, despite producing one instruction more. And in every case, the result is verified exhaustively and then frozen into a library or a compiler, where everyone benefits from it through high-level code.

**Who should guess.** The whole stack is a chain of translators, and only one of them guesses. Ambiguity lives at the top, in natural language, and that is where a probabilistic translator like me is worth having: turning your words into a formal, readable, checkable program. Below that line you want translators that never guess, and they already exist. [Dijkstra](https://www.cs.utexas.edu/~EWD/transcriptions/EWD06xx/EWD667.html) saw formal notations as a privilege rather than a burden; Python is the first of them on the way down, and the last one most people can still read. Asking me for assembly would move the guesswork from the layer where you can see it to the layer where nobody can.

So, why not straight to assembly? Because your code already gets there, a few layers down, in the hands of translators that do not guess. My job is to make sure it starts from the right question.

</div>

---

<div class="post-credits">

*The cover image was generated with Gemini 3 from a prompt written by Claude Opus 5.5, and is inspired by the cover illustrations of [Real Python](https://realpython.com/). The question is mine, with the English optimized by Claude Opus 5.5; the answer is Claude Opus 5.5's own, reproduced as it came, links included (for once, it did more than polish my English).*

</div>

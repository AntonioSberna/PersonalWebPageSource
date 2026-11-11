---
title: "Publish or Plough"
subtitle: "On the stagflation of academic currency"
date: 2026-11-11
place: "Pescara, Italy"
draft: false
description: "Papers and ideas are losing value as fast as we produce them. What is left for a researcher to do?"
---

In the last addendum to [the elephant post](../2026-ecee-science-w-agents/) I compared the scientific literature to a night sky turning into a Milky Way, so crowded with stars that the constellations can no longer be read.{{< note >}}This should be the last post on the subject, unless the situation changes again or new thoughts on it come to me (both not unlikely). After this I move on: a few other ideas are waiting to take shape.{{< /note >}} Here I want to take one step further, from the sky to the purse: what happens to the value of a paper, and of an idea, when we print them faster than anyone can read them. {COLLEGAMENTO PIÙ SMOOTH ALL'ARGOMENTO, I POST DEVONO ESSERE SEMPRE SCHEMATICI MA UN FLUSSO CONTINUO, ACCOMPAGNARE IL LETTORE NELL'ARGOMENTO}

## Printing money

Economists have a word for a currency that keeps losing value while the economy around it stands still: stagflation {AGGIUNGI: MI PARE QUELLA CHE SIA AVVENUTO NEGLI ANNI '70}.  {AGGIUNGI SECONDO ME} Academia is close to it, and it got there before language models arrived.

Between 2016 and 2022, [Hanson and colleagues](https://direct.mit.edu/qss/article/5/4/823/124269/The-strain-on-scientific-publishing) counted about 47% more articles per year in Scopus and Web of Science, from roughly 1.9 to 2.8 million, while the number of practising scientists grew little, if at all. Among their metrics there is one they call, fittingly, *impact inflation*: impact factors rising across publishers, faster than any plausible rise in quality. {AGGIUGI: HO SCOPERTO CHE IL MOTIVO DI FONDO... HA UN NOME} The mechanism has a name, Goodhart's law: when a measure becomes a target, it ceases to be a good measure.{{< note >}}Goodhart [formulated it in 1975](https://doi.org/10.1007/978-1-349-17295-5) about monetary targets, which suits this post rather well. The wording quoted here is [Marilyn Strathern's (1997)](https://doi.org/10.1017/S1062798700002660), and she was writing about British universities.{{< /note >}} Nobody needs to behave badly for this to happen. It is enough that everybody behaves rationally.

{{< side src="paid-in-papers.jpeg" pos="right" width="45%" caption="Paid in papers, change given in impact factor." >}}

(I am part of the statistics. As I write, I am a breath away from 300 citations, with an h-index close to ten. [Hirsch](https://www.pnas.org/doi/10.1073/pnas.0507655102) suggested that an h-index growing by about one point per year of activity marks a successful scientist,{{< note >}}His scale was calibrated on physicists: about one point per year for a successful scientist.{{< /note >}} so by his own yardstick I am an anomaly. In some corridors, though, I have been read as an anomaly in the other direction, and over the years I have collected every kind of encouragement to publish more, from the most academic to the most prosaic.)

{COLLEGAMENTO PIÙ SMOOTH}
That was the paper. Now the idea. A few days ago I came across a [news piece in *Nature*](https://www.nature.com/articles/d41586-026-03476-3) with a telling set of numbers. The ERC Starting Grant, one of the most coveted grants in Europe, received 7,710 proposals for the 2027 call, against 4,807 the year before, while the grants available dropped from 421 to at most 373 because of funding constraints. The success rate is expected to fall below 5%, the lowest since the very first call in 2007. AI is only part of the story: the eligibility window has widened, and more applications come from outside Europe. But writing a proposal has become much easier (I touched on other sides of this in [the post on who else reads my proposal](../2026-llm-privacy/)), while the funds, and the capacity to actually carry out the research, have not grown with it. Neither have the people who evaluate it: in the words of ERC president Maria Leptin, quoted in the same piece, "there aren't enough referees". Lynn Kamerlin, who has [studied grant success rates](https://doi.org/10.1038/s44319-026-00779-4), told *Nature* that a healthy rate sits around 20%; below it, telling the best proposals apart is little more than a lottery.

More currency, the same goods, fewer buyers.

## What the oxen cannot do

Project the trend a few years forward. Papers will be written by agents, each batch more convincing than the last, as recent cases have already shown (I wrote about one of them [from Berlin](../2026-ecee-science-w-agents/)). Ideas will come the same way: give a language model a literature review, which by now it can compile on its own, and a handful of hints, perhaps the only human contribution left so far, steering it through a brainstorm, and it returns research directions that read well enough to be funded. The question then is what is left to read in a proposal. If a published paper no longer tells us much about the researcher who signs it, and neither does the idea, then counting papers, citations and h-indices to hire, promote or fund someone measures the wrong thing, and the sooner we retire this kind of bibliometric evaluation, the better.

{{< side src="wheel-of-fortune.jpeg" pos="left" width="45%" caption="Below 20%, the wheel does the reviewing." >}}

So what is a researcher for? The image that keeps coming back to me is a farmer before the industrial revolution, walking behind a plough pulled by oxen. The oxen supply the force: without them he could not move the ploughshare an inch. But they do not know which field to break, how deep the furrow should go, or when the soil is ready. He does.

The image is older than it looks, and it hangs in the same sky this post started from. What Americans call the Big Dipper and the British the Plough, the Romans called *septentriones*, the seven plough oxen, and from them they named the north itself.{{< note >}}Varro and Aulus Gellius describe a yoked pair of oxen as a triangle, without saying where the third vertex is. [García Hernández](https://openpolar.no/Record/ftrecyt:oai:recyt.fecyt.es:article%2F96917) suggests it is the ploughman.{{< /note >}} Beside them stands Boötes, the ox-driver. Even up there, the oxen point north without getting anywhere by themselves: someone drives them, and someone fits the harness that turns their strength into a furrow. (Those who work with agents use the same word for the scaffolding of tools, instructions and checks built around a model. Farmers just got there first, by a few millennia.)

**The work of research must shift from producing to directing.** And if the producing is no longer done by the researcher, measuring researchers by how much they produce is, at best, an anachronism.

## Fewer papers, other readers

If that is the job, we should change the products too. For humans, we could return to what scientific writing looked like at the beginning of the twentieth century: a few pages explaining an idea to another person, with room for speculation, openly declared as such. Einstein called his 1905 paper on light quanta [*a heuristic point of view*](https://doi.org/10.1002/andp.19053220607): the speculation was in the title, not hidden in the discussion.

For the agents, a separate product altogether: everything they need to use and check the work, data, code, models, results in a form a machine can verify. As I have found first-hand, much of this can already be written in natural language, and these machine-facing documents will only grow more sophisticated and more precise. What matters is to keep them apart from the human ones. Today's paper sits awkwardly in between, half technical record for reproducibility, half interpretation for the reader, and fully serves neither. Splitting it in two would let each half do its job. And evaluation would look at whoever drives the oxen, not at furrows the oxen dug on their own.{{< note >}}How language models could help with that, without simply grading other language models, deserves a post of its own.{{< /note >}}

The sooner we make these changes, the better. The alternative is to be swept along by something we cannot control, and then rush to repair the damage with improvised solutions: the history of disaster response is full of them.

<br>

For decades the rule was *publish or perish*. The numbers say that the currency it relied on is inflating: more papers than anyone can read, more proposals than anyone can fund, while money, people and referees stand still. Language models will only speed this up, because they make both the paper and the idea cheap to produce, and a measure of how much we produce stops measuring us. What they do not make cheap is direction: choosing the field, the depth of the furrow, the season. That is where the researcher's work is moving, and that is what evaluation should look at, while papers go back to being written for people and a separate set of products is built for machines.

Hanson and colleagues close by recommending CVs that highlight researchers' best work over total volume. It is a good start. The choice ahead looks less like publish or perish, and more like publish or plough. In a sky this crowded, the question is no longer how many stars we have added. It is whether anyone still knows where north is, and who is driving the oxen to get there.

<div class="post-credits">

Ideas and text are mine, English Claude Opus 5.5 optimized. Illustrations were generated with ChatGPT Images 2.5 from prompts I wrote and Claude Opus 5.5 optimized.

</div>

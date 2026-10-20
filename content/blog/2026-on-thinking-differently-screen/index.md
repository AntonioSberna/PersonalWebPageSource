---
title: "These Are All English Words"
subtitle: "On thinking differently in front of a screen"
date: 2026-10-20
place: "Pescara, Italy"
draft: false
description: "I no longer write code with my hands, and I no longer google. Notes from a millennial on a shift that will not be reversed."
---

A few weeks ago I showed a professor the latest developments of the framework we are building together. Among them was something I was rather proud of: an MCP server, a layer that lets a language model use the framework directly, building models, running analyses, reading results[aggiungi qualcosa che sul come ho scoperto l'mcp e la mia esperienza sarà tema di uno specifico post]. He scrolled through the code for a while, frowned, and said: "But these are all English words."

He was right. Most of what makes an MCP server work is not code in the traditional sense. It is descriptions: what each tool does, when to use it, what the inputs mean, what can go wrong. Sentences written for a reader that happens to be a machine. To a structural engineer trained on Fortran and loops[togli fortran e metti che il primo corso di informatica il primo anno del bachelor era su C], it must have looked like documentation that had swallowed the program.

It took me a moment to realise that his remark described not just the file, but me.

## Code without typing

{{< side src="xkcd_378_real_programmers.png" pos="right" width="40%" caption="Real programmers, before they started talking. [xkcd #378](https://xkcd.com/378/) by Randall Munroe, CC BY-NC 2.5." >}}

I no longer write code. Not in the sense I was taught, at least. I describe what I want, I discuss the data flow, I argue about units and sign conventions, I review what comes back, and I ask for corrections. In words. The keyboard is still there, but it has become a microphone with buttons.

This is not laziness, or not only. The hard part of scientific programming was never the syntax: it was knowing what the code should do, and whether what it does is physically meaningful. That part has not gone anywhere. If anything, it is now the whole job. What has gone is the long, silent negotiation with the compiler [al posto del compilatore metti qualcosa riguardo gli interpretati, qualcosa sugli errori], the hour spent on a misplaced index, the small pleasure of a loop that finally runs.

In January 2023, [Andrej Karpathy](https://en.wikipedia.org/wiki/Andrej_Karpathy)[commento tra parentesi di leggere la biografia] [tweeted](https://twitter.com/karpathy/status/1617979122625712128) that the hottest new programming language is English. At the time it sounded like a provocation. Two years later, in my daily work it has become a plain description.

The idea itself is much older than the tweet. There is a whole field called [natural language programming](https://en.wikipedia.org/wiki/Natural_language_programming), where programs are written as structured English sentences that map, one by one and without ambiguity, onto procedures in a conventional language. Back in 1979 (Dijkstra)[https://it.wikipedia.org/wiki/Edsger_Dijkstra] had already dismissed the whole ambition in a short essay with a title that leaves little room for doubt, (*On the foolishness of "natural language programming"*)[https://www.cs.utexas.edu/~EWD/transcriptions/EWD06xx/EWD667.html]. I will be honest: I understand very tiny little of this, and I am in no position to say whether what I do every day counts as its fulfilment or as exactly the foolishness Dijkstra warned about. Probably a bit of both.

## My agent's thinking

{{< side src="xkcd_303_compiling.png" pos="left" width="40%" caption="The original excuse. [xkcd #303](https://xkcd.com/303/) by Randall Munroe, CC BY-NC 2.5." >}}

There is an old xkcd strip that every programmer of a certain age knows by heart. Two developers are sword-fighting on office chairs in the corridor, the boss shouts at them to get back to work, and they answer: "Compiling!" The boss: "Oh. Carry on." My older brother had it pinned on the wall of his room in the years he was studying computer science at university. It might still be there; I should ask my father to check.

The joke was about time. Compiling was dead time, legitimate and untouchable, the only moment in which a programmer could do nothing without feeling guilty.

Today the strip would need a new line. "Get back to work!" "My agent's thinking!" And yet it does not quite work, because those minutes are no longer empty. While the agent writes, I read what it wrote five minutes ago, I check the units, I prepare the next request. The waiting has not disappeared, it has changed nature: from idle time to review time. There is no corridor and no sword-fight. Only a slightly different kind of tiredness.

Some things, however, have improved without a doubt. The Catholic Church has already taken up the subject: in May, Pope Leo XIV published [*Magnifica Humanitas*](https://www.vaticannews.va/en/pope/news/2026-05/pope-leo-xiv-encyclical-magnifica-humanitas-ai.html), his first encyclical, devoted to the human person in the age of artificial intelligence. My girlfriend is reading it these days and keeps praising how beautifully it is written. I have not read it yet, so I cannot say whether it addresses the aspect I find most relevant. But I am confident that, once the general public grasps what agents can do, religious leaders all over the world will endorse them, if only for the dramatic drop in blasphemy and swearing among people debugging code. In Italy alone, the effect on the national balance of sins should be measurable.

## The search box is empty

{{< side src="xkcd_979_wisdom_of_the_ancients.png" pos="right" width="40%" caption="How we used to look for answers. [xkcd #979](https://xkcd.com/979/) by Randall Munroe, CC BY-NC 2.5." >}}

The same thing happened, more quietly, with search. I do not remember the last time I opened Google to look for something technical. I ask. In full sentences, with context, with follow-up questions, and I expect an answer rather than ten blue links to open, skim and compare.

For a millennial, this is not a small thing. My generation grew up learning how to google. It was a skill: choosing the right keywords, stripping a question down to its essential nouns, adding quotes, excluding terms, knowing which forum would have the answer. We spoke to search engines in a strange, telegraphic dialect, and we were good at it. That dialect is becoming useless, like knowing how to fold a road map.

## A second migration

Those of us born in the late eighties have already migrated once. We remember the encyclopedia on the shelf, then the one on CD-ROM, then the browser. We adapted, and we were proud to be the generation that bridged the analogue and the digital worlds.

Now we are migrating again, and this time the change is less visible but deeper. It is not the tool that has changed; it is the way the brain approaches the screen. In front of a computer I no longer think in commands, keywords and syntax. I think in intentions, questions and explanations. I think as if someone were listening, because someone, or something, is.

I notice it in small ways. I get impatient with software that requires me to click through menus. I phrase my own notes as if they were prompts. When something does not work, my first instinct is no longer to search for the error message, but to explain the problem.

## No way back

Is this good? I honestly do not know. There is something lost in no longer struggling with the machine: the struggle taught us how things work underneath, and I suspect a generation that has never debugged by hand will understand its tools in a different, perhaps thinner way. There is also something gained: time, reach, and the possibility of building in weeks what would once have taken years.

But whether it is good is almost beside the point. Nobody goes back to the road map once they have used a navigator, even those who complain that we have lost our sense of direction. The same will happen here. We will not return to typing every line, nor to the search box with its carefully chosen keywords.

Perhaps the professor's remark is the best summary of where we are. After decades of learning to speak the language of machines, we have finally taught them ours. The question is whether, in the process, we will forget how to speak theirs.

---
# Documentation: https://wowchemy.com/docs/managing-content/

title: "Genetic algorithm-based optimization procedure for the seismic retrofitting of existing masonry structures"
authors:
  - Di Trapani Fabio
  - admin
  - Demartino Cristoforo
  - Marano Giuseppe C
date: 2022-08-23T00:00:01+01:00
doi: ""

# Schedule page publish date (NOT publication's date).
publishDate: 2022-08-23T00:00:01+01:00

# Publication type.
# Legend: 0 = Uncategorized; 1 = Conference paper; 2 = Journal article;
# 3 = Preprint / Working Paper; 4 = Report; 5 = Book; 6 = Book section;
# 7 = Thesis; 8 = Patent
publication_types: ["1"]

# Publication name and optional abbreviated publication name.
publication: "CST - 14<sup>th</sup> International Conference on Computational Structures Technology, 23<sup>rd</sup>-25<sup>th</sup> August 2022 | Montpellier (France)"
publication_short: ""

abstract: "The design of seismic retrofitting of existing masonry structures mainly concerns the determination of the position and the arrangement of reinforcements. The implementation of these interventions is generally associated with noticeable costs, significant downtime, and relevant invasiveness. Despite the vast variety of efficient retrofitting interventions available, the design of retrofitting interventions in masonry structures is not straightforward, as the reinforcement techniques can significantly change strength but also stiffness, and masses. This can lead to recursive design issues that are mainly tackled with several trial-and-error attempts and engineers’ intuition. This paper presents a novel optimization framework aimed at the minimization of seismic retrofitting-related costs by pinpointing the optimal position (topological optimization) of glass-fibers (GFRP) reinforced plasters in masonry structures. In the proposed framework a 3D masonry model implemented in OpenSees is handled by the proposed genetic algorithm developed in MATLAB®. The metaheuristic procedure allows obtaining the optimal solution without the need of evaluating all the possible solutions that could involve huge computational effort. The characteristics of each tentative solution are encoded on a design vector of Booleans representing the position of reinforced walls inside the structure. The fitness of each solution is evaluated through an objective function that estimates the intervention costs indirectly calculating the area of GFRP implemented. The optimal solution is searched by selecting the best individuals of each generation through a tournament selection and mixing their design vector with the crossover genetic operator. In order to prevent stacks into local minima, the mutation operator is involved to introduce modest random alterations of the genes. The feasibility of each configuration is controlled by flexural and shear safety checks of masonry walls. The possible unfeasibilities are taken into account in the procedure with a penalty function that increases fictitiously the fitness according to the size of walls that do not achieve the safety checks. The routine is stopped when the cost is minimized, namely when no further cost reductions are obtained from subsequent generations. The framework is tested with a real case study structure, showing the suitability of the algorithm to provide cost-effective retrofitting solutions. The proposed algorithm can be an efficient support to engineers in the preliminary design of seismic retrofitting, allowing effortless identification of optimal solutions with a significant reduction in implementation costs that allows better management of funds allocated in seismic retrofitting of earthquake-prone areas building heritage."

# Summary. An optional shortened abstract.
summary: ""

tags: ["structural optimization", "existing structures", "seismic retrofitting", "genetic algorithms", "masonry structures", "CRM", "OpenSees", "non-linear static analyses"]
categories: ["conference proceeding"]
featured: false

# Custom links (optional).
#   Uncomment and edit lines below to show custom links.
# links:
# - name: Follow
#   url: https://twitter.com
#   icon_pack: fab
#   icon: twitter

url_pdf:
url_code:
url_dataset:
url_poster:
url_project:
url_slides:
url_source: https://www.cstconference.com/conference-program.asp
url_video:

# Featured image
# To use, add an image named `featured.jpg/png` to your page's folder. 
# Focal points: Smart, Center, TopLeft, Top, TopRight, Left, Right, BottomLeft, Bottom, BottomRight.
image:
  caption: ""
  focal_point: ""
  preview_only: false

# Associated Projects (optional).
#   Associate this publication with one or more of your projects.
#   Simply enter your project's folder or file name without extension.
#   E.g. `internal-project` references `content/project/internal-project/index.md`.
#   Otherwise, set `projects: []`.
projects: []

# Slides (optional).
#   Associate this publication with Markdown slides.
#   Simply enter your slide deck's filename without extension.
#   E.g. `slides: "example"` references `content/slides/example/index.md`.
#   Otherwise, set `slides: ""`.
slides: ""
---

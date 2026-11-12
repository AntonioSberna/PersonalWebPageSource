{{- /* Clean Markdown copy of a blog post, for agents and text tools (served as …/post/index.md).
       Shortcodes are turned into plain Markdown: margin notes become footnotes, updates become
       dated sections, images get absolute URLs. */ -}}
{{- $base := strings.TrimSuffix "/" site.BaseURL -}}
{{- $c := .RawContent -}}
{{- /* links: ../post/ and /path become absolute, files of the post folder too */ -}}
{{- $c = replaceRE `\]\(\.\./([^)\s]+)\)` (printf "](%s/blog/$1)" $base) $c -}}
{{- $c = replaceRE `\]\(/([^)\s]*)\)` (printf "](%s/$1)" $base) $c -}}
{{- $c = replaceRE `\]\(([^):#/?\s]+\.[A-Za-z0-9]{2,5})\)` (printf "](%s$1)" .Permalink) $c -}}
{{- /* dated updates */ -}}
{{- range findRESubmatch `\{\{%\s*update\s+date="(\d{4}-\d{2}-\d{2})"\s*%\}\}` $c -}}
  {{- $c = strings.Replace $c (index . 0) (printf "## Update, %s\n" ((time.AsTime (index . 1)).Format "2 January 2006")) 1 -}}
{{- end -}}
{{- $c = replaceRE `\{\{%\s*/update\s*%\}\}` "" $c -}}
{{- /* side images */ -}}
{{- range findRESubmatch `\{\{<\s*side\s+(.*?)\s*>\}\}` $c -}}
  {{- $attrs := index . 1 -}}
  {{- $src := index (index (findRESubmatch `src="([^"]*)"` $attrs) 0) 1 -}}
  {{- if not (hasPrefix $src "http") }}{{ $src = printf "%s%s" $.Permalink $src }}{{ end -}}
  {{- $cap := "" -}}
  {{- with findRESubmatch `caption="([^"]*)"` $attrs }}{{ $cap = index (index . 0) 1 }}{{ end -}}
  {{- $img := printf "\n\n![%s](%s)\n\n" ($cap | markdownify | plainify) $src -}}
  {{- $c = strings.Replace $c (index . 0) $img 1 -}}
{{- end -}}
{{- /* podcast embeds */ -}}
{{- range findRESubmatch `\{\{<\s*spotify\s+(.*?)\s*>\}\}` $c -}}
  {{- $id := index (index (findRESubmatch `id="([^"]*)"` (index . 1)) 0) 1 -}}
  {{- $type := "episode" }}{{ with findRESubmatch `type="([^"]*)"` (index . 1) }}{{ $type = index (index . 0) 1 }}{{ end -}}
  {{- $c = strings.Replace $c (index . 0) (printf "[Listen on Spotify](https://open.spotify.com/%s/%s)" $type $id) 1 -}}
{{- end -}}
{{- /* margin notes -> footnotes */ -}}
{{- $notes := slice -}}
{{- range $i, $m := findRESubmatch `(?s)\{\{<\s*note\s*>\}\}(.*?)\{\{<\s*/note\s*>\}\}` $c -}}
  {{- $c = strings.Replace $c (index $m 0) (printf "[^%d]" (add $i 1)) 1 -}}
  {{- $notes = $notes | append (index $m 1 | strings.TrimSpace | replaceRE `\s*\n\s*` " ") -}}
{{- end -}}
{{- /* leftover HTML used for layout */ -}}
{{- $c = replaceRE `<br\s*/?>` "" $c -}}
{{- $c = replaceRE `<i lang="[^"]*">(.*?)</i>` "*$1*" $c -}}
{{- $c = replaceRE `(?s)<p class="post-credits">(.*?)</p>` "$1" $c -}}
{{- /* text written by a model: keep its boundaries explicit */ -}}
{{- $c = replaceRE `(?s)<div class="llm-answer" data-model="([^"]*)">(.*?)</div>` "*[Beginning of the answer written by $1]*\n$2\n*[End of the answer written by $1]*" $c -}}
{{- $c = replaceRE `</?div[^>]*>` "" $c -}}
{{- $c = replaceRE `\n{3,}` "\n\n" $c -}}
{{- $updates := partial "post-updates.html" . -}}
# {{ .Title }}
{{ with .Params.subtitle }}
*{{ . }}*
{{ end }}
- Author: {{ site.Params.author }} ({{ site.Params.role }}, {{ site.Params.organization }})
- Published: {{ .Date.Format "2 January 2006" }}{{ with .Params.place }}, {{ . }}{{ end }}
{{- with $updates }}
- Updated: {{ range $i, $d := . }}{{ if $i }}, {{ end }}{{ $d.Format "2 January 2006" }}{{ end }}
{{- end }}
- Web page: {{ .Permalink }}
{{- with .Params.mastodon }}
- Discussion: {{ . }}
{{- end }}
- License: CC BY 4.0 ({{ "license/" | absURL }}). Cite as: {{ site.Params.author }}, "{{ .Title }}", {{ .Date.Format "2 January 2006" }}, {{ .Permalink }}
{{ with .Description }}
> {{ . }}
{{ end }}
---

{{ strings.TrimSpace $c }}
{{ with $notes }}
---

{{ range $i, $n := . }}[^{{ add $i 1 }}]: {{ $n }}
{{ end }}{{ end }}

/*

Convert simple markdown to LaTeX.

Author: x4Cx58x54

Usage: node md2tex.js filename
  convert `filename_content.md' into LaTeX and write to
  `filename_content.tex', which is read by `input' command
  in `filename.tex'.


Supported Markdown Syntax:

flag_sectioning:

# Chapter
# *Unnumbered Chapter
## Section
## *Unnumbered Section
### Subsection
### *Unnumbered Subsection
#### Subsubsection
#### *Unnumbered Subsubsection
##### Paragraph
##### *Unnumbered Paragraph
###### Subparagraph
###### *Unnumbered Subparagraph

flag_chn_period:

Convert Chinese period (。) into dot (.)

flag_chn_punct:

Convert Chinese punctuations (，。；：（）？！) into western (, . ; :  () ? ! )

flag_img:

![caption](filename)label,size

flag_misc:

* list item

`teletype`

```
code
```

$$
equation environment
$$


flag_bf_it:

**bold**
*italics*


N.B.: Nesting structure may lead to undefined behaviour.
      This script handles only simple markdown after all.
      Do not forget proofreading the result.

*/

var fs = require('fs');

const args = process.argv.slice(2)

var file_name = args[0];
var file_name_md = file_name + '_content.md';
var file_name_tex = file_name + '_content.tex';

var flag_sectioning = true;
var flag_chn_period = false;
var flag_chn_punct = true;
var flag_img = true;
var flag_misc = true;
var flag_bf_it = false; //buggy!

var regex_replace = [];

if (flag_sectioning) {
  regex_replace = regex_replace.concat( [
      [/^# \*(.*)/gm, '\\chapter*{$1}'],
      [/^# (.*)/gm, '\\chapter{$1}'],
      [/^## \*(.*)/gm, '\\section*{$1}'],
      [/^## (.*)/gm, '\\section{$1}'],
      [/^### \*(.*)/gm, '\\subsection*{$1}'],
      [/^### (.*)/gm, '\\subsection{$1}'],
      [/^#### \*(.*)/gm, '\\subsubsection*{$1}'],
      [/^#### (.*)/gm, '\\subsubsection{$1}'],
      [/^##### \*(.*)/gm, '\\paragraph*{$1}'],
      [/^##### (.*)/gm, '\\paragraph{$1}'],
      [/^###### \*(.*)/gm, '\\subparagraph*{$1}'],
      [/^###### (.*)/gm, '\\subparagraph{$1}'],
    ]
  )
}

if (flag_chn_period) {
  regex_replace = regex_replace.concat( [
      [/。/gm, '. '],
    ]
  )
}

if (flag_chn_punct) {
  regex_replace = regex_replace.concat( [
      [/，/gm, ', '],
      [/。/gm, '. '],
      [/；/gm, '; '],
      [/：/gm, ': '],
      [/（/gm, ' ('],
      [/）/gm, ') '],
      [/？/gm, '?'],
      [/！/gm, '!'],
      // [/“/gm, '``'],
      // [/”/gm, '\'\''],
      // [/‘/gm, '`'],
      // [/’/gm, '\''],
    ]
  )
}

if (flag_img) {
  regex_replace = regex_replace.concat( [
      // single image
      // usage: ![caption](filename)label,size
      // at the beginning of line
      // e.g.: ![example](./img/example.png)fig:example,width=0.8\textwidth
      [
        /^!\[(.*)\]\((.*)\)(.*),(.*)$/gm,
        `
\\begin{figure}[!ht]
  \\centering
  \\includegraphics[$4]{$2}
  \\caption{$1}
  \\label{$3}
\\end{figure}`
      ],
    ]
  )
}

if (flag_misc) {
  regex_replace = regex_replace.concat( [
      [/^\* /gm, '\\item '], // before flag_bf_it?
      // [/<([^>]*)>/gm, '\\href{$1}{$1}'],
      // [/\[(.*)\]\((.*)\)/gm, '\\href{$2}{$1}'],
      [/^```([^`]*)^```/gms, '\\begin{lstlisting}[style=shared]$1\\end{lstlisting}'],
      [/\$\$([\n\s\S]*?)\$\$/gm, '\\begin{equation}$1\\end{equation}'],
      [/`([^`]*)`/gm, '\\texttt{$1}'],
      // [/\$([^\$]*)\$/gm, '$$$1$$'],
    ]
  )
}

if (flag_bf_it) {
  regex_replace = regex_replace.concat( [
      [/\*\*([^\*]*)\*\*/gm, '{\\bfseries $1}'],
      [/\*([^\*]*)\*/gm, '{\\textit $1}'],
    ]
  )
}


fs.readFile(file_name_md, 'utf8', function(err, content){

  if (err) return console.log(err);

  for (var i in regex_replace) {
    content = content.replace(regex_replace[i][0], regex_replace[i][1]);
  }

  fs.writeFile(file_name_tex, content, 'utf8', function (err) {
    if (err) return console.log(err);
  });

})

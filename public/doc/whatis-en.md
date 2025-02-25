# What is CanticleJS?

CanticleJS is the latest incarnation of a program to experiment with the phenomenon named Cellular Automatons. Basically all you can do with it is generate interesting images.

Wikipedia has a great article about [Cellular Automatons](https://wikipedia.org/wiki/Cellular_automaton). I can't say I understand all the Math behind this article, but then I'm mainly interested in generating engaging images. The kind of Cellular Automatons generated by Canticle should probably be categorized under [Elementary Cellular Automatons](https://wikipedia.org/wiki/Cellular_automaton#Elementary_cellular_automata) although they break some of the rules.

CanticleJS generates images starting with a line, generating the next line from that and so on, working downwards. It calculates a numeric value for each pixel using as inputs the values of the pixels straight above it and to the left and right of that same pixel. By assigning each value a color the images are generated.

The first line in the image is initialized by setting one or more pixels to the maximum value, the rest are set to zero. Which pixels are set to maximum value is determined by the settings.
CanticleJS uses simple algorithms to calculate each next line. The algorithm is set through the "Formula" setting.

Every possible value of a pixel is represented by one color of the palette, the number of colors and thus the number of possible values can also be set through the 'Levels' setting. The influence of this number on the resulting image is profound. Some combinations of algorithm and levels produce hardly any output, while other combinations generate fantastic images.

Although the patterns evolving on the screen originate from a finite number of initial circumstances, they quickly reach a stage where their development seems quite unpredictable, without becoming completely chaotic. This is what fascinates me most about this phenomenon. This unpredictability is deceptive however, it's easy to demonstrate that two runs with equal initial parameters produce identical results.


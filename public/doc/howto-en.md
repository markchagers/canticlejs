# Manual

Using CanticleJS is simple: just click the button "Start over", and CanticleJS will start generating a fresh image. You can change the settings to create different images. You have to click the start button again to apply changed settings such as starting points and levels, they will not affect an image being rendered. Some other properties do affest the image being rendered, these are marked with a <span class="icon">📍</span> icon.

All settings are stored automatically (on your own computer). The next time you open CanticleJS the same settings will be active.

### Formula

The formula setting determines the algorithm used by CanticleJS to generate images. Choose a different algorithm from the dropdown menu and click Start over to use a different formula. Currently there are 6 different algorithms available. See under the tab "Formula" for an explanation. 

### Level finder

Below the formula dropdown is a button "Levels for formula n". This will open a window with a table of the results of running the formula with different levels (not all levels will produce decent results.). Shown are the levels, iterations and repetition count per levels setting. When a combination of formula and levels has a high repeat count, it usually meena the image is repetitive an not very interesting. All combinations have been calculated 20000 iterations deep, so you see that value a lot in the iterations column. 
The levels that produce images that are repetitious or stop before 500 iterations are reached are marked in dark red.

### Levels

Set the levels for the chosen formula here. This will also determine the number of colors for the image. See also under "Colors"

### Number of initial points

This determines the number of points that will be initialized to the maximum value (on the first line).

### Edge behavior

This setting determines what happens at the edges (left and right) of the image. Since either the point ptNE or ptNW is missing in these situations a value needs to be substituted. Hte effect of this setting is hard to explain, experiment, YMMV. This setting will be applied to an image being rendered.

### Random positions

Check this button to give random positions (horizontally) to the initial points. When this is unchecked, the initial points will be spread out evenly accross the first line. 

### Scroll on full screen

When this is checked, the image will start to scroll up when the bottom of the image is reached. Otherwise CanticleJS will start again at the top, overwriting the first 'page' of the image.  This setting will be applied to an image being rendered.

### Stop on just 0 and 1

This setting determines what happens when the formula/levels combination results in only the values 0 and 1 being generated. Since the image becomes rather boring when this happens. This setting will be applied to an image being rendered. Turn it off and click "Continue" to resume rendering when stopped by this setting.

### (Max) Iterations

The Iterations indicator shows the number of lines (iterations) being generated. The Max iterations setting determines when the algorithm will stop. A value of 0 for this setting means there is no limit (unless the previous setting is on and only 0 and 1's are generated).  This setting will be applied to an image being rendered. Enter a higher value (or 0) and click "Continue" to resume rendering when stopped by this setting.

### Pause/Continue

When a render is in progress, you can pause it with this button (to make a screenshot maybe?). The button changes to a Continue button, click it and the render will proceed. This button will also change when rendering stops through other causes.
Sometimes when a render stops because only 0's and 1's are generated (and the setting "Stop on just 1 or 0" is on), you can click this button a few times to get the render to continue. One combination I know of is Formula 1 with Levels 123.

### Colors

Click the 'Colors' heading to reveal more options for the colors of the image. There are a number of gradients to chose from. The colors for the image will be created from the chosen palette. The number of generated colors depends on the Levels setting above.

Below the gradients you can choose a background color for the image. Currently the options are Black, White or Grey.  This setting will be applied to an image being rendered.

The colors used in the image are displayed below the image area as a color bar. The first (leftmost) color is the background color. The others are taken from the selected gradient. The colors are generated before the calculation starts, and cannot be changed while it runs.

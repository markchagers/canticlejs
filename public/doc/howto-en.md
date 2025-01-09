# Manual

Using CanticleJS is simple: just click the button "Start over", and CanticleJS wil start generating your first image. You can change the settings to create different images. You have to click the start button again to apply the changed settings, they will not affect an image being rendered.

### Formula

The formula setting determines the algorithm used by CanticleJS to generate images. Choose a different algorythm from the dropdown menu and click Start over to use a different formula. Currently there are 6 different algorythms available. A page to explain these more in depth will be added later to this help. 
Below the formula dropdown is a button "Levels for formula n". This will open a window with a table of levels that work well with the chosen formula (not all levels will produce decent results.) The levels that produce images that are repetitious or stop before 500 iterations are reached are marked in dark red.

### Levels

Set the levels for the chosen formula here. This will also determine the number of colors for the image.

### Number of initial points

This determines the number of points that will be initialized to the maximum value (on the first line).

### Random positions

Check this button to give random positions (horizontally) to the initial points. When this is unchecked, the initial points will be spread out evenly accross the first line.

### Scroll on full screen

When this is checked, the image will start to scroll up when the bottom of the image is reached. Otherwise CanticleJS will start again at the top, overwriting the first 'page' of the image.

### Stop on just 0 and 1

This setting determines what happens when the formula/levels combination results in only the values 0 and 1 being generated. Since the image becomes rather boring when this happens.

### (Max) Iterations

The Iterations indicator shows the number of lines (iterations) being generated. The Max iterations setting determines when the algorithm will stop. A value of 0 for this setting means there is no limit (unless the previous setting is on and only 0 and 1's are generated).

### Colors

Click the 'Colors' heading to reveal more options for the colors of the image. There are a number of gradients to chose from. The colors for the image will be created from the chosen palette. The number of generated colors depends on the Levels setting above.
Below the gradients you can choose a background color for the image. Currently the options are Black, White or Grey.

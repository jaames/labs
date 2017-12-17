### Shading

The shading method is somewhat based on the effect that Ben Simonds used for his [halftone shader](https://bensimonds.com/2013/02/14/halftone-shader/). The main difference being that I adapted it into a post-processing setup because I'm rendering everything on a laptop that will in fact melt back down into its raw elements if I let it use 100% CPU for more than one hour. My reasoning was along the lines of "if the effect isn't being done in a shader then I can get away using a super low sample count, and that means I don't have to wait until the heat death of the universe for it to finish rendering". The only downside is that antialiasing isn't possible with this method, AFAIK.

I didn't bother emulating the halftone effect entirely, since converting RGB -> CMYK in Blender's node system is incredibly tedious (I really wish I could plug in a Python script node to take care of that, that would be a nice feature TBH). I just do a quick-and-dirty mix of the RGB channels, and plug the result into a repeating dot texture that's rotated by 45°. 

Ben explains how the dots are scaled based on the color value in his post:
```
Then to generate dots of the correct size, I use math nodes with the Greater Than operation to compare the value of the dot gradients pattern with the CMYK values. Thus where the input value is greater the node outputs a larger dot, because the input stays greater than the dot value for longer.
```
### Generating the waves

First, a basic flat grid mesh is warped using a script node (part of the `animation_nodes` plugin). The script loops through every point in the mesh and passes its `x` position into a [trochoidal wave algorithm](https://en.wikipedia.org/wiki/Trochoidal_wave), (Vsauce quickly explains what trochoids are in [this video](https://youtu.be/skvnj67YGmw?t=2m48s), btw!)

``` python
import math

time = bpy.context.scene.frame_current / 10

moved_vertices = []

wavelength = 20
gravity = 1
peak = -2
freq = 2.0 * math.pi / wavelength
speed = math.sqrt(gravity / freq)

for vert in vertices:

    origin = vert.x

    # generate a trochoidal wave
    waveZ = -math.exp(freq * peak) / freq * math.cos(freq * (origin + speed * time))
    waveX = math.exp(freq * peak) / freq * math.sin(freq * (origin + speed * time))
    vert.z += waveZ
    # i added a slight "overbite" to the peak of the wave, and a bit of distortion along the y axis
    vert.x += waveX - freq * math.sin(freq * vert.y) + math.cos(waveZ)

    # correct normal
    vert.y = - vert.y

    moved_vertices.append(vert)
```

On top of that, we have some further displacement provided by a noise-based texture, which is set to only affect the X axis (e.g. the sides of the waves) and is also set to use global coordinates. By fixing the texture's position in place globally it looks like the ripples are traveling backwards on the wave, and as an added bonus it also makes the animation easier to loop without any awkward jumps (and boy, do people love loops!).

Here's what the modifier setup looks like. The subsurf just bumps up the resolution of the surface so there's more detail to work with, and the texture used for the displacement is a simple procedural "cloud" texture.

![modifier setup](https://github.com/jaames/labs/blob/master/animations/ocean-waves/screenshots/modifiers.png)

### Shading

To simulate depth, the height (`z`) of the surface is plugged into a gradient, so the highest areas are white, middle areas are turquoise-green and low areas are darker blue. The height value is distorted by a texture for some small variation.

![shader setup](https://github.com/jaames/labs/blob/master/animations/ocean-waves/screenshots/shader.png)

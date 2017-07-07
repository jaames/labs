Code used to morph the vertices:

``` python
import math

# vertex_locations = list of vectors describing the location of points on a flat grid surface
# moved_vertex_locations = warped points used as output
time = bpy.context.scene.frame_current / 10
center = Vector((0, 0, 0))

moved_vertex_locations = []

# Loop through every vertex
for vert in vertex_locations:

    # Calc. vertex's distance from the center point on the x and y axis
    distX = center.x - vert.x
    distY = center.y - vert.y
    dist = math.sqrt(distX * distX + distY * distY)

    vert.z = math.sin(dist - time)

    moved_vertex_locations.append(vert)
```

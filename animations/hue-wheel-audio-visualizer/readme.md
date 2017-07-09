Code used to morph the vertices:

``` python
import math

# eq = list of floats representing the sound levels
# vertices = list of points that make a circle
center = Vector((0, 0, 0))
new_vertices = []

i = 0
for vert in vertices:

    # Calc. point's distance from the center of the circle
    distX = center.x - vert.x
    distY = center.y - vert.y
    dist = math.sqrt(distX * distX + distY * distY)

    if dist > 0:

        # Add sound level to the distance
        dist += eq[i] / 3

        # Calc. point's new position
        angle = math.atan2(vert.y, vert.x)
        vert.x = center.x + dist * math.cos(angle)
        vert.y = center.y + dist * math.sin(angle)

        i += 1

    new_vertices.append(vert)
```

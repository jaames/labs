### Issues

To draw 3D objects onto a 2D screen in a way that simulates depth via perspective, it's common practice to use [projection matrices](http://www.opengl-tutorial.org/beginners-tutorials/tutorial-3-matrices/#the-projection-matrix). I couldn't quite implement these properly for some reason, so instead I ended up going for an approximated "things that are 2x closer are 2x larger" approach, which looks something like this (in psuedocode):

```python
# camera position
camera = {x: 300, y:300, z: 1200}

# mesh is an array of points in 3d space (x, y, z)
for point in mesh:
	# scaling factor based on point's depth (z)
	f = camera.z / (camera.z - point.z)
    # point's screen position (x, y)
    x = point.x * f + camera.x
    y = point.y * f + camera.y
```

With a large enough depth range this looks reasonably beleivable, although it's definitely not accurate and brings numerous problems and limitations with it. :/

### Useful resources

- [OpenGL tutorial on matrices](http://www.opengl-tutorial.org/beginners-tutorials/tutorial-3-matrices/) - explains the concepts behind matrices + 3D vectors well and gives examples of different transform types

- [lightgl.js Matrix Class](https://evanw.github.io/lightgl.js/docs/matrix.html) - useful for referencing how to implementing certain matrix manipulations
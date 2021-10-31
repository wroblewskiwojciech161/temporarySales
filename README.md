# frontend

## Project setup

```
npm install
```

### Compiles and hot-reloads for development

```
npm run serve
```

### Compiles and minifies for production

```
npm run build
```

### Lints and fixes files

```
npm run lint
```

### Optimization of product images

GraphicsMagick or ImageMagick
Make sure GraphicsMagick or ImageMagick is installed on your system and properly set up in your PATH.

#Ubuntu:

```
apt-get install imagemagick
apt-get install graphicsmagick
```

#Mac OS X (using Homebrew):

```
brew install imagemagick
brew install graphicsmagick
```

#Windows & others:

http://www.imagemagick.org/script/binary-releases.php

Confirm that ImageMagick is properly set up by executing convert -help in a terminal.

If you have all libs installed, you can run

```bash
gulp product-images
```

product images should be stored in `product-images` directory.

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).

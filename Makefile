DIST      := tabs.js
DIST-MIN  := tabs.min.js
SRC       := $(addprefix src/,helpers.js tab.js tab-group.js)


all: dist

dist: $(DIST-MIN)

# Concatenated and transpiled ES5 version of ES6 sources
$(DIST): $(SRC)
	@cat $^ | \
	babel --no-babelrc --presets es2015 > $@


# Minified/compressed variant of ES5 version
$(DIST-MIN): $(DIST)
	@cp node_modules/babel-polyfill/dist/polyfill.min.js $@
	@uglifyjs -c --mangle < $< >> $@



# Install local dependencies
install:
	@npm install 2>/dev/null babel-core babel-preset-es2015 babel-polyfill

# Remove anything Make generated
clean:
	@rm -f $(DIST) $(DIST-MIN)

.PHONY: install clean

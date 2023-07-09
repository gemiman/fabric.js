(function() {
  var canvas = this.canvas = new fabric.Canvas();
  QUnit.module('fabric.Textbox', {
    before() {
      fabric.config.configure({ NUM_FRACTION_DIGITS: 2 });
    },
    after() {
      fabric.config.restoreDefaults();
    },
    afterEach() {
      canvas.clear();
    }
  });
  var TEXTBOX_OBJECT = {
    version: fabric.version,
    type: 'Textbox',
    originX: 'left',
    originY: 'top',
    left: 0,
    top: 0,
    width: 120,
    height: 202.5,
    fill: 'rgb(0,0,0)',
    stroke: null,
    strokeWidth: 1,
    strokeDashArray: null,
    strokeLineCap: 'butt',
    strokeDashOffset: 0,
    strokeLineJoin: 'miter',
    strokeMiterLimit: 4,
    scaleX: 1,
    scaleY: 1,
    angle: 0,
    flipX: false,
    flipY: false,
    opacity: 1,
    shadow: null,
    visible: true,
    text: 'The quick \nbrown \nfox',
    fontSize: 40,
    fontWeight: 'normal',
    fontFamily: 'Times New Roman',
    fontStyle: 'normal',
    lineHeight: 1.16,
    underline: false,
    overline: false,
    linethrough: false,
    textAlign: 'left',
    backgroundColor: '',
    textBackgroundColor: '',
    fillRule: 'nonzero',
    paintFirst: 'fill',
    globalCompositeOperation: 'source-over',
    skewX: 0,
    skewY: 0,
    charSpacing: 0,
    styles: [
      {
        start: 5,
        end: 9,
        style: { fill: "red" }
      },
      {
        start: 13,
        end: 18,
        style: { underline: true }
      }
    ],
    minWidth: 20,
    splitByGrapheme: false,
    strokeUniform: false,
    path: undefined,
    direction: 'ltr',
    pathStartOffset: 0,
    pathSide: 'left',
    pathAlign: 'baseline'
  };

  QUnit.test('constructor', function(assert) {
    var textbox = new fabric.Textbox('test');
    assert.ok(textbox instanceof fabric.Textbox);
    assert.ok(textbox instanceof fabric.IText);
    assert.ok(textbox instanceof fabric.Text);
  });

  QUnit.test('constructor with width', function(assert) {
    var textbox = new fabric.Textbox('test', { width: 400 });
    assert.equal(textbox.width, 400, 'width is taken by contstructor');
  });

  QUnit.test('constructor with width too small', function(assert) {
    var textbox = new fabric.Textbox('test', { width: 5 });
    assert.equal(Math.round(textbox.width), 56, 'width is calculated by constructor');
  });

  QUnit.test('initial properties', function(assert) {
    var textbox = new fabric.Textbox('test');
    assert.equal(textbox.text, 'test');
    assert.equal(textbox.constructor.type, 'Textbox');
    assert.ok(fabric.Textbox.cacheProperties.includes('width'), 'width is in cacheProperties');
  });

  QUnit.test('isEndOfWrapping', function(assert) {
    var textbox = new fabric.Textbox('a q o m s g\np q r s t w', {
      width: 70,
    });
    assert.equal(textbox.isEndOfWrapping(0), false, 'first line is not end of wrapping');
    assert.equal(textbox.isEndOfWrapping(1), false, 'second line is not end of wrapping');
    assert.equal(textbox.isEndOfWrapping(2), true, 'line before an hard break is end of wrapping');
    assert.equal(textbox.isEndOfWrapping(3), false, 'line 3 is not end of wrapping');
    assert.equal(textbox.isEndOfWrapping(4), false, 'line 4 is not end of wrapping');
    assert.equal(textbox.isEndOfWrapping(5), true, 'last line is end of wrapping');
  });

  QUnit.test('wrapping with charspacing', function(assert) {
    var textbox = new fabric.Textbox('xa xb xc xd xe ya yb id', {
      width: 190,
    });
    assert.equal(textbox.textLines[0], 'xa xb xc xd', 'first line match expectations');
    textbox.charSpacing = 100;
    textbox.initDimensions();
    assert.equal(textbox.textLines[0], 'xa xb xc', 'first line match expectations spacing 100');
    textbox.charSpacing = 300;
    textbox.initDimensions();
    assert.equal(textbox.textLines[0], 'xa xb', 'first line match expectations spacing 300');
    textbox.charSpacing = 800;
    textbox.initDimensions();
    assert.equal(textbox.textLines[0], 'xa', 'first line match expectations spacing 800');
  });
  QUnit.test('wrapping with splitByGrapheme and styles', function (assert) {
    const value = 'xaxbxcxdeyaybid'
    const textbox = new fabric.Textbox(value, {
      width: 190,
      splitByGrapheme: true,
      styles: [
        {
          style: {
            fontWeight: 'bold',
            fontSize: 64,
          },
          start: 0,
          end: 9,
        },
      ],
    });
    assert.deepEqual(
      textbox.textLines,
      ['xaxbx', 'cxdeyay', 'bid'],
      'lines match splitByGrapheme with styles'
    );
  });
  QUnit.test('wrapping with charspacing and splitByGrapheme positive', function(assert) {
    var textbox = new fabric.Textbox('xaxbxcxdeyaybid', {
      width: 190,
      splitByGrapheme: true,
      charSpacing: 400
    });
    assert.deepEqual(
      textbox.textLines,
      ['xaxbx', 'cxdey', 'aybid'],
      'lines match splitByGrapheme charSpacing 400'
    );
  });
  QUnit.test('wrapping with charspacing and splitByGrapheme negative', function(assert) {
    var textbox = new fabric.Textbox('xaxbxcxdeyaybid', {
      width: 190,
      splitByGrapheme: true,
      charSpacing: -100
    });
    assert.deepEqual(
      textbox.textLines,
      ['xaxbxcxdeyay', 'bid'],
      'lines match splitByGrapheme charSpacing -100'
    );
  });
  QUnit.test('Measure words', function(assert) {
    const textbox = new fabric.Textbox('word word\nword\nword', { width: 300 });
    const { wordsData, largestWordWidth } = textbox.getGraphemeDataForRender(textbox.textLines);
    assert.deepEqual(
      wordsData[0],
      [{ word: ['w', 'o', 'r', 'd'], width: largestWordWidth }, { word: ['w', 'o', 'r', 'd'], width: largestWordWidth }],
      'All words have the same length line 0'
    );
    assert.deepEqual(
      wordsData[1],
      [{ word: ['w', 'o', 'r', 'd'], width: largestWordWidth }],
      'All words have the same length line1'
    );
    assert.equal(Math.round(largestWordWidth), 82, 'largest word is 82');
  });
  QUnit.test('Measure words with styles', function(assert) {
    const textbox = new fabric.Textbox('word word\nword\nword', {
      width: 300, styles: {
        0: {
          5: {
            fontSize: 100,
          },
          6: {
            fontSize: 100,
          },
          7: {
            fontSize: 100,
          },
          8: {
            fontSize: 100,
          }
        },
        2: {
          0: {
            fontSize: 200,
          },
          1: {
            fontSize: 200,
          },
          2: {
            fontSize: 200,
          },
          3: {
            fontSize: 200,
          }
        }
      }
    });
    const { wordsData, largestWordWidth } = textbox.getGraphemeDataForRender(textbox.textLines);
    assert.equal(
      Math.round(wordsData[0][0].width),
      82,
      'unstyle word is 82 wide'
    );
    assert.equal(
      Math.round(wordsData[0][1].width),
      206,
      'unstyle word is 206 wide'
    );
    assert.deepEqual(
      wordsData[2],
      [{ word: ['w', 'o', 'r', 'd'], width: largestWordWidth }],
      'All words have the same length line1'
    );
    assert.equal(Math.round(largestWordWidth), 411, 'largest word is 411');
  });
  QUnit.test('wrapping with different things', function(assert) {
    var textbox = new fabric.Textbox('xa xb\txc\rxd xe ya yb id', {
      width: 16,
    });
    assert.equal(textbox.textLines[0], 'xa', '0 line match expectations');
    assert.equal(textbox.textLines[1], 'xb', '1 line match expectations');
    assert.equal(textbox.textLines[2], 'xc', '2 line match expectations');
    assert.equal(textbox.textLines[3], 'xd', '3 line match expectations');
    assert.equal(textbox.textLines[4], 'xe', '4 line match expectations');
    assert.equal(textbox.textLines[5], 'ya', '5 line match expectations');
    assert.equal(textbox.textLines[6], 'yb', '6 line match expectations');
  });
  QUnit.test('wrapping with splitByGrapheme', function(assert) {
    var textbox = new fabric.Textbox('xaxbxcxdxeyaybid', {
      width: 1,
      splitByGrapheme: true,
    });
    assert.equal(textbox.textLines[0], 'x', '0 line match expectations splitByGrapheme');
    assert.equal(textbox.textLines[1], 'a', '1 line match expectations splitByGrapheme');
    assert.equal(textbox.textLines[2], 'x', '2 line match expectations splitByGrapheme');
    assert.equal(textbox.textLines[3], 'b', '3 line match expectations splitByGrapheme');
    assert.equal(textbox.textLines[4], 'x', '4 line match expectations splitByGrapheme');
    assert.equal(textbox.textLines[5], 'c', '5 line match expectations splitByGrapheme');
  });
  QUnit.test('wrapping with custom space', function(assert) {
    var textbox = new fabric.Textbox('xa xb xc xd xe ya yb id', {
      width: 2000,
    });
    const wordsData = textbox.getGraphemeDataForRender(['xa xb xc xd xe ya yb id']);
    var line1 = textbox._wrapLine(0, 100, wordsData, 0);
    var expected1 =  [
      ['x', 'a', ' ', 'x', 'b'],
      ['x', 'c', ' ', 'x', 'd'],
      ['x', 'e', ' ', 'y', 'a'],
      ['y', 'b', ' ', 'i', 'd']];
    assert.deepEqual(line1, expected1, 'line1 match expected');
    assert.deepEqual(textbox.dynamicMinWidth, 40, 'texbox width is 40');
    var line2 = textbox._wrapLine(0, 100, wordsData, 50);
    var expected2 =  [
      ['x', 'a'],
      ['x', 'b'],
      ['x', 'c'],
      ['x', 'd'],
      ['x', 'e'],
      ['y', 'a'],
      ['y', 'b'],
      ['i', 'd']];
    assert.deepEqual(line2, expected2, 'line2 match expected');
    assert.deepEqual(textbox.dynamicMinWidth, 90, 'texbox width is 90');
  });
  QUnit.test('wrapping an empty line', function(assert) {
    var textbox = new fabric.Textbox('', {
      width: 10,
    });
    const wordsData = textbox.getGraphemeDataForRender(['']);
    var line1 = textbox._wrapLine(0, 100, wordsData, 0);
    assert.deepEqual(line1, [[]], 'wrapping without splitByGrapheme');
    textbox.splitByGrapheme = true;
    var line2 = textbox._wrapLine(0, 100, wordsData, 0);
    assert.deepEqual(line2, [[]], 'wrapping with splitByGrapheme');
  });
  QUnit.test('wrapping respects max line width', function (assert) {
    const a = 'xaxbxc xdxeyaybid xaxbxc';
    const b = 'xaxbxcxdxeyaybidxaxbxcxdxeyaybid';
    [true, false].forEach(order => {
      [true, false].forEach(space => {
        const ordered = order ? [a, b] : [b, a];
        const text = ordered.join(space ? ' ' : '\n');
        const { _textLines: lines } = new fabric.Textbox(text);
        assert.deepEqual(lines, ordered.map(line => line.split('')), `max line width should be respected for ${text}`);
      });
    });
  });
  QUnit.test('texbox will change width from the mr corner', function(assert) {
    var text = new fabric.Textbox('xa xb xc xd xe ya yb id', { strokeWidth: 0 });
    canvas.add(text);
    canvas.setActiveObject(text);
    var canvasEl = canvas.getElement();
    var eventStub = {
      clientX: text.width,
      clientY: text.oCoords.mr.corner.tl.y + 1,
      type: 'mousedown',
      target: canvas.upperCanvasEl
    };
    var originalWidth = text.width;
    canvas.__onMouseDown(eventStub);
    canvas.__onMouseMove({
      ...eventStub,
      clientX: eventStub.clientX + 20,
      clientY: eventStub.clientY,
      type: 'mousemove',
    });
    canvas.__onMouseUp({
      ...eventStub,
      clientX: eventStub.clientX + 20,
      clientY: eventStub.clientY,
      type: 'mouseup',
    });
    assert.equal(text.width, originalWidth + 20, 'width increased');
  });
  QUnit.test('texbox will change width from the ml corner', function(assert) {
    var text = new fabric.Textbox('xa xb xc xd xe ya yb id', { strokeWidth: 0, left: 40 });
    canvas.add(text);
    canvas.setActiveObject(text);
    var canvasEl = canvas.getElement();
    var eventStub = {
      clientX: text.left,
      clientY: text.oCoords.ml.corner.tl.y + 2,
      type: 'mousedown',
      target: canvas.upperCanvasEl
    };
    var originalWidth = text.width;
    canvas.__onMouseDown(eventStub);
    canvas.__onMouseMove({
      ...eventStub,
      clientX: eventStub.clientX - 20,
      clientY: eventStub.clientY,
      type: 'mousemove',
    });
    canvas.__onMouseUp({
      ...eventStub,
      clientX: eventStub.clientX + 20,
      clientY: eventStub.clientY,
      type: 'mouseup',
    });
    assert.equal(text.width, originalWidth + 20, 'width increased');
  });

  QUnit.test('get2DCursorLocation with splitByGrapheme', function(assert) {
    var iText = new fabric.Textbox('aaaaaaaaaaaaaaaaaaaaaaaa',
      { width: 60, splitByGrapheme: true });
    var loc = iText.get2DCursorLocation();

    // [ [ '由', '石', '墨' ],
    //   [ '分', '裂', '的' ],
    //   [ '石', '墨', '分' ],
    //   [ '裂', '由', '石' ],
    //   [ '墨', '分', '裂' ],
    //   [ '由', '石', '墨' ],
    //   [ '分', '裂', '的' ],
    //   [ '石', '墨', '分' ],
    //   [ '裂' ] ]

    assert.equal(loc.lineIndex, 0);
    assert.equal(loc.charIndex, 0);

    // '由石墨|分裂的石墨分裂由石墨分裂由石墨分裂的石墨分裂'
    iText.selectionStart = iText.selectionEnd = 4;
    loc = iText.get2DCursorLocation();

    assert.equal(loc.lineIndex, 1, 'selection end 4 line 1');
    assert.equal(loc.charIndex, 1, 'selection end 4 char 1');

    iText.selectionStart = iText.selectionEnd = 7;
    loc = iText.get2DCursorLocation();

    assert.equal(loc.lineIndex, 2, 'selection end 7 line 2');
    assert.equal(loc.charIndex, 1, 'selection end 7 char 1');

    iText.selectionStart = iText.selectionEnd = 14;
    loc = iText.get2DCursorLocation();

    assert.equal(loc.lineIndex, 4, 'selection end 14 line 4');
    assert.equal(loc.charIndex, 2, 'selection end 14 char 2');
  });

  QUnit.test('missingNewlineOffset with splitByGrapheme', function(assert) {
    var textbox = new fabric.Textbox('aaa\naaaaaa\na\naaaaaaaaaaaa\naaa',
      { width: 80, splitByGrapheme: true });

    // [ [ 'a', 'a', 'a' ],
    //   [ 'a', 'a', 'a', 'a' ],
    //   [ 'a', 'a' ],
    //   [ 'a' ],
    //   [ 'a', 'a', 'a', 'a' ],
    //   [ 'a', 'a', 'a', 'a' ],
    //   [ 'a', 'a', 'a', 'a' ],
    //   [ 'a', 'a', 'a' ] ]

    var offset = textbox.missingNewlineOffset(0);
    assert.equal(offset, 1, 'line 0 is interrupted by a \n so has an offset of 1');

    offset = textbox.missingNewlineOffset(1);
    assert.equal(offset, 0, 'line 1 is wrapped without a \n so it does have an extra char count');
  });

  QUnit.test('missingNewlineOffset with normal split', function(assert) {
    var texbox = new fabric.Textbox('aaa\naaaaaa\na\naaaaaaaaaaaa\naaa',
      { width: 160 });

    var offset = texbox.missingNewlineOffset(0);
    assert.equal(offset, 1, 'it returns always 1');
    var offset = texbox.missingNewlineOffset(1);
    assert.equal(offset, 1, 'it returns always 1');
    var offset = texbox.missingNewlineOffset(2);
    assert.equal(offset, 1, 'it returns always 1');
  });

  QUnit.test('The same text does not need to be wrapped.', function(assert) {
    var str = '0123456789';
    var measureTextbox = new fabric.Textbox(str, {
      fontSize: 20,
      splitByGrapheme: false,
    });
    var newTextbox = new fabric.Textbox(str, {
      width: measureTextbox.width,
      fontSize: 20,
      splitByGrapheme: true,
    });
    assert.equal(newTextbox.textLines.length, measureTextbox.textLines.length, 'The same text is not wrapped');
  });

})();

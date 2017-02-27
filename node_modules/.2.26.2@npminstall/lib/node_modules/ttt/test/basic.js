var tt = require('../')

if (process.argv[2] === 'child')
  tt('child', child)
else
  tt('parent', parent)

function child(t) {
  // this passes
  t.ok(true, 'yoyoyo')
  t.ok(false, 'message')
  t.equal(true, 1, 'basically the same')
  t.strictEqual(true, 1, 'but not quite')
  t.test('firstborn', function (t) {
    t.deepEqual([1,2,3], [1,2,3])
    t.test('grandchild', function (t) {
      t.ok(true)
      t.ok(false)
      t.end()
    })
    t.test('grandchild 2', function (t) {
      t.ok(true)
      t.ok(false)
      t.end()
    })
    t.end()
  })
  t.test('secondborn', function (t) {
    t.deepEqual([1,2,3], [1,2,5], 'not the same!')
    t.end()
  })
  t.end()
}

var path = require('path')
var TT = path.dirname(__dirname)
var expect = (function(){/*
# child

ok 1 ok

not ok 2 AssertionError: message
# at child ({TT}/test/basic.js:#:#
# at {TT}/tt.js:#:#
# at process._tickCallback (node.js:#:#
# at Function.Module.runMain (module.js:#:#


ok 3 equal

not ok 4 AssertionError: but not quite
# at child ({TT}/test/basic.js:#:#
# at {TT}/tt.js:#:#
# at process._tickCallback (node.js:#:#
# at Function.Module.runMain (module.js:#:#


# firstborn

ok 5 deepEqual

# grandchild

ok 6 ok

not ok 7 AssertionError: false == true
# at {TT}/test/basic.js:#:#
# at {TT}/tt.js:#:#
# at process._tickCallback (node.js:#:#
# at Function.Module.runMain (module.js:#:#


# grandchild 2

ok 8 ok

not ok 9 AssertionError: false == true
# at {TT}/test/basic.js:#:#
# at {TT}/tt.js:#:#
# at process._tickCallback (node.js:#:#
# at Function.Module.runMain (module.js:#:#


# secondborn

not ok 10 AssertionError: not the same!
# at {TT}/test/basic.js:#:#
# at {TT}/tt.js:#:#
# at process._tickCallback (node.js:#:#
# at Function.Module.runMain (module.js:#:#


0..10

# pass 5/10
# fail 5/10
*/}).toString().split(/\n/).slice(1, -1).join('\n')
.replace(/\{TT\}/g, TT)

function parent(t) {
  var spawn = require('child_process').spawn
  var args = [ __filename, 'child' ]
  var node = process.execPath
  var child = spawn(node, args)
  var stdout = ''
  var stderr = ''
  child.stdout.on('data', function(c) {
    stdout += c
  })
  child.stderr.on('data', function(c) {
    stderr += c
  })
  child.on('close', function(code, signal) {
    stdout = stdout.trim().replace(/:[0-9]+:[0-9]+(\)?)\n/g, ':#:#\n')
    t.equal(stdout.trim(), expect.trim(), 'correct output')
    t.equal(code, 5, 'error code')
    t.equal(signal, null, 'no signal')
    t.end()
  })
}

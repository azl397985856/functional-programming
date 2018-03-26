# 函数式编程-进阶
本文是函数式编程系列教程的第二篇。如果你对函数式编程不了解，可以看下之前的[函数式编程-基础篇](https://github.com/azl397985856/functional-programming/blob/master/beginer.md)。
## Hindley-Milner
开始讲接下面的内容之前，我们引入一个类型签名系统HM。它的功能非常强大，我们可以通过它知道函数做了什么，而不需要将代码读一遍。
Hindley-Milner是一个经典的类型系统，他在函数式编程中的功能非常强大。
尽管你也可以在非函数式编程中使用，但是总感觉少了点什么。
类型签名不但可以用于编译时检测，而且还可以当作文档。
HM是一个非常复杂的系统，如果大家想要学习的话，可以自己去查阅相关资料。
这里只是简单介绍下。如下是一个简单的例子：

```js
//  head :: [a] -> (a Null)
function head(arr) {
  return arr && arr.length ? arr[0] : null;
}

head(["gone"]); // "gone"

```

可以看出HM由两部分组成， part one :: part two ,前面是函数的名字，后面是函数的签名。
那么head的签名意思就是接受一个任意类型的Array，返回一个该类型的元素或者Null.


我们来看一个更加复杂的例子：
```js
//  map :: (a -> b) -> [a] -> [b]
var map = curry(function(f, xs){
  return xs.map(f);
});

```

它表达的是map这个函数接受一个a到b的一个函数, 然后接受一个任意类型数组，最后返回另外一个任意类型的数组。

我们再来看下reduce的：
```js
//  reduce :: (b -> a -> b) -> b -> [a] -> b
var reduce = curry(function(f, x, xs){
  return xs.reduce(f, x);
});

```

上面表达的是reduce，接受一个b -> a -> b 这样的函数作为参数，然后成为了另外一个函数，
这个函数接受类型b为参数,然后返回一个函数，这个函数又接受[a]作为参数，最终返回b.

> a b 虽然任意的类型，但是同一个类型签名中a类型和a类型一定是相同的，这点需要注意。

大家好好消化一下，再往后看哦～

## 再谈组合

前面我们介绍了函数组合。那么这部分我们进一步来讨论一下函数组合。

下面举一个原生JS的例子：
```js
// 假设addOne和mutiFive已经在别的地方定义
// 事实上，我们已经在上一节中写过这两个函数了。
[1,2,3,4]
.map(addOne) // [2,3,4,5]
.map(multiFive)// [10, 15, 20, 25]
```
很好，我们似乎也实现了函数组合的效果。只不过我们的风格变成了链式调用。

上面的代码使用我们上一节介绍的知识，写出来应该是`compose(multiFive, addOne)`(正如我们上一节介绍的那样)。

但如果是这样的呢？

```js
[1,2,3,4]
.reduce(add) // 15
.map(multiFive) // TypeError: xxx map is not a function 
```
实际项目中，我们不只会用到数组，我们会用到很多其他类型。这个时候我们是否可以以这种map链式调用的方式实现函数组合呢？

我们是否可以使用一种通用的方式操作所有的数据类型呢？如果有了这种通用的操作方式，是否就可以实现上面的效果了呢？

### map
我们先来看下数组是如何实现链式调用的组合效果的。

数组能够通过map实现链式调用，本质上是因为其作为一个包装对象，可以通过map这样的一个高阶函数操作其内部的数据。

那么我们是否可以封装一个包装对象，使得所有数据类型都可以通过某种方式操作呢？
而这种操作，我们习惯称之为map。


### 容器
我们来实现一个Box

```js
function Box(value) {
this.__value = value;
}

Box.prototype.of = (value) => new Box(value);

Box.prototype.map = function(fn) { return Box.of(fn(this.__value)) } // 箭头函数会丢失this到Box的指向
```

JS中的Array也是一种BOX。 它同样提供了一种操作对象的方式map。
在函数式编程中，我们称这样的BOX为functor（函子）。


函数式编程中有很多functor， 比如option，future等，
这样我们操作的所有的数据就可以链式调用了（因为它们实现了相同的契约-map）。

如果我们需要处理异步呢？如果我们需要处理错误（其中又会涉及到分支处理）呢？

 答案就是借助刚才讲到的容器。

可以说函数式编程对异步操作是很简单的。通过前面讲到的compose，我们可以将多个函数像多米诺骨牌一样组合起来，然后按照一定的顺序执行，即使他们是异步的。

> 我们需要将之前的compose做一些小改变以适应异步操作

### compose
回忆一下compose的写法：

```js

function compose(...funcs) {
  if (funcs.length === 0) {
    return arg => arg
  }

  if (funcs.length === 1) {
    return funcs[0]
  }

  return funcs.reduce((a, b) => (...args) => a(b(...args)))
}
```

以compose promise为例：
```js
function composePromise(...funcs) {
  if (funcs.length === 0) {
    return arg => arg
  }

  if (funcs.length === 1) {
    return funcs[0]
  }

  return funcs.reduce((a, b) => (...args) => Promise.resolve(...args).then(b).then(a))
}

function setTimeoutPromise(number, delay) {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			console.log(number);
			resolve()
		}, delay)
	})
}

const setTimeoutPromiseWithOne = curry(setTimeoutPromise)(1)
const setTimeoutPromiseWithTwo = curry(setTimeoutPromise)(2)
composePromise(setTimeoutPromiseWithTwo, setTimeoutPromiseWithOne)(2000) // 2s先输出1，4s之后输出2

```
可以看到我们可以将异步操作给组合起来。
我们可以将函数柯里化，实现Promise.all的效果。

可以说函数式编程对异步操作是很友好的，只是需要做一些小小的”把戏“。

另外我们常常碰到的问题就是异常处理，异常处理怎么看都很难是纯函数，那么如何
以纯的方式处理异常呢？ 异常处理必然要伴随着分支处理，函数式编程又是如何处理分支处理（像if/else）呢？毕竟这些在我们的日常开发中非常常见，我们接下来解释。
我们如何处理呢？
## Either容器
答案还是借助容器，先来看下函数式 如何优雅实现if/else,我们需要学习一个新的容器，
我们称之为Either.


```js

// either做的事情就是在有value的时候将构造一个Right容器，
// 否则构造一个Left容器,Left调用map操作数据的时候，不会发生任何事情
// 我们可以通过定制化msg，定制一些诸如错误信息之类的
var Either = function(msg, value) {
    if (value) return Right.of(value);
    return Left.of(msg)
}
var Left = function(x) {
  this.__value = x;
}

Left.of = function(x) {
  return new Left(x);
}

Left.prototype.map = function(f) {
  return this; // 什么都不做
}

var Right = function(x) {
  this.__value = x;
}

Right.of = function(x) {
  return new Right(x);
}

Right.prototype.map = function(f) {
  return Right.of(f(this.__value));
}

```

我们可以用Either来实现一下上面的异常处理。

```
function readFile(filename) {
  return Either('filename shouldn't be empty!', filename)
}

readFile() // Left {__value: "filename shouldn't be empty!"}
readFile('./test.txt') // Right {__value: "./test.txt"}
```
我们没有使用throw error，而是以一种更加温和更加纯粹的方式处理。


## 处理异步
那么如何处理异步呢？ 没错，我们再来引入一个容器，叫Task。
Task的实现稍微复杂，在这里不再实现，大家可以自行查阅详细信息，如果你不想查，
那么你可以暂时把它看成Promise(两者相似，但也有不一样的地方)。

异步处理是不纯的，是有副作用的，我们可以直接通过HM看到哪些函数是不纯粹的。

正如Martin Odersky 在 [Google Groups Scala debate](https://groups.google.com/forum/#!topic/scala-debate/xYlUlQAnkmE%5B251-275%5D)
阐述的一样。

> The IO monad does not make a function pure. It just makes it obvious that it’s impure

拿http获取用户信息为例：

```js
//  fetchUserInfo :: Number -> Task(Error, JSON)
function fetchUserInfo(id) {
  return new Task(function(reject, result) {
    httpGet(`/user/${id}`, function(err, data) {
      err ? reject(err) : result(data);
    });
  });
};
 // 假设data是{ name: 'lucifer', id: 1001, sex: 'male'}
fetchUserInfo(1001).map(getName).map(toUpperCase); // LUCIFER
```
是不是觉得task和Promise很像，map就像then。


我们再来一个更加复杂的例子，
我们需要读取本地文件，然后根据文件读取的内容去请求另外一个服务的数据。（以下例子摘自[mostly-adequate-guide](https://github.com/MostlyAdequate/mostly-adequate-guide），我稍加了修改。

```js
//  upload :: String -> (String -> a) -> Void
var upload = function(filename, callback) {
  if(!filename) {
    throw  new Error("filename should't be empty!");
  } else {
    readFile(filename, function(err, data) {
      if(err) throw err;
      httpPost(data, function(err, result) {
        if(err) throw err;
        callback(result);
      });
    });
  }
}

```

上面的代码如何用函数式编程重构一下，前提当然是readFile， httpPost也是函数式的写法喽。


```js
// readFile :: Filename -> Either String (Future Error String)
// httpPost :: String -> Future Error JSON

//  upload :: String -> Either String (Future Error JSON)
var upload = compose(map(map(httpPost('/uploads'))), readFile);

```

从类型签名可以看出，我们预防了三个错误——readFile 使用 Either 来验证输入（或许还有确保文件名存在）；readFile 在读取文件的时候可能会出错，错误通过 readFile 的 Future 表示；文件上传可能会因为各种各样的原因出错，错误通过 httpPost 的 Future 表示。我们就这么随意地使用 chain 实现了两个嵌套的、有序的异步执行动作。
所有这些操作都是在一个线性流中完成的，是完完全全纯的、声明式的代码，是可以等式推导（equational reasoning）并拥有可靠特性（reliable properties）的代码。我们没有被迫使用不必要甚至令人困惑的变量名，我们的 upload 函数符合通用接口而不是特定的一次性接口。

为了帮助大家理解，这里附一下函数式的readFile和httpPost的实现。

函数式实现：
```js
// readFile :: Filename -> Either String (Future Error String)
function readFile(filename) {
  return Either('filename shouldn\'t be empty!', new Task((resolve, reject) => {
      fs.readFile(filename, (err, data) => {
        if (err) return reject(err);
        resolve(data);
      }
    )}
  ))
}

function http(method, url, data) {
  return new Task((resolve, reject) => {
    http[method](url, {data}, (err, data) => {
      if (err) return reject(err);
      resolve(data);
    })
  })
}
// httpPost :: String -> Future Error JSON
var httpPost = curry(http('post', '/path');

```

可以看出我们的代码重用性非常强。

## 总结
下一节我们来介绍monad，applicative，以及一些类型推导，集合方面的知识。
## 参考
[from-callback-to-future-functor-monad](https://hackernoon.com/from-callback-to-future-functor-monad-6c86d9c16cb5)

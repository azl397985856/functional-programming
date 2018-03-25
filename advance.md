# 函数式编程-进阶
本文是函数式编程系列教程的第二篇。

## 副作用
前面基本上都没有提到副作用。
但是副作用在我们的应用中可以说是无处不在的。

解决副作用的方式可以是这样的。。。。。。

我们前面也讲到了函数式编程可以使副作用。
限制在很小的范围，那么如何实现呢？
## HM函数签名
Hindley-Milner是一个经典的类型系统，他在函数式编程中的功能非常强大。
尽管你也可以在非函数式编程中使用，但是总感觉少了点什么。
类型签名不但可以用于编译时检测，而且还可以当作文档。
HM是一个非常复杂的系统，如果大家想要学习的话，可以自己去查阅相关资料。
这里只是简单介绍下。

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

这个
## 容器

答案是借助容器。
### 什么是容器

### 题外话-callback and cps
### 有哪些容器
#### Promise & Future
#### IO
在Haskell中叫做IO。而在scala中可能是Option/Some/None。

正如Martin Odersky 在 [Google Groups Scala debate](https://groups.google.com/forum/#!topic/scala-debate/xYlUlQAnkmE%5B251-275%5D)
阐述的一样。

> The IO monad does not make a function pure. It just makes it obvious that it’s impure

haskell getUsername :: IO String

scala def getUsername: IO[String] = ???
## Monad
1990s
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
compose promise
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

```
> monad is callback
## ap

## 总结

## 参考
[from-callback-to-future-functor-monad](https://hackernoon.com/from-callback-to-future-functor-monad-6c86d9c16cb5)

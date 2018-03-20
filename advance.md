# 函数式编程-进阶
本文是函数式编程系列教程的第二篇。

## 副作用
前面基本上都没有提到副作用。
但是副作用在我们的应用中可以说是无处不在的。

解决副作用的方式可以是这样的。。。。。。

我们前面也讲到了函数式编程可以使副作用。
限制在很小的范围，那么如何实现呢？
## HM函数签名
## 容器

答案是借助容器。
### 什么是容器
### 有哪些容器

#### Promise
#### IO
在Haskell中叫做IO。而在scala中可能是Option/Some/None。

正如Martin Odersky 在 [Google Groups Scala debate](https://groups.google.com/forum/#!topic/scala-debate/xYlUlQAnkmE%5B251-275%5D)
阐述的一样。

> The IO monad does not make a function pure. It just makes it obvious that it’s impure

haskell getUsername :: IO String

scala def getUsername: IO[String] = ???
## Monad
1990s
## ap

## 总结
